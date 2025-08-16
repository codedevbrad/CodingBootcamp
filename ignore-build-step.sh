#!/bin/bash

echo "Branch: $VERCEL_GIT_COMMIT_REF"
echo "Environment: $VERCEL_ENV"

# Only build on production and preview
if [[ "$VERCEL_ENV" == "production" || "$VERCEL_ENV" == "preview" ]]; then
  echo "✅ Building on $VERCEL_ENV environment"
  exit 1  # Exit code 1 means "proceed with build"
else
  echo "⏭️ Skipping build on $VERCEL_ENV environment"
  exit 0  # Exit code 0 means "ignore this build"
fi