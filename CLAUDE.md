# VPP Texas Website

React + Vite website for Texas VPP (Voluntary Protection Programs) energy verification.

## Quick Start

```bash
cd ~/Documents/Claude-Assist/projects/vpp-texas-website

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **Frontend:** React 19, Vite 7
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Backend:** Firebase
- **Scraping:** Puppeteer (for IRS verification)

## Environment Variables

Create `.env` from `.env.example`:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
...
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:5173) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## File Structure

```
vpp-texas-website/
├── src/              # React source
├── public/           # Static assets
├── index.html        # Entry HTML
├── vite.config.js    # Vite configuration
├── irs-appendix-3.xlsx  # IRS verification data
├── scrape-energy-field.mjs  # Energy field scraper
└── test-verification.mjs    # Verification testing
```

## Notes

- Uses Puppeteer for scraping energy verification data
- IRS Appendix 3 data is in Excel format for verification
