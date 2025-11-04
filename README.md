This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# CauseHive - Crowdfunding Platform

A modern crowdfunding platform for charitable causes with real PayStack payment integration.

## PayStack Configuration

To enable real payment processing, you need to configure your PayStack API keys:

### 1. Get PayStack API Keys
- Visit [PayStack Dashboard](https://dashboard.paystack.com/settings/developer)
- Copy your **Public Key** (starts with `pk_test_` or `pk_live_`)
- Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`) - **Keep this secure!**

### 2. Configure Environment Variables
Create a `.env.local` file in your project root:

```bash
# PayStack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:8000

# For Production
# NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key_here
# NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Supported Payment Methods
- ✅ **Credit/Debit Cards** (Visa, Mastercard, Verve)
- ✅ **Mobile Money** (MTN, Vodafone, AirtelTigo)
- ✅ **Bank Transfers**
- ✅ **USSD** (for Nigerian users)

### 4. Payment Flow
1. **Add to Cart**: Users select causes and add donations to their cart
2. **Checkout**: Users provide payment information and select payment method
3. **PayStack Processing**: 
   - **Cards**: Inline PayStack popup for seamless UX
   - **Mobile Money**: Redirect to PayStack for network-specific flow
   - **Bank Transfer**: PayStack handles bank integration
4. **Verification**: Real-time payment verification using PayStack API
5. **Success**: Confirmed donations with receipt and impact tracking

### 5. Security Features
- 🔒 **PCI DSS Compliance** via PayStack
- 🛡️ **No card data storage** on your servers
- 🔐 **Encrypted transactions** end-to-end
- ✅ **Real-time verification** prevents fraud

## Getting Started

First, install dependencies and run the development server:

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
