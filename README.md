# Portfolio Website

A modern, interactive portfolio built with Next.js featuring dynamic content from GitHub and dev.to APIs.

## Features

- 🌟 Interactive Matrix background with mouse effects
- 📝 Automatic blog posts from dev.to
- 🔧 Dynamic programming languages from GitHub repositories
- 📱 Responsive design with Tailwind CSS
- ⚡ Fast performance with Next.js

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
NEXT_PUBLIC_GITHUB_TOKEN=your_github_token
```

4. Update usernames in:
   - `lib/devto.js` - Replace with your dev.to username
   - `lib/github.js` - Replace with your GitHub username

5. Run development server:
```bash
npm run dev
```

## Environment Variables

- `NEXT_PUBLIC_GITHUB_TOKEN` - GitHub Personal Access Token for API access

## Deployment

Deploy on Vercel, Netlify, or any platform supporting Next.js. Remember to set environment variables in your deployment platform.
