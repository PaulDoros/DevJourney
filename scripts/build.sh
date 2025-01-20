#!/bin/bash
set -e

# Clean previous build
rm -rf build
rm -rf public/build

# Production build
NODE_ENV=production VITE_USER_NODE_ENV=production pnpm build

# Verify build
node scripts/verify-build.js 