FROM gitpod/workspace-full

USER gitpod

RUN npm install --global expo-cli react-native-cli

ENV GP_DEV=true