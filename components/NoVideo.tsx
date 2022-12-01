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
    <div className="container">
      <div className="card">
        <div className="card-header">
          <p className="card-header-title">Find a video</p>
        </div>
        <div className="card-content">
          <div className="content">
            <p className="control has-icons-left">
              <input
                className="input"
                type="text"
                placeholder="Enter a YouTube video URL or video ID..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <span className="icon is-left">
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </p>
            <div className="is-flex is-justify-content-end">
              <button className="button is-danger" onClick={onSearchVideo}>
                Find video
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoVideo;
