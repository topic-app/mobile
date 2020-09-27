#!/usr/bin/env bash

# Variables to change
BASE_BRANCH=v0.4-beta

# Get path to script
SCRIPT_PATH="`dirname \"$0\"`"                  # relative
MOBILE_PATH="`( cd \"$SCRIPT_PATH/../..\" && pwd )`"  # absolutized and normalized

# Navigate to android folder
cd "$MOBILE_PATH/android"

# Exit on errors
set -e

set -a # export every variable to environment to be used by child shells
source "$MOBILE_PATH/.ENV"
set +a

NAMES=("${BETA_TESTER_NAMES[@]}")

echo "Beta testers (${#NAMES[@]}):"
for i in "${NAMES[@]}"; do echo "- $i"; done


# Confirm action
echo "This script will attempt to build ${#NAMES[@]} apks with corresponding version names."

# Loop through names
for (( i = 0; i < ${#NAMES[@]}; i++ )); do
  # Export beta tester name to be used in gradle build flavor, see app/build.gradle
  export BETA_TESTER_NAME=${NAMES[i]}
  echo "Building for $BETA_TESTER_NAME ( $(( i + 1 ))/${#NAMES[@]})"
  # If branch exists then checkout
  ./gradlew assembleRelease
done

APK_PATH=$MOBILE_PATH/android/app/build/outputs/apk
if [ -n "$MOBILE_PATH" ] && [ -n "$APK_PATH" ]; then
  # Move all apks in apks directory and delete remains
  mv "$APK_PATH/"*"/release/"*".apk" $MOBILE_PATH/android/scripts/apks
  rm -r "$APK_PATH/"*
fi
