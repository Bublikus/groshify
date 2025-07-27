# Groshify - Personal Finance Management

A modern personal finance management application built with Next.js that helps you track and categorize your expenses using AI-powered categorization.

## Features

- 📊 Upload and parse expense files (CSV, Excel)
- 🤖 AI-powered expense categorization using ChatGPT
- 📅 Monthly expense tracking and summaries
- 🎨 Dark/Light theme support
- 📱 Progressive Web App (PWA) support
- 🔄 Real-time category editing

## Getting Started

### Prerequisites

- Node.js 18+ 
- OpenAI API key for expense categorization

### Environment Setup

1. Create a `.env.local` file in the root directory:

```bash
# OpenAI API Key for expense categorization
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# App URL (optional, for production deployments)
APP_URL=http://localhost:3000
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### How to Use

1. **Upload Expense File**: Upload your CSV or Excel file containing transaction data
2. **AI Categorization**: The app will automatically categorize your transactions using ChatGPT
3. **Review & Edit**: Review the AI-suggested categories and modify them if needed
4. **Track Spending**: View monthly summaries and category breakdowns

### File Format

Your expense file should have the following columns:
- Column 1: Date
- Column 2: Amount
- Column 3: Currency
- Column 4: Transaction Description (used for AI categorization)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
