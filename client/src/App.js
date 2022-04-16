import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const wave = () => {
    
  }
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there! 😁
        </div>
        <div className="bio">
        This is my first deployed Ethereum and Solidity course.
        Pick one of the emojis you like and leave some message for me 😉
        </div>
        <div className="bio">
        YOOO THIS IS FREE. NO WORRIES 😂 
        </div>
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}
