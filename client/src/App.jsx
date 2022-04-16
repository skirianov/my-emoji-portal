import React from 'react';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from './utils/EmojiPortal.json';
import './App.css';

const emojis = ['😁', '😂', '🤦‍♂️', '⭐️', '🥰', '💕', '🙈', '💩', '😕', '🤮'];

const contractAddress = '0x8DB944CE182e07355b42A52e6a6c32b65809335A';
const contractABI = abi.abi;

export default function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customEmoji, setCustomEmoji] = useState('');

  console.log(selectedEmoji);

  useEffect(() => {
    checkIfWalletIsConnected();
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
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const emojiPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await emojiPortalContract.getTotalEmojis();
        console.log('Retreived total emojis count...', count.toNumber());

        const emojiTxn = await emojiPortalContract.submitEmoji();
        console.log('Mining...', emojiTxn.hash);

        await emojiTxn.wait();
        console.log('Mined ---', emojiTxn.hash);
      } else {
        console.log('Ethereum object does not exist');
      }
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
            {currentAccount ? '✅' : 'Connect your wallet 🤑'}
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
                onChange={(e) => {
                  setSelectedEmoji(e.target.value);
                  setCustomEmoji(e.target.value);
                }}
              />
            )}
          </div>
          <button className="emojiButton" onClick={emojiMe} disabled={!currentAccount}>
            SEND EMOJI 🙏
          </button>
        </div>
      </div>
      <div className="side">
        <h3 style={{ textAlign: 'center' }}>Thank you for your emojis 💕</h3>
        <h5>Total emojis: {}</h5>
        <div></div>
      </div>
    </div>
  );
}
