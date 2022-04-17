import moment from "moment";
import React, { useRef, useEffect } from "react";

export const shortenAddress = (string) => {
  const shortenString =
    string.slice(0, 6) + '.....' + string.slice(string.length - 10, string.length - 1);
  return shortenString;
};

export const timestampToUTCFormat = (bigNumber) => {
  const d = new Date(bigNumber * 1000);
  const time = d.toUTCString();
  const UTC = time.substring(0, time.indexOf('GMT')) + 'UTC';

  return moment(UTC).format('DD MMMM, hh:mm:ss A');
}

export const filterEmojisByGroups = (emojis) => {
  let byCategory = new Map();

  for (let i = 0; i < emojis.length; i++) {
    if (emojis[i].category === 'Component') {
      continue;
    }
    
    if (byCategory.get(emojis[i].category)) {
      byCategory.get(emojis[i].category).push(emojis[i].emoji);
    } else {
      byCategory.set(emojis[i].category, []);
    }
  }

  return byCategory;
};

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export default function OutsideAlerter({ clickHandler, children }) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, clickHandler);

  return <div ref={wrapperRef} className="emoji-modal">{children}</div>;
}