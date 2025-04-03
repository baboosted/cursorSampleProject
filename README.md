# Pathos - Solana AI Assistant

Pathos transforms complex Solana blockchain operations into simple conversations. By combining AI with crypto functionality, we've created a chat interface that makes managing your Solana assets as easy as texting a friend.

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

## License

MIT
