# PayStack Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create Environment File
Create a file named `.env.local` in your project root:

```bash
# PayStack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_036c03cd4c0b4f90b74318c95bda9c78ff680a0a
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Step 2: Restart Server
```bash
# Stop current server (Ctrl+C in terminal)
npm run dev
```

### Step 3: Test Payment
1. Go to `/causes` page
2. Click "Add to Cart" on any cause
3. Go to checkout
4. Click "Pay with PayStack"
5. Use test card: `4084 0840 8408 4081`
6. CVV: `408`, PIN: `0000`, Any future expiry

## Get Your Own PayStack Keys (Optional)

1. Visit: https://dashboard.paystack.com/settings/developer
2. Copy your Public Key (starts with `pk_test_`)
3. Replace in `.env.local` file

## What You'll See

✅ **PayStack Inline Checkout** - Beautiful popup interface
✅ **Multiple Payment Options** - Cards, Mobile Money, Bank Transfer
✅ **Real Payment Processing** - Actual PayStack integration
✅ **Success Verification** - Real transaction confirmation

## Troubleshooting

**"PayStack script not loaded"** → Restart server after adding `.env.local`
**Payment not opening** → Check browser console (F12) for errors
**No items in cart** → Add causes from `/causes` page first
**Test card declined** → Use exact test card: `4084 0840 8408 4081`

## Ready to Go Live?

Replace test key with live key:
```bash
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_live_key
```
