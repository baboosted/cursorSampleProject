import React, { useState, useEffect } from 'react';
import phantomWalletService from '../services/phantomWalletService';
import { Buffer } from 'buffer';

// Ensure Buffer is available globally
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
}

const SolanaTransfer = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [walletBalance, setWalletBalance] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [phantomInstalled, setPhantomInstalled] = useState(false);
  const [feeDetails, setFeeDetails] = useState(null);
  const [skipFee, setSkipFee] = useState(false);

  // Check if Phantom is installed on component mount
  useEffect(() => {
    const isInstalled = phantomWalletService.isPhantomInstalled();
    setPhantomInstalled(isInstalled);
    
    // Check if already connected
    if (isInstalled && phantomWalletService.isConnected()) {
      handleWalletConnection();
    }
  }, []);

  // Update wallet balance when connected
  useEffect(() => {
    if (walletConnected) {
      fetchWalletBalance();
    }
  }, [walletConnected]);

  // Update fee calculation when amount changes
  useEffect(() => {
    if (amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0) {
      const calculatedFee = phantomWalletService.calculateFee(parseFloat(amount));
      setFeeDetails(calculatedFee);
    } else {
      setFeeDetails(null);
    }
  }, [amount]);

  const fetchWalletBalance = async () => {
    try {
      const balance = await phantomWalletService.getBalance();
      setWalletBalance(balance);
    } catch (err) {
      console.error('Error fetching wallet balance:', err);
    }
  };

  const handleWalletConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const pubKey = await phantomWalletService.connect();
      setPublicKey(pubKey);
      setWalletConnected(true);
      
      // Get wallet balance
      await fetchWalletBalance();
      
    } catch (err) {
      console.error('Connection error:', err);
      setError(`Failed to connect wallet: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      await phantomWalletService.disconnect();
      setPublicKey('');
      setWalletConnected(false);
      setWalletBalance(null);
    } catch (err) {
      console.error('Disconnect error:', err);
      setError(`Failed to disconnect: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!recipientAddress || !amount) {
      setError('Please fill in all fields');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Amount must be a positive number');
      return;
    }

    // Validate address format before submitting
    if (!phantomWalletService.isValidSolanaAddress(recipientAddress)) {
      setError('Invalid Solana address. Please check the recipient address and try again.');
      return;
    }

    // Verify the user has enough balance (including fee)
    if (walletBalance !== null) {
      const totalAmount = skipFee 
        ? parseFloat(amount) 
        : parseFloat(amount);
      
      if (totalAmount > walletBalance) {
        setError(`Insufficient balance. You're trying to send ${totalAmount.toFixed(6)} SOL but your wallet only has ${walletBalance.toFixed(6)} SOL.`);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Transfer SOL
      const result = await phantomWalletService.transferSol(
        recipientAddress,
        parseFloat(amount),
        !skipFee // Pass skipFee flag (inverted since the param is shouldChargeFee)
      );
      
      let successMessage = `Transaction successful! Signature: ${result.signature}`;
      
      // Add fee details to success message if a fee was charged
      if (result.fee && !skipFee) {
        successMessage += `\nRecipient received: ${result.fee.recipientAmountInSol.toFixed(6)} SOL`;
        successMessage += `\nService fee: ${result.fee.feeInSol.toFixed(6)} SOL (${result.fee.feePercentage}%)`;
      }
      
      setSuccess(successMessage);
      setRecipientAddress('');
      setAmount('');
      setFeeDetails(null);
      
      // Refresh balance
      await fetchWalletBalance();
      
    } catch (err) {
      console.error('Transfer error:', err);
      setError(`Transaction failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format addresses for display
  const formatAddress = (address) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!phantomInstalled) {
    return (
      <div className="solana-transfer">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <div className="dashboard-title">Solana Transfer</div>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'var(--color-card)', 
            borderRadius: '8px',
            marginTop: '1rem',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Phantom Wallet Not Detected</h3>
            <p>To use this feature, you need to install the Phantom wallet browser extension.</p>
            <a 
              href="https://phantom.app/download" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Install Phantom Wallet
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="solana-transfer">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="dashboard-title">Solana Transfer</div>
        </div>
        
        {!walletConnected ? (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'var(--color-card)', 
            borderRadius: '8px',
            marginTop: '1rem',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Connect Your Wallet</h3>
            <p>Connect your Phantom wallet to send SOL transactions.</p>
            <button 
              className="btn btn-primary"
              onClick={handleWalletConnection}
              disabled={loading}
              style={{ marginTop: '1rem' }}
            >
              {loading ? 'Connecting...' : 'Connect Phantom'}
            </button>
          </div>
        ) : (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'var(--color-card)', 
            borderRadius: '8px',
            marginTop: '1rem'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>Wallet Connected</h3>
                <p style={{ 
                  fontSize: '0.8rem', 
                  fontFamily: 'monospace', 
                  color: 'var(--color-text-muted)',
                  wordBreak: 'break-all'
                }}>
                  {publicKey}
                </p>
              </div>
              <button 
                className="btn btn-outline"
                onClick={handleDisconnect}
                disabled={loading}
              >
                Disconnect
              </button>
            </div>
            
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: 'rgba(30, 41, 59, 0.4)',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '0.875rem' }}>Available Balance</div>
              <div style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold',
                marginTop: '0.25rem'
              }}>
                {walletBalance !== null ? `${walletBalance.toFixed(6)} SOL` : 'Loading...'}
                <button 
                  onClick={fetchWalletBalance} 
                  style={{ 
                    marginLeft: '0.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-primary-light)',
                    fontSize: '0.8rem'
                  }}
                  disabled={loading}
                >
                  ↻
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Enter Solana address"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid var(--color-primary)',
                    backgroundColor: 'var(--color-card)',
                    color: 'var(--color-text)'
                  }}
                  disabled={loading}
                  required
                />
                <small style={{ 
                  display: 'block', 
                  marginTop: '0.25rem', 
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)'
                }}>
                  Enter a valid Solana address (e.g., starts with a number or letter, 32-44 characters)
                </small>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Amount (SOL)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  min="0.000001"
                  step="0.000001"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid var(--color-primary)',
                    backgroundColor: 'var(--color-card)',
                    color: 'var(--color-text)'
                  }}
                  disabled={loading}
                  required
                />
              </div>
              
              {/* Fee Details Display */}
              {feeDetails && !skipFee && (
                <div style={{ 
                  marginBottom: '1.5rem',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(30, 41, 59, 0.4)',
                  borderRadius: '4px',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>You send:</span> 
                    <span style={{ float: 'right', fontWeight: 'bold' }}>{feeDetails.totalAmountInSol.toFixed(6)} SOL</span>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Recipient gets:</span> 
                    <span style={{ float: 'right', fontWeight: 'bold' }}>{feeDetails.recipientAmountInSol.toFixed(6)} SOL</span>
                  </div>
                  <div style={{ marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Service fee ({feeDetails.feePercentage}%):</span> 
                    <span style={{ float: 'right', fontWeight: 'bold', color: 'var(--color-primary-light)' }}>{feeDetails.feeInSol.toFixed(6)} SOL</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Service fee helps maintain this platform
                  </div>
                </div>
              )}

              {/* Skip Fee Option */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                marginBottom: '1.5rem' 
              }}>
                <input
                  id="skipFee"
                  type="checkbox"
                  checked={skipFee}
                  onChange={() => setSkipFee(!skipFee)}
                  style={{ marginRight: '0.5rem' }}
                  disabled={loading}
                />
                <label htmlFor="skipFee" style={{ 
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}>
                  Skip service fee (Not recommended)
                </label>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Send SOL'}
              </button>
            </form>

            {error && (
              <div style={{ 
                color: '#ef4444', 
                marginTop: '1rem', 
                padding: '0.5rem', 
                borderRadius: '4px', 
                backgroundColor: 'rgba(239, 68, 68, 0.1)' 
              }}>
                {error}
              </div>
            )}
            
            {success && (
              <div style={{ 
                color: '#10b981', 
                marginTop: '1rem', 
                padding: '0.5rem', 
                borderRadius: '4px', 
                backgroundColor: 'rgba(16, 185, 129, 0.1)'
              }}>
                {success.split('\n').map((line, index) => (
                  <div key={index} style={{ marginBottom: index !== success.split('\n').length - 1 ? '0.5rem' : 0 }}>
                    {line}
                  </div>
                ))}
                <div style={{ marginTop: '0.5rem' }}>
                  <a 
                    href={`https://explorer.solana.com/tx/${success.split(': ')[1].split('\n')[0]}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}
                  >
                    View on Solana Explorer
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.75rem', 
          backgroundColor: 'rgba(30, 41, 59, 0.4)', 
          borderRadius: '4px',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)'
        }}>
          <strong>Security Note:</strong> This integration uses Phantom wallet to securely sign transactions 
          without exposing your private keys. Always verify transaction details before confirming in your wallet.
          <div style={{ marginTop: '0.5rem' }}>
            <strong>Fee Policy:</strong> A small service fee ({phantomWalletService.feeConfig.feePercentage}%) is charged on each transaction to support development and maintenance. 
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolanaTransfer; 