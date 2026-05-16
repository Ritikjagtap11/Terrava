import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import toast from 'react-hot-toast';

const Web3Context = createContext(null);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initWeb3();
  }, []);

  const initWeb3 = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // Get network ID
        const netId = await web3Instance.eth.net.getId();
        setNetworkId(netId);

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0] || null);
        });

        // Listen for network changes
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });

      } else {
        console.log('Please install MetaMask!');
        toast.error('Please install MetaMask to use blockchain features');
      }
    } catch (error) {
      console.error('Error initializing Web3:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setAccount(accounts[0]);
      toast.success('Wallet connected!');
      return accounts[0];
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
      throw error;
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    toast.success('Wallet disconnected');
  };

  const value = {
    web3,
    account,
    contract,
    networkId,
    loading,
    connectWallet,
    disconnectWallet,
    isConnected: !!account
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};