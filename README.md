# Gistr

A fullstack web application that automatically summarizes and saves web articles. Built with Next.js, Supabase, and AI.

## Features

- Save and summarize articles from any URL
- AI-powered article summarization
- User-defined custom tags for article organization
- Search and filter your article library
- Track reading progress and add ratings
- Chrome extension for easy saving
- Dark/light theme with keyboard shortcuts
- User authentication with email, GitHub, and Google sign-in options

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Supabase (Auth & Database)
- Tailwind CSS & shadcn/ui
- Readability.js for article parsing
- Claude AI for summarization
- Stripe for subscription management

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Set up environment variables (see `.env.example`)
4. Run development server: `pnpm dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Database Schema

The app uses several main tables:

- `articles`: Stores article content, summaries, and metadata
- `user_articles`: Tracks user-specific data like read status and ratings
- `user_article_tags`: Stores user-defined tags for articles
- `user_metadata`: Manages user subscription and usage data

## Upcoming Features

- Project folders to organize summaries
- Multi-filter capability for advanced searching
- Configurable summarization options
- Archive and favorite functionality
- Chat with AI about saved articles
- Data analytics for articles

## Chrome Extension

A Chrome extension is available for easy saving of articles directly from your browser. The extension is styled to match the main app interface.

## Deployment

The application is deployed on Vercel with the following structure:

- Main app: https://app.getgistr.com/
- Demo app: https://demo.getgistr.com/
- Landing page: https://www.getgistr.com/
