- [ ] be able to chat with AI about article (may evolve to RAG)
- [ ] build tables and data analytics for articles
- [ ] add print button
- [ ] add feedback button and form
- [ ] be able to configure summarization
- [ ] make tags expandable
- [ ] read progress bar on side
- [ ] improve loading loads of summaries if necessary
- [ ] improve login and signup flow (verify email not intuitive)
- [ ] offer Github and Google sign in providers
- [ ] improve author parsing
- [ ] add ability to archive summaries
- [ ] add ability to favorite summaries
- [ ] show archive tab or filter
- [ ] show favorite tab or filter
- [ ] most popular articles leaderboard based on all users saved summaries
- [ ] top rated articles leaderboard
- [ ] update existing article on create if hash of content has changed
- [ ] add OG image next to title
- [ ] add publish date
- [ ] on title hover show preview of site
- [ ] add multi-filter capability
- [ ] be able to delete from chrome extension? local vs db vs both
- [ ] add user account modal (fold log out and user email into this)
- [ ] virtualize article list (https://tanstack.com/virtual/latest)

- [ ] fix broken production chrome extension

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

- [ ] setup business bank account (Steph recommends Mercury)
- [ ] develop demo app on subdomain
- [ ] develop landing page with link to chrome extension
- [ ] setup Stripe billing and subscriptions (be able to cancel easily)
- [ ] calculate claude expense
- [ ] decide on pricing

- [x] decide on name and (initial) logo
- [x] buy domain name and point it to Vercel
- [x] form an LLC

# SCHEMA

## Database Schema

### Articles Table

| Column     | Type                     | Description                      |
| ---------- | ------------------------ | -------------------------------- |
| id         | uuid                     | Primary key                      |
| url        | text                     | Article URL (unique)             |
| content    | text                     | Full article content             |
| summary    | text                     | AI-generated summary             |
| tags       | text                     | Article categories               |
| author     | text                     | Article author                   |
| title      | text                     | Article title                    |
| word_count | integer                  | Total word count                 |
| created_at | timestamp with time zone | When the record was created      |
| updated_at | timestamp with time zone | When the record was last updated |

### User Articles Table

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

# The Goodreads for web articles?

# Inspiration

- https://screvi.com/

- https://web.getmatter.com/home

- https://hq.getmatter.com/

- https://gistr.so/

- https://thestorygraph.com/
