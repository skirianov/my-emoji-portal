import React, { useEffect, useRef, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import emojiDict from '../../utils/emoji.json';
import OutsideAlerter, { filterEmojisByGroups } from '../../helpers';

const groupedEmojis = filterEmojisByGroups(emojiDict);
const groupKeys = [...groupedEmojis.keys()];

const defaultEmojis = ['😁', '😂', '🤦‍♂️', '⭐️', '🥰', '💕', '🙈', '💩', '😕', '🤮'];

export const Emojis = ({ customEmoji, selectedEmoji, setSelectedEmoji, setCustomEmoji }) => {
  const [showCustom, setShowCustom] = useState(false);
  const [groupEmoji, setGroupEmoji] = useState(groupedEmojis.get(groupKeys[0]));

  useEffect(() => {
    window.twemoji.parse(document.body, { className: 'twemoji' });
  }, [showCustom, groupEmoji]);

  return (
    <div className="emojis-container">
      {defaultEmojis.map((emoji, i) => (
        <div
          className={i === defaultEmojis.indexOf(selectedEmoji) ? 'selected-emoji' : 'emoji'}
          onClick={() => setSelectedEmoji(emoji)}
          key={i}
        >
          {emoji}
        </div>
      ))}
      {!showCustom && (
        <button
          className={customEmoji === selectedEmoji ? 'selected-emoji' : 'emoji'}
          style={{ fontSize: '14px' }}
          onClick={() => setShowCustom(!showCustom)}
        >
          {customEmoji ? customEmoji : 'Custom Emoji'}
        </button>
      )}
      {showCustom && (
        <OutsideAlerter clickHandler={() => setShowCustom(false)}>
          <Scrollbars className="scrollbar">
            <div className="emoji-modal-tabs">
              {[...groupedEmojis.keys()].map((key) => (
                <div
                  key={key}
                  className="emoji-modal-tab"
                  onClick={() => setGroupEmoji(groupedEmojis.get(key))}
                >
                  {groupedEmojis.get(key)[0]}
                </div>
              ))}
            </div>
            {groupEmoji.map((emoji) => (
                <span
                  key={emoji}
                  onClick={(e) => {
                    const value = e.target.attributes.alt.value;
                    setSelectedEmoji(value);
                    setCustomEmoji(value);
                    setShowCustom(!showCustom);
                  }}
                >
                  {emoji}
                </span>
              ))
            }
          </Scrollbars>
        </OutsideAlerter>
      )}
    </div>
  );
};
