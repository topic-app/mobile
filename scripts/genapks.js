#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { execSync, spawn } = require('child_process');

const { yesNo, readFileAsync, findMarker } = require('./utils');

const projectPath = path.resolve(__dirname, '..');
const envFile = path.resolve(projectPath, '.ENV');

let config = {};

const checklist = async () => {
  console.log(' → Running checklist');

  let hasFoundMistake = false;

  // Check if .ENV exists
  const envExists = fs.existsSync(envFile);
  if (envExists) {
    console.log(' ✅ .ENV exists');
  } else {
    console.error(' ❌ .ENV does not exist');
    console.error(`Please add .ENV at ${envFile}`);
    process.exit(1);
  }

  // Test if keystore exists
  const keystoreExists = fs.existsSync(path.resolve(projectPath, 'android/app/topic.keystore'));
  if (keystoreExists) {
    console.log(' ✅ android/app/topic.keystore exists');
  } else {
    console.error(' ❌ android/app/topic.keystore does not exist');
    process.exit(1);
  }

  // Read env file and store in config variable
  try {
    config = JSON.parse(await readFileAsync({ filePath: envFile }));
  } catch (e) {
    console.error(' ❌ Invalid JSON in .ENV file');
    process.exit(1);
  }

  // Check if properties are missing from env file
  ['betaTesterNames', 'releaseKeystorePassword'].forEach((property) => {
    if (config[property]) {
      console.log(` ✅ Property '${property}' exists in .ENV`);
    } else {
      console.error(` ❌ Missing property '${property}' in .ENV`);
      hasFoundMistake = true;
    }
  });

  if (hasFoundMistake) process.exit(1);

  // Check if keystore password unlocks keystore
  if (config.releaseKeystorePassword) {
    await new Promise((resolve, reject) => {
      const keytoolArgs = [
        '-list',
        '-keystore',
        path.resolve(projectPath, 'android/app/topic.keystore'),
        '-storepass',
        config.releaseKeystorePassword,
      ];
      const keytool = spawn('keytool', keytoolArgs);

      // keytool.stdout.on('data', (data) => process.stdout.write(data));

      keytool.stderr.on('data', (data) => {
        console.error(`ERR: ${data}`);
        console.error(' ❌ Keystore password invalid.');
        process.exit(1);
      });

      keytool.on('close', (code) => {
        if (code === 0) {
          console.log(' ✅ Keystore password is valid');
          resolve('Keystore password valid');
        } else {
          console.error(' ❌ Keystore password invalid.');
          process.exit(1);
        }
      });
    });
  }

  // Show user both android and ios config files to manually check that
  // both app versions are up-to-date
  const gradleLines = await findMarker({
    filePath: path.resolve(projectPath, 'android/app/build.gradle'),
    markerName: 'androidVersion',
    numLines: 2,
  });

  const plistLines = await findMarker({
    filePath: path.resolve(projectPath, 'ios/Topic/Info.plist'),
    markerName: 'iosVersion',
    numLines: 2,
  });

  console.log();
  console.log(' → android/app/build.gradle:');
  console.log(gradleLines);
  console.log();
  console.log(' → ios/Topic/Info.plist');
  console.log(plistLines);
  console.log();

  console.log('NOTE: versionCode should be incremented at each new version');
  const isCorrectVersion = await yesNo('Are versions up-to-date in both platform files?');
  if (isCorrectVersion) {
    console.log(' ✅ Version up-to-date');
  } else {
    process.exit(1);
  }

  const runReinstallNpm = await yesNo("Run 'rm -rf node_modules && npm install'?", false);
  const runGradlewClean = await yesNo("Run 'cd android && ./gradlew clean'?", false);

  if (runReinstallNpm || runGradlewClean) {
    console.log('Building will start after commands.');
  }

  if (runReinstallNpm) {
    execSync('rm -rf node_modules && npm install', { cwd: projectPath });
  }
  if (runGradlewClean) {
    execSync('./gradlew clean && cd ..', { cwd: path.resolve(projectPath, 'android') });
  }

  console.log(' ✅ Checklist complete!');
};

(async () => {
  const runChecklist = await yesNo('Run checklist?');
  if (runChecklist) await checklist();

  config = JSON.parse(await readFileAsync({ filePath: envFile }));

  const builds = [];

  config.betaTesterNames.forEach((name, index) => {
    builds.push(() => {
      return new Promise((resolve, reject) => {
        console.log(
          '>>> Building APK',
          index,
          'of',
          config.betaTesterNames.length,
          `(${Math.round(index / config.betaTesterNames.length)}%)`,
          'for',
          name,
        );
        const gradlewEnv = {
          ...process.env,
          BETA_TESTER_NAME: name,
          RELEASE_KEYSTORE_PASSWORD: config.releaseKeystorePassword,
        };
        const gradlew = spawn('./gradlew', ['assembleRelease'], {
          env: gradlewEnv,
          cwd: path.resolve(projectPath, 'android'),
        });

        gradlew.stdout.on('data', (data) => process.stdout.write(data));

        gradlew.stderr.on('data', (data) => {
          console.error(`ERR: ${data}`);
          console.error(' ❌ Gradle build encoutered error, aborting...');
          process.exit(1);
        });

        gradlew.on('close', (code) => {
          if (code === 0) {
            console.log('Gradle build finished successfully');
            resolve('Gradle build finished');
          } else {
            console.error(` ❌ Gradle build exited with error code ${code}, aborting...`);
            process.exit(1);
          }
        });
      });
    });
  });

  /* eslint-disable-next-line no-restricted-syntax */
  for (const build of builds) {
    /* eslint-disable-next-line no-await-in-loop */
    await build();
  }
})();
