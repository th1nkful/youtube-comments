const {
  YT_API_KEY = '',
  YT_API_URL = 'https://www.googleapis.com/youtube/v3',
} = process.env;

const findVideoId = (url: string) => {
  if (url.includes('youtu.be')) {
    return url.split('/').pop();
  }

  const match = url.match(/v=([^&]+)/);

  if (match) {
    return match[1];
  }

  return url;
};

const getVideo = async (id: string) => {
  const urlParams = new URLSearchParams({
    id: findVideoId(id) as string,
    part: 'id,statistics,snippet',
    key: YT_API_KEY,
  });

  const res = await fetch(`${YT_API_URL}/videos?${urlParams}`);

  const data = await res.json();

  const [item] = data.items;
  if (!item) {
    return null;
  }

  return {
    id: item.id,
    ...item.snippet,
    ...item.statistics,
  };
};

const getChannel = async (id: string) => {
  const urlParams = new URLSearchParams({
    id,
    part: 'brandingSettings,snippet,statistics',
    key: YT_API_KEY,
  });

  const res = await fetch(`${YT_API_URL}/channels?${urlParams}`);

  const data = await res.json();

  const [item] = data.items;
  if (!item) {
    return null;
  }

  return {
    ...item.snippet,
    ...item.brandingSettings,
    ...item.statistics,
  };
};

const formatReplies = (replies) => replies.comments.map(({ id, snippet }) => ({
  id,
  likeCount: snippet.likeCount,
  edited: snippet.textDisplay !== snippet.textOriginal,
  text: snippet.textDisplay,
  publishedAt: snippet.publishedAt,
  author: {
    name: snippet.authorDisplayName,
    image: snippet.authorProfileImageUrl,
  },
}));

const formatComments = (comments) => comments.map(({ id, snippet, replies }) => ({
  id,
  replyCount: snippet.totalReplyCount,
  likeCount: snippet.topLevelComment.snippet.likeCount,
  edited:
    snippet.topLevelComment.snippet.textDisplay !== snippet.topLevelComment.snippet.textOriginal,
  text: snippet.topLevelComment.snippet.textDisplay,
  publishedAt: snippet.topLevelComment.snippet.publishedAt,
  author: {
    name: snippet.topLevelComment.snippet.authorDisplayName,
    image: snippet.topLevelComment.snippet.authorProfileImageUrl,
  },
  topLevel: true,
  replies: replies
    ? formatReplies(replies)
    : [],
}));

const getComments = async (id: string, allComments = [], pageToken = undefined) => {
  const urlParams = new URLSearchParams({
    videoId: findVideoId(id) as string,
    part: 'id,snippet,replies',
    maxResults: '100',
    textFormat: 'html',
    order: 'relevance',
    key: YT_API_KEY,
  });

  if (pageToken) {
    urlParams.set('pageToken', pageToken);
  }

  const res = await fetch(`${YT_API_URL}/commentThreads?${urlParams}`);

  const data = await res.json();

  if (data.nextPageToken) {
    return getComments(id, [...allComments, ...data.items], data.nextPageToken);
  }

  return formatComments([...allComments, ...data.items]);
};

const getVideoDetails = async (id: string) => {
  const [
    video,
    comments,
  ] = await Promise.all([
    getVideo(id),
    getComments(id),
  ]);

  const channel = await getChannel(video.channelId);

  return {
    ...video,
    comments,
    channel,
  };
};

export default getVideoDetails;
