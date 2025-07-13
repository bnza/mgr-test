#!/bin/sh

# Get directories
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
HOOKS_DIR="$PROJECT_ROOT/.git/hooks"

echo "Setting up Git hooks..."
echo "Project root: $PROJECT_ROOT"
echo "Hooks directory: $HOOKS_DIR"

# Change directory to project root
cd "$HOOKS_DIR" || {
  echo "Error: Cannot change directory to project root: $PROJECT_ROOT"
  exit 1
}

# Create symlink from project root
ln -sf "../../bin/git/pre-commit.sh" "pre-commit" || {
  echo "Error: Failed to create symlink for pre-commit hook"
  exit 1
}

# Make pre-commit hook executable
chmod +x "pre-commit" || {
  echo "Error: Failed to make pre-commit hook executable"
  exit 1
}

echo "Git pre-commit hook setup complete!"
