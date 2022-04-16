import React from 'react';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import moment from 'moment';
import abi from './utils/EmojiPortal.json';
import './App.css';
import TwitterLogo from './assets/twitter-logo.png';

const emojis = ['😁', '😂', '🤦‍♂️', '⭐️', '🥰', '💕', '🙈', '💩', '😕', '🤮'];

const contractAddress = '0xC0a830E096834c027396606Cb514211a68456B23';
const contractABI = abi.abi;

const shortenAddress = (string) => {
  const shortenString =
    string.slice(0, 6) + '.....' + string.slice(string.length - 10, string.length - 1);
  return shortenString;
};

export default function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customEmoji, setCustomEmoji] = useState('');
  const [handler, setHandler] = useState('');
  const [allEmojis, setAllEmojis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tnxLoading, setTnxLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();
    getAllEmojis();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have metamask installed and you are logged in');
      } else {
        console.log('Successfully connected to metamask', ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Authorised account ', account);
        setCurrentAccount(account);
      } else {
        console.log('No authorised accounts');
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('You need MetaMask to connect your wallet!');
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      const account = accounts[0];

      console.log('Connected', account);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const emojiMe = async () => {
    setTnxLoading(true);
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const emojiPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await emojiPortalContract.getTotalEmojis();
        console.log('Retreived total emojis count...', count.toNumber());

        const emojiTxn = await emojiPortalContract.submitEmoji(handler, selectedEmoji);
        console.log('Mining...', emojiTxn.hash);

        await emojiTxn.wait();
        
        setTnxLoading(false);
        getAllEmojis();
        console.log('Mined ---', emojiTxn.hash);
      } else {
        console.log('Ethereum object does not exist');
      }
    } catch (error) {
      console.log(error);
      setTnxLoading(false);
    }
  };

  const getAllEmojis = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const emojiPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      const emojis = await emojiPortalContract.getAllEmojis();

      const filteredEmojis = emojis.map((emoji) => {
        const d = new Date(emoji.timestamp * 1000);
        const time = d.toUTCString();
        const UTC = time.substring(0, time.indexOf('GMT')) + 'UTC';

        return {
          address: emoji.sender,
          author: emoji.author,
          emoji: emoji.emoji,
          timestamp: moment(UTC).format('DD MMMM, hh:mm:ss A'),
        };
      });

      const sortedEmojis = filteredEmojis.sort((a, b) => b.timestamp - a.timestamp);

      setAllEmojis(sortedEmojis);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="mainContainer">
        <div className="dataContainer">
          <div className="header">Hey there 😁</div>
          <div className="bio">
            This is my first deployed app following Solidity course from <strong>builspace</strong>{' '}
            .
          </div>
          <div className="bio">
            Pick one of the emojis you like and leave some message for me 😉
          </div>
          <div className="bio" style={{ fontWeight: 700 }}>
            YOOO THIS IS FREE. NO WORRIES
          </div>
          <button
            className={currentAccount ? 'connected' : 'connect'}
            onClick={connectWallet}
            disabled={currentAccount}
          >
            {currentAccount ? '✅ Wallet Connected' : 'Connect your wallet 🤑'}
          </button>
          <div className="emojis-container">
            {emojis.map((emoji, i) => (
              <div
                className={i === emojis.indexOf(selectedEmoji) ? 'selected-emoji' : 'emoji'}
                onClick={() => setSelectedEmoji(emoji)}
              >
                {emoji}
              </div>
            ))}
            {!showCustom && (
              <button
                className="emoji"
                style={{ fontSize: '14px' }}
                onClick={() => setShowCustom(!showCustom)}
              >
                Custom Emoji
              </button>
            )}
            {showCustom && (
              <input
                className="emoji"
                type="text"
                placeholder="🤔"
                value={customEmoji}
                autoFocus
                onBlur={() => setShowCustom(!showCustom)}
                onChange={(e) => {
                  setSelectedEmoji(e.target.value);
                  setCustomEmoji(e.target.value);
                }}
              />
            )}
          </div>
          <input
            value={handler}
            placeholder="@TwitterHandler"
            className="handler"
            onChange={(e) => setHandler(e.target.value)}
            pattern="^@[A-Za-z0-9_]{1,15}$"
            required
          />
          <button className="emojiButton" onClick={emojiMe} disabled={!currentAccount || !handler || tnxLoading}>
            {tnxLoading ? 'Loading...' : (
              'SEND EMOJI 🙏'
            )}
          </button>
        </div>
      </div>
      <div className="side">
        {isLoading ? (
          <div class="loader">Loading...</div>
        ) : (
          <>
            <h3 style={{ textAlign: 'center', backgroundColor: 'transparent' }}>
              Thank you for your emojis 💕
            </h3>
            <h5 style={{ backgroundColor: 'transparent' }}>Total emojis: {allEmojis.length}</h5>
            {allEmojis.length &&
              allEmojis.map((emoji) => (
                <div className="emoji-record">
                  <div className="record-details">
                    <span className="record-emoji-logo">{emoji.emoji}</span>
                    <a href={`https://twitter.com/${emoji.author}`} target="_blank">
                      <img src={TwitterLogo} width="22px" height="22px" />
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
    </div>
  );
}
