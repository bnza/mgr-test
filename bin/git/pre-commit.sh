#!/bin/sh
# Run prettier on staged files before commit

# Get list of staged files with supported extensions
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx|js|jsx|vue|css|scss|json|md)$')

if [ -z "$STAGED_FILES" ]; then
  echo "No staged files to format."
  exit 0
fi

echo "Running Prettier on staged files..."
echo "$STAGED_FILES" | xargs pnpm prettier --write

# Re-add the formatted files to the staging area
echo "$STAGED_FILES" | xargs git add

echo "Prettier formatting applied to staged files."
exit 0
