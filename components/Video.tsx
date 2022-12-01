import Image from 'next/image';
import React from 'react';
import { DateTime } from 'luxon';
import DOMPurify from 'isomorphic-dompurify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faExternalLinkAlt,
  faSearch,
  faThumbsUp,
  faComments,
} from '@fortawesome/free-solid-svg-icons';

const sanitizedData = (data) => ({
  __html: DOMPurify.sanitize(data)
});

const Comment = ({ comment }) => {
  const commentTextRef = React.useRef(null);

  const [isCopied, setIsCopied] = React.useState(false);

  const [showMore, setShowMore] = React.useState(false);

  const onCopyComment = () => {
    const tempDivElement = document.createElement("div");
    tempDivElement.innerHTML = comment.text;
    const text = tempDivElement.textContent || tempDivElement.innerText || comment.text;
  
    navigator.clipboard.writeText(text);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const [isLotsOfText, setIsLotsOfText] = React.useState(false);

  React.useEffect(() => {
    if (commentTextRef.current && commentTextRef.current.clientHeight > 100) {
      setIsLotsOfText(true);
    }
  });

  return (
    <article className="media">
      <figure className="media-left">
        <p className="image is-32x32">
          <Image
            src={comment.author.image}
            alt={comment.author.name}
            width={32}
            height={32}
          />
        </p>
      </figure>
      <div className="media-content">
        <div className="content">
          <p>
            <strong>{comment.author.name}</strong>
            {' '}
            <small>
              {DateTime.fromISO(comment.publishedAt).toRelative()}
            </small>
            {comment.edited && <small>(edited)</small>}
          </p>
          <div
            dangerouslySetInnerHTML={sanitizedData(comment.text)}
            ref={commentTextRef}
            style={{
              overflowY: 'hidden',
              textOverflow: 'ellipsis',
              maxHeight: showMore ? undefined : '102px'
            }}
          />
          {isLotsOfText && (
            <p className="mt-2">
              <small>
                <a className="has-text-grey" onClick={() => setShowMore((p) => !p)}>
                  {showMore ? 'Read less' : 'Read more'}
                </a>
              </small>
            </p>
          )}
          <p className="mt-4">
            <small >
              <a onClick={onCopyComment}>
                {isCopied ? 'Copied!' : 'Copy'}
              </a>
              {(comment.replyCount > 0 || comment.likeCount > 0) && (
                <span className="mx-2">
                  {' · '}
                </span>
              )}
              {comment.likeCount > 0 && (
                <span>
                  <FontAwesomeIcon icon={faThumbsUp} />
                  {'  '}
                  {comment.likeCount}
                </span>
              )}
              {(comment.replyCount > 0 && comment.likeCount > 0) && (
                <span className="mx-2">
                  {' · '}
                </span>
              )}
              {comment.topLevel && comment.replyCount > 0 && (
                <span>
                  {`${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`}
                </span>
              )}
            </small>
          </p>
        </div>
        {(comment.replies || []).map((reply) => (
          <Comment
            key={reply.id}
            comment={reply}
          />
        ))}
      </div>
    </article>
  );
};

const Video = ({ video }) => {
  const [descriptionShowMore, setDescriptionShowMore] = React.useState(false);

  const [searchInput, setSearchInput] = React.useState('');

  const isSearchActive = searchInput.length > 0;

  const commentsFlat = React.useMemo(() => {
    const flat = [];

    const flatten = (list = []) => {
      list.forEach((item) => {
        flat.push(item);
        flatten(item.replies);
      });
    };

    flatten(video.comments);

    return flat;
  }, [video.comments]);

  const comments = React.useMemo(() => {
    if (!searchInput) {
      return video.comments;
    }

    return commentsFlat.filter(({ text }) => {
      return text.toLowerCase().includes(searchInput.toLowerCase());
    });
  }, [video, searchInput, commentsFlat]);

  const formatter = Intl.NumberFormat('en', { notation: 'compact' });

  return (
    <>
      <div className="card mb-6">
        <div className="card-image">
          <figure className="image is-16by9">
            <Image
              src={video.thumbnails.maxres.url}
              alt={video.title}
              width={video.thumbnails.maxres.width}
              height={video.thumbnails.maxres.height}
            />
          </figure>
        </div>
        <div className="card-content">
          <p className="title is-4 mb-4">
            {video.title}
          </p>
          <div className="media is-flex is-align-items-center">
            <div className="media-left">
              <figure className="image is-48x48">
                <Image
                  src={video.channel.thumbnails.medium.url}
                  alt={video.channelTitle}
                  width={48}
                  height={48}
                />
              </figure>
            </div>
            <div className="media-content">
              <p className="subtitle is-6 mb-0">
                {video.channelTitle}
              </p>
              <p className="is-size-7">
                {`${formatter.format(video.channel.subscriberCount)} subscribers`}
              </p>
            </div>
          </div>
          <div className="content">
            <span className="mr-2">
              {DateTime.fromISO(video.publishedAt).toRelative()}
            </span>
            {' · '}
            <span className="mx-2">
              <FontAwesomeIcon icon={faThumbsUp} />
              {' '}
              {formatter.format(video.likeCount)}
            </span>
            {' · '}
            <span className="mx-2">
              <FontAwesomeIcon icon={faComments} />
              {' '}
              {formatter.format(video.commentCount)}
            </span>
            {' · '}
            <span className="mx-2">
              {`${formatter.format(video.viewCount)} views`}
            </span>
            {' · '}
            <span className="ml-2">
              <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faExternalLinkAlt} />
              </a>
            </span>
          </div>
          <div className="content">
            <hr />
            <p style={{ whiteSpace: 'pre-wrap' }}>
              {descriptionShowMore ? video.description : video.description.slice(0, 150)}
              {video.description.length > 200 && !descriptionShowMore && (
                <span className="ml-3">
                  {' '}
                  <small>
                    <a className="has-text-grey" onClick={() => setDescriptionShowMore(true)}>Read more</a>
                  </small> 
                </span>
              )}
              {video.description.length > 150 && descriptionShowMore && (
                <p className="pt-3">
                  <small>
                    <a className="has-text-grey" onClick={() => setDescriptionShowMore(false)}>Read less</a>
                  </small>
                </p>
              )}
            </p>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <div className="content">
            <div className="control has-icons-left">
              <span className="icon is-left">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                className="input"
                type="text"
                placeholder="Search comments..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
          <hr />
          {comments.length === 0 && (
            <article className="media py-6">
              <div className="media-content">
                <div className="content">
                  <p className="has-text-weight-light has-text-centered">
                    No comments found
                  </p>
                </div>
              </div>
            </article>
          )}
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
            />
          ))}
          {isSearchActive && (
            <>
              <hr />
              <div className="content">
                <p className="subtitle is-6">
                  {`Showing ${comments.length} of ${video.commentCount} ${video.commentCount === 1 ? 'comment' : 'comments'}`}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Video;
