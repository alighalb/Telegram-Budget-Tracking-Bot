# Telegram Budget Tracking Bot

A budget tracking Telegram bot built with JavaScript that supports both Arabic and English languages. This bot allows users to track income and expenses, view balances, generate reports, manage budget limits, and export data.

## Features

- Multi-language support (Arabic and English)
- Track income and expenses with categories
- View balance summaries
- Generate spending reports by category
- Set and manage budget limits
- Export data as text or CSV

## Deployment Options

### Option 1: Deploy to Vercel

1. Fork this repository
2. Create a new project on Vercel
3. Connect your GitHub repository
4. Add the following environment variables:
   - `TELEGRAM_BOT_TOKEN`: Your Telegram bot token from BotFather
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_KEY`: Your Supabase service role key
5. Deploy the project

### Option 2: Deploy to Supabase Edge Functions

1. Install Supabase CLI
2. Initialize Supabase in your project: `supabase init`
3. Deploy the function: `supabase functions deploy telegram-webhook`
4. Set the environment variables:
