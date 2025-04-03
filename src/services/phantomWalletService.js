import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { SOLANA_RPC } from "./solanaService";
import { Buffer } from "buffer";

// Polyfill Buffer for browser environment
window.Buffer = window.Buffer || Buffer;

// Phantom wallet service
const phantomWalletService = {
  // Service fee configuration
  feeConfig: {
    feePercentage: 2.5, // 2.5% fee
    feeCollectorAddress: "7VfiZzdzFA9E6SvXfCLbe8EMWCMW1ycmVstgo42WYo4g", // Fee collector address
    minFeeAmount: 0.001 * LAMPORTS_PER_SOL, // Minimum fee amount in lamports (0.001 SOL)
    maxFeeAmount: 0.1 * LAMPORTS_PER_SOL, // Maximum fee amount in lamports (0.1 SOL)
  },

  /**
   * Check if Phantom wallet is installed
   */
  isPhantomInstalled: () => {
    const provider = window?.solana;
    return provider?.isPhantom === true;
  },

  /**
   * Get the Phantom wallet provider
   */
  getProvider: () => {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }

    window.open("https://phantom.app/", "_blank");
    throw new Error("Phantom wallet is not installed");
  },

  /**
   * Connect to Phantom wallet
   */
  connect: async () => {
    try {
      const provider = phantomWalletService.getProvider();
      const response = await provider.connect();
      return response.publicKey.toString();
    } catch (error) {
      console.error("Error connecting to Phantom wallet:", error);
      throw error;
    }
  },

  /**
   * Disconnect from Phantom wallet
   */
  disconnect: async () => {
    try {
      const provider = phantomWalletService.getProvider();
      await provider.disconnect();
      return true;
    } catch (error) {
      console.error("Error disconnecting from Phantom wallet:", error);
      throw error;
    }
  },

  /**
   * Get the connected wallet's public key
   */
  getPublicKey: () => {
    try {
      const provider = phantomWalletService.getProvider();
      if (!provider.isConnected) {
        throw new Error("Wallet not connected");
      }
      return provider.publicKey.toString();
    } catch (error) {
      console.error("Error getting public key:", error);
      throw error;
    }
  },

  /**
   * Validate if a string is a valid Solana address
   * @param {string} address - Address to validate
   * @returns {boolean} - Whether the address is valid
   */
  isValidSolanaAddress: (address) => {
    try {
      if (!address) return false;

      // Check length (base58 encoded public keys are typically 32-44 characters)
      if (address.length < 32 || address.length > 44) {
        return false;
      }

      // Try to create a PublicKey object
      new PublicKey(address);
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Calculate transaction fee
   * @param {number} amount - Amount in SOL
   * @returns {Object} - Fee details including fee amount in SOL and lamports
   */
  calculateFee: (amount) => {
    const { feePercentage, minFeeAmount, maxFeeAmount } =
      phantomWalletService.feeConfig;

    // Calculate fee amount in lamports
    const amountInLamports = amount * LAMPORTS_PER_SOL;
    let feeInLamports = Math.floor(amountInLamports * (feePercentage / 100));

    // Apply min/max constraints
    if (feeInLamports < minFeeAmount) {
      feeInLamports = minFeeAmount;
    } else if (feeInLamports > maxFeeAmount) {
      feeInLamports = maxFeeAmount;
    }

    // Ensure we don't take more than the amount being sent
    if (feeInLamports >= amountInLamports) {
      feeInLamports = Math.floor(amountInLamports * 0.5); // Cap at 50% for very small amounts
    }

    // Calculate recipient amount in lamports
    const recipientAmountInLamports = amountInLamports - feeInLamports;

    return {
      feePercentage,
      feeInLamports,
      feeInSol: feeInLamports / LAMPORTS_PER_SOL,
      recipientAmountInLamports,
      recipientAmountInSol: recipientAmountInLamports / LAMPORTS_PER_SOL,
      totalAmountInLamports: amountInLamports,
      totalAmountInSol: amount,
    };
  },

  /**
   * Transfer SOL using Phantom wallet with fee
   * @param {string} toAddress - Recipient's public address
   * @param {number} amount - Amount of SOL to transfer
   * @param {boolean} shouldChargeFee - Whether to charge a fee (default: true)
   */
  transferSol: async (toAddress, amount, shouldChargeFee = true) => {
    try {
      const provider = phantomWalletService.getProvider();
      if (!provider.isConnected) {
        throw new Error("Wallet not connected");
      }

      // Validate recipient address
      if (!phantomWalletService.isValidSolanaAddress(toAddress)) {
        throw new Error(
          "Invalid recipient address. Please enter a valid Solana address"
        );
      }

      // Create connection
      const connection = new Connection(SOLANA_RPC, {
        commitment: "confirmed",
      });

      // Get the sender's public key
      const fromPubkey = provider.publicKey;
      const toPubkey = new PublicKey(toAddress);

      // Create a transaction
      const transaction = new Transaction();

      if (shouldChargeFee) {
        // Calculate fee
        const feeDetails = phantomWalletService.calculateFee(amount);

        // Add recipient transfer instruction
        transaction.add(
          SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports: feeDetails.recipientAmountInLamports,
          })
        );

        // Add fee transfer instruction (if fee is greater than dust amount)
        if (feeDetails.feeInLamports > 0) {
          transaction.add(
            SystemProgram.transfer({
              fromPubkey,
              toPubkey: new PublicKey(
                phantomWalletService.feeConfig.feeCollectorAddress
              ),
              lamports: feeDetails.feeInLamports,
            })
          );
        }
      } else {
        // No fee, send full amount
        transaction.add(
          SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports: amount * LAMPORTS_PER_SOL,
          })
        );
      }

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash("confirmed");
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      // Send the transaction to the wallet for signing
      const { signature } = await provider.signAndSendTransaction(transaction);

      // Confirm transaction
      await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight: (await connection.getBlockHeight()) + 150,
        },
        "confirmed"
      );

      return {
        signature,
        fee: shouldChargeFee ? phantomWalletService.calculateFee(amount) : null,
      };
    } catch (error) {
      console.error("Error transferring SOL via Phantom:", error);
      throw error;
    }
  },

  /**
   * Check if the wallet is connected
   */
  isConnected: () => {
    try {
      const provider = phantomWalletService.getProvider();
      return provider.isConnected;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get wallet balance
   */
  getBalance: async () => {
    try {
      const provider = phantomWalletService.getProvider();
      if (!provider.isConnected) {
        throw new Error("Wallet not connected");
      }

      const connection = new Connection(SOLANA_RPC, {
        commitment: "confirmed",
      });

      const balance = await connection.getBalance(provider.publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error("Error getting wallet balance:", error);
      throw error;
    }
  },
};

export default phantomWalletService;
