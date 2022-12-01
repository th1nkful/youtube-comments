import React from 'react';
import { useRouter } from 'next/router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const NoVideo = () => {
  const router = useRouter();

  const [url, setUrl] = React.useState('');
  const [hasError, setHasError] = React.useState(false);

  const onSearchVideo = () => {
    if (!url) {
      setHasError(true);
      return;
    }

    router.push({ pathname: '/', query: { url } });
  };

  return (
    <div className="panel">
      <p className="panel-heading">Find a video</p>
      <div className="panel-block">
        <p className="control has-icons-left">
          <input
            className="input"
            type="text"
            placeholder="Enter a YouTube video URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <span className="icon is-left">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </p>
        <button className="button is-outlined" onClick={onSearchVideo}>
          Go
        </button>
      </div>
    </div>
  );
};

export default NoVideo;
