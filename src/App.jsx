
import { useState ,useEffect } from 'react';
import { ethers } from 'ethers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum} from '@fortawesome/free-brands-svg-icons'
import Wallet from './artifacts/contracts/Wallet.sol/Wallet.json';
import './App.css'

const WalletAddress = import.meta.env.VITE_REACT_APP_WALLET_ADDRESS;

function App() {

  const [balance, setBalance] = useState(0);
  const [amountSend, setAmountSend] = useState('');
  const [amountWithdraw, setAmountWithdraw] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getBalance();
  }, [])

  async function getBalance() {
    if(typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(WalletAddress, Wallet.abi, provider);
      try {
        let overrides = {
          from: accounts[0]
        }
        const data = await contract.getBalance(overrides);
        setBalance(String(data));
      }
      catch(err) {
        setError('There is an error.');
      }
    }
  }

  async function transfer() {
    console.log("amount send " + amountSend);
    if (!amountSend) {
      return;
    }
    setError('');
    setSuccess('');
    console.log("type of" +typeof window.ethereum);
    if(typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      try {
        const tx = {
          from: accounts[0],
          to: WalletAddress,
          value: ethers.utils.parseEther(amountSend)
        }
        const transaction = await signer.sendTransaction(tx);
        await transaction.wait();
        setAmountSend('');
        getBalance();
        setSuccess('Your money has been successfully transferred to the wallet!')
      }
      catch(err) {
        setError('There is an error.');
      }
    }
  }
  async function withdraw() {
    if(!amountWithdraw) {
      return;
    }
    setError('');
    setSuccess('');
    const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(WalletAddress, Wallet.abi, signer);
    try {
      const transaction = await contract.withdrawMoney(accounts[0], ethers.utils.parseEther(amountWithdraw));
      await transaction.wait();
      setAmountWithdraw('');
      getBalance();
        setSuccess('Your money has been successfully transferred to the wallet!')
    }
    catch(err) {
      setError('There is an error.');
    }
  }
  function changeAmountSend(e) {
    setAmountSend(e.target.value);
  }
  function changeAmountWithdraw(e) {
    setAmountWithdraw(e.target.value);
  }
  return (
    <div className="App">
      <div className="container">
        <div className="logo">
          <FontAwesomeIcon icon={faEthereum} />
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <h2>{balance / 10**18} <span className="eth">eth</span></h2>
        <div className="wallet__flex">
          <div className="walletLeft">
            <h3>Send Ether</h3>
            <input type="text" placeholder="Amount of Ethers" onChange={changeAmountSend} value={amountSend}/>
            <button onClick={transfer}>Send</button>
          </div>
          <div className="walletRight">
            <h3>Withdraw Ether</h3>
            <input type="text" placeholder="Amount of Ethers" onChange={changeAmountWithdraw}  value={amountWithdraw}/>
            <button onClick={withdraw}>Withdraw</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App
