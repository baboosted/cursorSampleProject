# Pathos - Workflow Automation Platform with Solana Integration

A modern, responsive React website for Pathos, a workflow automation platform built for growing teams. The design features a dark mode theme with green gradients, a hero section with compelling copy, and an interactive dashboard design. Now includes Solana blockchain integration for enhanced workflow automation.

## Features

- Modern, dark mode UI with green accent colors
- Responsive design that works on all device sizes
- Custom SVG logo with gradient effects
- Interactive dashboard preview with 3D perspective effects
- Smooth hover animations and transitions
- Built with React components for better maintainability
- **Solana blockchain integration** for cryptocurrency transactions and workflow automation
- **Helius RPC integration** for reliable Solana network connectivity
- **Phantom wallet integration** for secure SOL transfers without exposing private keys
- **Service fee system** for monetizing blockchain transactions

## Solana Integration Features

- Check current Solana blockchain slot
- Query account balances
- Transfer SOL between accounts using Phantom wallet
- Real-time updates and monitoring
- Securely interact with Solana blockchain
- Service fee on transactions to monetize your platform

## Technical Details

- Built with React.js
- Component-based architecture
- Uses CSS variables for consistent theming
- Implements modern CSS features like grid layout, flexbox, and gradients
- Responsive design with media queries
- Optimized for performance
- **Solana Web3.js integration** for blockchain functionality
- **Helius RPC endpoint** for reliable Solana connectivity
- **Phantom wallet integration** for secure transaction signing

## Project Structure

```
pathos-website/
├── public/             # Static files
├── src/                # React source files
│   ├── components/     # React components
│   │   ├── Header.js
│   │   ├── Logo.js
│   │   ├── Hero.js
│   │   ├── Dashboard.js
│   │   ├── MetricCard.js
│   │   ├── WorkflowItem.js
│   │   ├── SolanaPanel.js
│   │   └── SolanaTransfer.js
│   ├── services/
│   │   ├── solanaService.js
│   │   └── phantomWalletService.js
│   ├── App.js          # Main App component
│   ├── index.js        # React entry point
│   └── index.css       # Global styles
└── package.json        # Dependencies and scripts
```

## Getting Started

1. Install dependencies:

```
npm install
```

2. Set up your Helius API key:
   - Sign up for a free API key at [https://dev.helius.xyz/](https://dev.helius.xyz/)
   - Create a `.env` file in the root of your project
   - Add your API key: `REACT_APP_HELIUS_API_KEY=your_api_key_here`

3. Start the development server:

```
npm start
```

4. Visit `http://localhost:3000` in your browser to view the website.

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


## Building for Production

To create a production-ready build:

```
npm run build
```

## Preview

The website showcases:
1. A navigation bar with logo and menu items
2. A hero section with compelling copy
3. A dashboard preview showing workflow metrics
4. Solana blockchain integration tools with Phantom wallet support
5. Fancy gradient effects and background shapes

## Security Note

When using the Solana functionality, all transactions are securely signed through Phantom wallet without exposing your private keys. Always verify transaction details in your Phantom wallet before confirming any transaction.
