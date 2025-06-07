#!/bin/bash

# Attempt to source profile/rc files to load environment
if [ -f ~/.bash_profile ]; then
    source ~/.bash_profile
fi
if [ -f ~/.bashrc ]; then
    source ~/.bashrc
fi

# Explicitly setup brew and fnm environments just in case
if [ -x "/opt/homebrew/bin/brew" ]; then
  eval "$(/opt/homebrew/bin/brew shellenv)"
fi
if command -v fnm &> /dev/null; then
  eval "$(fnm env --use-on-cd)"
fi

echo "Checking Node.js version..."

# Check if fnm exists
if ! command -v fnm &> /dev/null; then
    echo "fnm command not found. Attempting to install..."
    # Try finding brew again directly
    if command -v /opt/homebrew/bin/brew &> /dev/null; then
      echo "Attempting to install fnm with: /opt/homebrew/bin/brew install fnm"
      /opt/homebrew/bin/brew install fnm
      # Re-check if fnm is now available
      if command -v fnm &> /dev/null; then
        echo "fnm installed successfully. Please re-run the command."
        exit 0 # Exit cleanly so user can re-run
      else
        echo "Failed to install fnm automatically."
        exit 1
      fi
    else 
      echo "Homebrew not found at /opt/homebrew/bin/brew. Cannot install fnm automatically."
      exit 1
    fi
fi

# Ensure fnm environment is loaded (redundant but safe)
eval "$(fnm env --use-on-cd)"

# Check if Node v20.18.3 is installed by fnm, install if not
if ! fnm list | grep -q 'v20.18.3'; then
    echo "Node.js v20.18.3 not found via fnm. Installing..."
    if ! fnm install 20.18.3; then
      echo "Failed to install Node.js v20.18.3 using fnm."
      exit 1
    fi
fi

# Check current version and switch if necessary
current_version=$(node -v)
required_version="v20.18.3"

if [ "$current_version" != "$required_version" ]; then
    echo "Switching to Node.js $required_version..."
    if ! fnm use 20.18.3; then
      echo "Failed to switch to Node.js v20.18.3 using fnm."
      exit 1
    fi
    echo "Switched. Verifying..."
    node -v # Verify the switch
else
    echo "Node.js version ($current_version) is correct."
fi

# Execute next dev, replacing this script process
echo "Starting Next.js development server..."
exec next dev 