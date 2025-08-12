#!/bin/bash

echo "🔍 Notesify Build Diagnostics"
echo "=============================="

echo "📦 Node.js Version:"
node --version

echo "📦 NPM Version:"
npm --version

echo "🔧 Environment Variables Check:"
if [ -z "$MONGO_URI" ]; then
  echo "❌ MONGO_URI is missing"
else
  echo "✅ MONGO_URI is set"
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
  echo "❌ NEXTAUTH_SECRET is missing"
else
  echo "✅ NEXTAUTH_SECRET is set"
fi

if [ -z "$RESEND_API_KEY" ]; then
  echo "❌ RESEND_API_KEY is missing"
else
  echo "✅ RESEND_API_KEY is set"
fi

if [ -z "$DOMAIN" ]; then
  echo "❌ DOMAIN is missing"
else
  echo "✅ DOMAIN is set"
fi

echo "🔨 Running Build..."
npm run build

echo "🧪 Running Type Check..."
npx tsc --noEmit

echo "✨ Build Diagnostics Complete!"
