#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Installing dependencies..."
npm install

echo "Generating Prisma Client..."
npx prisma generate

echo "Applying Database Migrations..."
npx prisma migrate deploy

echo "Building the application..."
npm run build

echo "Build complete."
