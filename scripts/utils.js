const { createReadStream } = require('fs');
const fs = require('fs').promises;
const readline = require('readline');
const prompts = require('prompts');

const yesNo = async (question, initial = true) => {
  const response = await prompts({
    type: 'confirm',
    name: 'value',
    message: question,
    initial,
  });
  return response.value;
};

/**
 * Read file asynchronously and log errors
 * @param {string} filePath Absolute path to file
 * @param {string?} successMsg Message to show on success
 * @param {string?} errorMsg Message to show on success
 * @param {boolean?} exitOnError Exits node script on error
 */
const readFileAsync = async ({ filePath, successMsg, errorMsg, exitOnError = true }) => {
  let file;
  try {
    file = await fs.readFile(filePath);
    if (successMsg) console.log(successMsg || ` ✅ ${filePath} exists.`);
  } catch (e) {
    console.error(errorMsg || ` ❌ Error while reading ${filePath} file.`);
    if (exitOnError) process.exit(1);
  }
  return file;
};

/**
 * Returns number of lines after desired marker in specified file
 * @param {string} filePath Absolute path to file
 * @param {string} markerName Name of marker to find in file
 * @param {string} numLines Number of lines after marker to return
 */
const findMarker = async ({ filePath, markerName, numLines = 1 }) => {
  // Seperate stream into array of lines
  let rl;
  try {
    rl = readline.createInterface({
      input: createReadStream(filePath),
      crlfDelay: Infinity,
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
  } catch (e) {
    console.error(` ❌ Error while reading ${filePath} file`);
    process.exit(1);
  }

  let foundMarker = false;
  const desiredLines = [];

  /* eslint-disable-next-line no-restricted-syntax */
  for await (const line of rl) {
    if (foundMarker && desiredLines.length < numLines) {
      // Previously found marker and within desired number of lines
      desiredLines.push(line);
    } else if (foundMarker) {
      // Found marker and beyond desired number of lines
      // so exit for loop and return lines
      break;
    } else if (line.includes('SCRIPT MARKER') && line.includes(markerName)) {
      foundMarker = true;
    }
  }

  return desiredLines.join('\n');
};

module.exports = { yesNo, readFileAsync, findMarker };
