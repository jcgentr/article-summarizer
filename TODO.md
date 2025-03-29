# Bug

# AI and Analytics

- [ ] be able to chat with AI about article (may evolve to RAG)
- [ ] build tables and data analytics for articles
- [ ] try out deepseek API

# Core Features

- [ ] Multi-filter capability (including tags and projects)
- [ ] Be able to configure summarization
  - [ ] Secondary summarization saved to user_articles table?
  - [ ] Maybe translate to different languages in the future?
- [ ] Read progress bar on side
- [ ] Improve author parsing
- [ ] Add ability to archive summaries
- [ ] Add ability to favorite summaries
- [ ] Show archive tab or filter
- [ ] Show favorite tab or filter
- [ ] Update existing article on create if hash of content has changed
- [ ] On title hover show preview of site
- [ ] Add OG image next to title
- [ ] Save parse errors to database
- [ ] investigate how much ElevenLabs TTS would cost per article

# Performance

- [ ] virtualize article list (https://tanstack.com/virtual/latest)
  - [ ] add infinite scrolling with API fetching

# Chrome Extension

- [ ] be able to delete from chrome extension? local vs db vs both
- [ ] add published_time to chrome ext

# Authentication & User Management

- [ ] offer forgot password option
- [ ] turn supabase email verification back on
  - [ ] Email rate-limits and restrictions (see Supabase SMTP docs)
- [ ] improve login and signup flow (verify email not intuitive)
  - [ ] let user know if account exists or not?

# User Experience

- [ ] add onboarding instructions to first time users (https://www.onborda.dev/)
  - [ ] initial modal for demo and free users telling them of usage limits
- [ ] investigate why so many summaries are not parsed
- [ ] add keyboard shortcuts help

# Marketing & Branding

- [ ] post new feature updates via Loom and Twitter
- [ ] email notifications on landing page for updates
- [ ] make a legit logo
- [ ] improve chrome extension page
- [ ] add Share feature on summary card (copy Glasp)
- [ ] reach out to True Crime podcasters to see if Gistr would help them
- [ ] add Feedback div like same.dev after X account is created

# Doing

- [ ] switch to Gemini 2.0 Flash (free tier)
- [ ] Project folders to hold summaries together (like Todoist My Projects)
  - [ ] Implement project creation and management
  - [ ] Allow users to assign articles/summaries to projects
  - [ ] Add project view and filtering options

# Done

- [x] research SEO boosting techniques (get to Google's front page of "summarize articles")
- [x] start Gistr Twitter page
  - [x] could we do a summary a day on Twitter page? make it viral
- [x] transition to sidebar
- [x] add tags to sidebar
- [x] Custom tag feature
  - [x] Add ability to create and assign custom tags to articles
  - [x] Implement tag management interface (add and delete tags)
- [x] Remove AI tags and add user-added tags
- [x] offer Github and Google sign in providers
- [x] have published_date to the right even if author undefined
- [x] change font to Inter
- [x] adding an existing article doesn't show it at the top for Newest first sort by
- [x] most popular articles leaderboard based on all users saved summaries
- [x] top rated articles leaderboard
- [x] copy over changes from main app to demo (cherry pick in future)
- [x] formatted_content not saved in prod (probably need to add code to chrome ext API)
- [x] add SEO text on this and demo
- [x] add publish date
- [x] update landing page to remove coming soon on Print feature
- [x] add print button
- [x] test full app with friends
- [x] improve Chrome extension styling to match main app
- [x] link to Chrome extension in user menu
- [x] add feedback button and form
- [x] develop and deploy landing page
- [x] add summary count and limit and plan type in user account menu
- [x] fix broken production chrome extension
- [x] create user_metadata entries for existing users
- [x] add billing limit enforcement and reset logic
- [x] try groqcloud (not ready yet; no paid tier)
- [x] add user account modal (fold log out and user email into this)
- [x] add debouncer on search
- [x] change tag hashtags to badges like in chrome extension
- [x] environment variable for chrome extension id
- [x] deploy chrome extension (waiting on chrome review)
- [x] try out claude haiku 3.5
- [x] fix chrome extension login issue
- [x] add app name and logo to navbar
- [x] change app name and favicon
- [x] develop chrome extension for saving
- [x] add filter for read vs unread
- [x] keyboard shortcut d to change theme
- [x] add sort by shortest vs longest and newest vs oldest created_at
- [x] make summaries expandable
- [x] if summary already exists for url, return existing db summary
- [x] limit how long the article can be
- [x] add toasts
- [x] show tags
- [x] search by tags
- [x] theme switcher
- [x] scroll to top button
- [x] add basic client-side search
- [x] add user accounts and hook up to summaries
- [x] deploy on Vercel and Supabase
- [x] add ability to rate article after reading (1-5 stars)
- [x] switch from FastAPI and sqlite to next.js and supabase
- [x] deploy on fly.io
- [x] build simple frontend UI to connect this to
- [x] convert this to a FastAPI app
- [x] capture title and author if they exists

# Pre-launch

- [x] prep for each launch
- [x] enable Vercel analytics on demo, landing, and main app
- [x] upgrade accounts for Vercel and Supabase
- [x] develop demo app on subdomain
- [x] put main app on app subdomain
- [x] Link Mercury account to Stripe
- [x] develop landing page with link to chrome extension (no subdomain)
- [x] setup business bank account (Steph recommends Mercury)
- [x] setup Stripe billing and subscriptions (be able to cancel easily)
- [x] decide on pricing
- [x] calculate claude expense (see Google sheet)
- [x] decide on name and (initial) logo
- [x] buy domain name and point it to Vercel
- [x] form an LLC

# SCHEMA

## Database Schema

### Articles Table (articles)

| Column            | Type                     | Description                      |
| ----------------- | ------------------------ | -------------------------------- |
| id                | uuid                     | Primary key                      |
| url               | text                     | Article URL (unique)             |
| content           | text                     | Full article content             |
| formatted_content | text                     | HTML formatted content           |
| summary           | text                     | AI-generated summary             |
| tags              | text                     | Article categories               |
| author            | text                     | Article author                   |
| title             | text                     | Article title                    |
| word_count        | integer                  | Total word count                 |
| published_time    | timestamptz              | When the article was published   |
| created_at        | timestamp with time zone | When the record was created      |
| updated_at        | timestamp with time zone | When the record was last updated |

### User Articles Table (user_articles)

| Column      | Type                     | Description                      |
| ----------- | ------------------------ | -------------------------------- |
| id          | uuid                     | Primary key                      |
| user_id     | uuid                     | Foreign key to auth.users table  |
| article_id  | uuid                     | Foreign key to articles table    |
| has_read    | boolean                  | Read status                      |
| rating      | integer                  | User rating (1-5)                |
| is_archived | boolean                  | Whether the article is archived  |
| is_favorite | boolean                  | Whether the article is favorited |
| created_at  | timestamp with time zone | When the record was created      |
| updated_at  | timestamp with time zone | When the record was last updated |

Note: The user_id and article_id combination is unique in the user_articles table.

### User Metadata Table (user_metadata)

| Column              | Type                     | Description                               |
| ------------------- | ------------------------ | ----------------------------------------- |
| user_id             | uuid                     | Primary key, references auth.users(id)    |
| plan_type           | text                     | Subscription plan type (defaults to free) |
| summaries_generated | integer                  | Number of summaries in current cycle      |
| billing_cycle_start | timestamp with time zone | Start of current billing cycle            |
| created_at          | timestamp with time zone | When the record was created               |
| updated_at          | timestamp with time zone | When the record was last updated          |

# The Goodreads for web articles?

## Or pivot to a save-it-later research tool?

# Inspiration

- https://screvi.com/

- https://web.getmatter.com/home

- https://hq.getmatter.com/

- https://gistr.so/

- https://thestorygraph.com/

- https://glasp.co/

- https://www.getrecall.ai/
