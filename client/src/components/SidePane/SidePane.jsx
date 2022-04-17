import React, { useEffect } from 'react';
import TwitterLogo from '../../assets/twitter-logo.png';
import { shortenAddress } from '../../helpers';

export const SidePane = ({ allEmojis, isLoading, tnxLoading }) => {

  useEffect(() => {
    window.twemoji.parse(document.body, { className: 'twemoji' });
  }, [isLoading]);

  return (
    <div className="side">
      {isLoading ? (
        <div className="loader">Loading...</div>
      ) : (
        <>
          <h3 style={{ textAlign: 'center', backgroundColor: 'transparent' }}>
            Thank you for your emojis!
          </h3>
          <h5 style={{ backgroundColor: 'transparent' }}>Total emojis: {allEmojis.length}</h5>
          {allEmojis.length &&
            allEmojis.map((emoji, i) => (
              <div className="emoji-record" key={i}>
                <div className="record-details">
                  <span className="record-emoji-logo">{emoji.emoji}</span>
                  <a
                    href={`https://twitter.com/${emoji.author}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={TwitterLogo} width="22px" height="22px" alt="twitter logo" />
                    {emoji.author}
                  </a>
                </div>
                <div className="record-info">
                  <span>{shortenAddress(emoji.address)}</span>
                  <span>{emoji.timestamp}</span>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};
