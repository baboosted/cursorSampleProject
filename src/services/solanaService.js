import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
import { Buffer } from "buffer";

// Polyfill Buffer for browser environment
window.Buffer = window.Buffer || Buffer;

// Direct Helius RPC endpoint with API key
const HELIUS_API_KEY = process.env.REACT_APP_HELIUS_API_KEY;
const SOLANA_RPC = HELIUS_API_KEY
  ? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
  : "https://api.mainnet-beta.solana.com";

// Configure connection with optimized settings
const connection = new Connection(SOLANA_RPC, {
  commitment: "confirmed",
  disableRetryOnRateLimit: false,
  confirmTransactionInitialTimeout: 60000, // 60 seconds
});

/**
 * Get the current slot number on Solana
 */
export const getCurrentSlot = async () => {
  try {
    const slot = await connection.getSlot();
    return slot;
  } catch (error) {
    console.error("Error getting current slot:", error.message);
    throw new Error(`Solana connection failed: ${error.message}`);
  }
};

/**
 * Get the balance of a Solana account
 * @param {string} address - Solana account address
 */
export const getAccountBalance = async (address) => {
  try {
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL; // Convert lamports to SOL
  } catch (error) {
    console.error("Error getting account balance:", error.message);
    throw error;
  }
};

/**
 * Get detailed account information
 * @param {string} address - Solana account address
 */
export const getAccountInfo = async (address) => {
  try {
    const publicKey = new PublicKey(address);
    const accountInfo = await connection.getAccountInfo(publicKey);
    return accountInfo;
  } catch (error) {
    console.error("Error getting account info:", error.message);
    throw error;
  }
};

/**
 * Transfer SOL between accounts
 * @param {string} secretKey - Sender's secret key as base58 string or Uint8Array
 * @param {string} toAddress - Recipient's public address
 * @param {number} amount - Amount of SOL to transfer
 */
export const transferSol = async (secretKey, toAddress, amount) => {
  try {
    // Create keypair from secret key
    let fromKeypair;
    if (typeof secretKey === "string") {
      // If secretKey is a base58 string
      const decodedKey = Uint8Array.from(Buffer.from(secretKey, "base58"));
      fromKeypair = Keypair.fromSecretKey(decodedKey);
    } else {
      // If secretKey is already a Uint8Array
      fromKeypair = Keypair.fromSecretKey(secretKey);
    }

    const toPublicKey = new PublicKey(toAddress);

    // Create a transfer instruction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash("confirmed");
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromKeypair.publicKey;

    // Sign and send the transaction
    const signature = await connection.sendTransaction(
      transaction,
      [fromKeypair],
      {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      }
    );

    // Confirm transaction with longer timeout for mainnet
    const confirmation = await connection.confirmTransaction(
      {
        signature,
        blockhash,
        lastValidBlockHeight: (await connection.getBlockHeight()) + 150,
      },
      "confirmed"
    );

    return { signature, confirmation };
  } catch (error) {
    console.error("Error transferring SOL:", error.message);
    throw error;
  }
};

/**
 * Request airdrop of SOL to the specified address (devnet only)
 * @param {string} address - Solana account address
 * @param {number} amount - Amount of SOL to request (usually max 2 SOL)
 */
export const requestAirdrop = async (address, amount = 1) => {
  try {
    const publicKey = new PublicKey(address);
    const signature = await connection.requestAirdrop(
      publicKey,
      amount * LAMPORTS_PER_SOL
    );

    const confirmation = await connection.confirmTransaction(signature);
    return { signature, confirmation };
  } catch (error) {
    console.error("Error requesting airdrop:", error);
    throw error;
  }
};

// Check connection on initialization
connection
  .getLatestBlockhash()
  .catch((err) =>
    console.error("Initial Helius connection failed:", err.message)
  );

// Export connection for direct use
export const currentEndpoint = "helius";
export { connection, SOLANA_RPC };
