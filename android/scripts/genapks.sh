#!/usr/bin/env bash

# Variables to change
BASE_BRANCH=v0.2-beta

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
  echo "Your git working tree is dirty. This script will fail to checkout ANY branch and will stay on this branch. Please make sure you are on the desired build branch."
  read -r -p "Continue? [y/N] " response
  case "$response" in
    [Yy][Ee][Ss]|[Yy][Ee]|[Yy])
      echo "Proceeding"
      ;;
    *)
      echo "Aborting"
      exit 1
      ;;
  esac
fi

# Check if this script uses the right beta version, used for git branch checks
read -r -p "Are you sure $BASE_BRANCH is the correct base branch? [Y/n] " response
case "$response" in
  [nN][oO]|[nN])
    echo "Please change BASE_BRANCH at the top of the script"
    exit 1
    ;;
  *)
    echo "Proceeding with base branch $BASE_BRANCH"
    ;;
esac

# Store branches and names in arrays
echo "Fetching branch names for topicapp/mobile (may take a while)"
BRANCHES=( $( git ls-remote --heads git@gitlab.com:topicapp/mobile | cut -f3- -d / ) )
NAMES=( $(cat $NAME_FILE) )

# Print branches & names
echo "Branches (${#BRANCHES[@]}):"
for i in "${BRANCHES[@]}"; do echo "- $i"; done

if [[ ! " ${BRANCHES[@]} " =~ " $BASE_BRANCH " ]]; then
  echo "No branch '$BASE_BRANCH' found on remote."
  exit 1
fi

echo "Beta testers (${#NAMES[@]}):"
for i in "${NAMES[@]}"; do echo "- $i"; done

LB=$'\n'

# Confirm action
read -r -p "This script will attempt to build ${#NAMES[@]} apks with corresponding version names.${LB}It will try to checkout branch $BASE_BRANCH[-name] and fallback to $BASE_BRANCH.${LB}Proceed? [Y/n] " response
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
  # Export beta tester name to be used in gradle build flavor, see app/build.gradle
  export BETA_TESTER_NAME=${NAMES[i]}
  echo "Building for $BETA_TESTER_NAME ( $(( i + 1 ))/${#NAMES[@]})"
  # If branch exists then checkout
  TARGET_BRANCH="$BASE_BRANCH-$BETA_TESTER_NAME"
  if [[ " ${array[@]} " =~ " "$TARGET_BRANCH" " ]]; then
    git checkout "$TARGET_BRANCH"
  else
    git checkout "$BASE_BRANCH"
  fi
  # Exit on errors
  set -e
  ./gradlew assembleRelease
done

if [ -n "$SCRIPT_PATH" ] && [ -n "$APK_PATH" ]; then
  # Move all apks in apks directory and delete remains
  mv "$APK_PATH/"*"/release/"*".apk" $SCRIPT_PATH/apks
  rm -r "$APK_PATH/"*
fi
