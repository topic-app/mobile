#!/usr/bin/env bash

# Variables to change
BETA_VERSION=0.2

# Get path to script
SCRIPT_PATH="`dirname \"$0\"`"                  # relative
SCRIPT_PATH="`( cd \"$SCRIPT_PATH\" && pwd )`"  # absolutized and normalized
APK_PATH=$SCRIPT_PATH/../app/build/outputs/apk

# Navigate to android folder
cd "$SCRIPT_PATH/.."

# Check if beta-testers.txt is present
NAME_FILE=$SCRIPT_PATH/beta-testers.txt
if ! [ -f "$NAME_FILE" ]; then
  echo "beta-testers.txt not found, it should be placed in android/scripts alongside this script."
  exit 1
fi

if [[ $(git diff --stat) != '' ]]; then
  echo "Your git working tree is dirty. Please commit anything (and hopefully push) before proceeding."
fi

# Check if this script uses the right beta version, used for git branch checks
read -r -p "Are you sure $BETA_VERSION is the latest app version? [Y/n] " response
case "$response" in
  [nN][oO]|[nN])
    echo "Please change BETA_VERSION to the correct version at the top of the script"
    exit 1
    ;;
  *)
    echo "Proceeding with version $BETA_VERSION"
    ;;
esac

# Store branches and names in arrays
echo "Fetching branch names for topicapp/mobile (may take a while)"
BRANCHES=( $( git ls-remote --heads git@gitlab.com:topicapp/mobile | cut -f3- -d / ) )
NAMES=( $(cat $NAME_FILE) )

if [[ " ${BRANCHES[@]} " =~ " "beta-v$BETA_VERSION" " ]]; then
  echo "No branch 'beta-v$BETA_VERSION' found on remote."
  exit 1
fi

# Print branches & names
echo "Branches (${#BRANCHES[@]}):"
for i in "${BRANCHES[@]}"; do echo "- $i"; done

echo "Beta testers (${#NAMES[@]}):"
for i in "${NAMES[@]}"; do echo "- $i"; done

# Confirm action
read -r -p "This script will attempt to build ${#NAMES[@]} apks with different versions.\nIt will attempy to git checkout branch beta-$BETA_VERSION-<NAME> and fallback to beta-$BETA_VERSION. To cancel, press CTRL + C a bunch of times. Proceed? [Y/n] " response
case "$response" in
  [nN][oO]|[nN])
    echo "Aborting"
    exit 1
    ;;
  *)
    echo "Proceeding"
    ;;
esac

# Loop through names
for (( i = 0; i < ${#NAMES[@]}; i++ )); do
  # Export beta tester name to be used in gradle build flavor
  export BETA_TESTER_NAME=${NAMES[i]}
  echo "Building for $BETA_TESTER_NAME ( $(( i + 1 ))/${#NAMES[@]})"
  # If branch exists then checkout
  if [[ " ${array[@]} " =~ " "beta-v$BETA_VERSION-$BETA_TESTER_NAME" " ]]; then
    git checkout beta-v$BETA_VERSION-$BETA_TESTER_NAME
  else
    git checkout beta-v$BETA_VERSION
  fi
  ./gradlew assembleRelease
done

# Move all apks in apks directory and delete remains
mv "$APK_PATH/"*"/release/"*".apk" $SCRIPT_PATH/apks
rm -rf $APK_PATH/*
