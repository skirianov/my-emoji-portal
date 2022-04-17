import React from 'react';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from './utils/EmojiPortal.json';
import './App.css';

import { Emojis } from './components/Emojis/Emojis';
import { SidePane } from './components/SidePane/SidePane';
import { timestampToUTCFormat } from './helpers';

const contractAddress = '0xC0a830E096834c027396606Cb514211a68456B23';
const contractABI = abi.abi;

export default function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [customEmoji, setCustomEmoji] = useState('');
  const [handler, setHandler] = useState('');
  const [allEmojis, setAllEmojis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tnxLoading, setTnxLoading] = useState(false);
  const [txnCompleted, setTxnCompleted] = useState(false);

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
      setTxnCompleted(false);

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const emojiPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await emojiPortalContract.getTotalEmojis();
        console.log('Retreived total emojis count...', count.toNumber());

        const emojiTxn = await emojiPortalContract.submitEmoji(handler, selectedEmoji);
        console.log('Mining...', emojiTxn.hash);

        await emojiTxn.wait();

        console.log('Mined ---', emojiTxn.hash);

        setTxnCompleted(true);
        getAllEmojis();
        setTnxLoading(false);
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
        return {
          address: emoji.sender,
          author: emoji.author,
          emoji: emoji.emoji,
          timestamp: timestampToUTCFormat(emoji.timestamp),
          blockTime: emoji.timestamp.toNumber(),
        };
      });

      const sortedEmojis = filteredEmojis.sort((a, b) => b.blockTime - a.blockTime);

      setAllEmojis(sortedEmojis);
      setIsLoading(false);
      window.twemoji.parse(document.body, { className: 'twemoji' });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className={currentAccount ? 'mainContainer-login' : 'mainContainer'}>
        <div className="dataContainer">
          <div className="header">
            Hey there{' '}
            <span role="img" aria-label="smiing emoji">
              😁
            </span>
          </div>
          <div className="bio">
            This is my first deployed app following Solidity course from <strong>builspace</strong>{' '}
            .
          </div>
          <div className="bio">
            Pick one of the emojis you like and leave your Twitter handler for everyone to see{' '}
            <span role="img" aria-label="wink emoji">
              😉
            </span>
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
          <Emojis
            customEmoji={customEmoji}
            selectedEmoji={selectedEmoji}
            setCustomEmoji={setCustomEmoji}
            setSelectedEmoji={setSelectedEmoji}
          />
          {tnxLoading && <h1 className="linear-wipe">Mining...</h1>}
          {txnCompleted && (
            <h1 style={{ textAlign: 'center', color: 'purple' }} className="linear-wipe-completed">
              Your transaction is successful!
            </h1>
          )}
          {currentAccount && (
            <>
              <input
                value={handler}
                placeholder="@TwitterHandler"
                className="handler"
                onChange={(e) => setHandler(e.target.value)}
                pattern="^@[A-Za-z0-9_]{1,15}$"
                required
                disabled={isLoading || tnxLoading}
              />
              <button
                className="emojiButton"
                onClick={emojiMe}
                disabled={!currentAccount || !handler || tnxLoading}
              >
                {tnxLoading ? 'Loading...' : 'SEND EMOJI 🙏'}
              </button>
            </>
          )}
        </div>
      </div>
      {currentAccount && (
        <SidePane allEmojis={allEmojis} isLoading={isLoading} tnxLoading={tnxLoading} />
      )}
    </div>
  );
}
