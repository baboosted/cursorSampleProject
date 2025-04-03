# Pathos - Solana AI Assistant

Pathos transforms complex Solana blockchain operations into simple conversations. By combining AI with crypto functionality, we've created a chat interface that makes managing your Solana assets as easy as texting a friend. Whether you're a crypto novice or expert, Pathos is your intelligent companion for seamless blockchain interactions.

## Features

- Connect to Phantom wallet
- Check wallet balances
- Make SOL transfers
- Check current Solana blockchain slot
- Natural language interface powered by Claude AI

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Solana RPC Integration

This project uses Helius as the RPC provider for Solana mainnet, which offers the following benefits:

- Higher rate limits than the public Solana RPC endpoint
- More reliable and faster responses
- Better transaction confirmation reliability
- Access to advanced Solana APIs

If you don't have a Helius API key, the application will fall back to using the public Solana RPC endpoint, which may have rate limiting issues.

## Phantom Wallet Integration

This project integrates with Phantom wallet for secure SOL transfers:

- Connect your Phantom wallet directly through the website
- No need to enter private keys - transactions are signed in your wallet
- Verify and confirm all transactions through the Phantom extension
- View your wallet balance directly in the application
- Transparent fee structure with detailed breakdown

To use this feature:

1. Install the [Phantom wallet extension](https://phantom.app/download)
2. Create or import a wallet in Phantom
3. Connect your wallet through the application
4. Send and sign transactions securely

## Deployment to Netlify

1. Push your code to GitHub
2. Log in to [Netlify](https://app.netlify.com/)
3. Click "New site from Git"
4. Select your GitHub repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
6. Add environment variables in Netlify dashboard:
   - REACT_APP_HELIUS_API_KEY
   - REACT_APP_CLAUDE_API_KEY
   - REACT_APP_API_URL
7. Deploy!

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_HELIUS_API_KEY=your_helius_api_key
REACT_APP_CLAUDE_API_KEY=your_claude_api_key
REACT_APP_API_URL=your_backend_url
```

## Security Note

When using the Solana functionality, all transactions are securely signed through Phantom wallet without exposing your private keys. Always verify transaction details in your Phantom wallet before confirming any transaction.

## License

MIT
