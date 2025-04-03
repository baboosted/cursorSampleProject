import React, { useState, useEffect } from 'react';
import { getCurrentSlot, getAccountBalance } from '../services/solanaService';

const SolanaPanel = () => {
  const [currentSlot, setCurrentSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  useEffect(() => {
    // Fetch the current slot when component mounts
    fetchCurrentSlot();
    
    // Update every 15 seconds
    const interval = setInterval(fetchCurrentSlot, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchCurrentSlot = async () => {
    try {
      setLoading(true);
      setError(null);
      const slot = await getCurrentSlot();
      setCurrentSlot(slot);
      setConnectionStatus('connected');
    } catch (err) {
      console.error('Error in SolanaPanel:', err);
      setError(`Error connecting to Helius: ${err.message || 'Unknown error'}`);
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const checkBalance = async () => {
    if (!address) return;
    
    try {
      setLoading(true);
      setError(null);
      const solBalance = await getAccountBalance(address);
      setBalance(solBalance);
    } catch (err) {
      console.error('Balance check error:', err);
      setError(`Error fetching balance: ${err.message || 'Check if the address is valid'}`);
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="solana-panel">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="dashboard-title">
            Solana Blockchain (Mainnet)
            <span className="rpc-badge" style={{
              fontSize: '0.7rem',
              marginLeft: '0.5rem',
              padding: '0.2rem 0.5rem',
              backgroundColor: 'var(--color-primary-dark)',
              borderRadius: '20px',
              verticalAlign: 'middle'
            }}>
              Helius
            </span>
          </div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: connectionStatus === 'connected' ? 'var(--color-primary-light)' : 
                  connectionStatus === 'error' ? '#ef4444' : 'var(--color-text-muted)'
          }}>
            {connectionStatus === 'connected' ? '● Connected' : 
             connectionStatus === 'error' ? '● Connection Error' : '● Checking...'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-title">Current Slot</div>
          <div className="metric-value">
            {loading && !balance ? 'Loading...' : currentSlot}
          </div>
          <button 
            className="btn btn-outline" 
            onClick={fetchCurrentSlot}
            disabled={loading && !balance}
          >
            Refresh
          </button>
        </div>

        <div className="metric-card" style={{ marginTop: '1rem' }}>
          <div className="metric-title">Check Balance</div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              value={address}
              onChange={handleAddressChange}
              placeholder="Enter Solana address"
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid var(--color-primary)',
                backgroundColor: 'var(--color-card)',
                color: 'var(--color-text)'
              }}
            />
            <button 
              className="btn btn-primary" 
              onClick={checkBalance} 
              disabled={loading && !balance}
            >
              Check
            </button>
          </div>
          
          {balance !== null && (
            <div style={{ marginTop: '1rem' }}>
              <div className="metric-value">
                {balance} SOL
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <a 
                  href={`https://explorer.solana.com/address/${address}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--color-primary-light)', 
                    textDecoration: 'none' 
                  }}
                >
                  View on Solana Explorer
                </a>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div style={{ 
            color: '#ef4444', 
            marginTop: '1rem', 
            padding: '0.5rem', 
            borderRadius: '4px', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)' 
          }}>
            {error}
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
              <strong>Troubleshooting:</strong>
              <ul style={{ paddingLeft: '1rem', marginTop: '0.25rem' }}>
                <li>Check browser console for detailed errors</li>
                <li>Try refreshing the page</li>
                <li>Check your internet connection</li>
              </ul>
            </div>
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
          <strong>Note:</strong> This app connects to Solana Mainnet using the Helius RPC provider 
          for enhanced reliability and performance.
        </div>
      </div>
    </div>
  );
};

export default SolanaPanel; 