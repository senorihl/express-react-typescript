"use strict";

const path = require("path");

const fs = jest.createMockFromModule("fs");

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null);
let mockFilesContents = Object.create(null);
function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null);
  mockFilesContents = Object.create(null);
  for (const file in newMockFiles) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(file));
    mockFilesContents[file] = newMockFiles[file];
  }
}

function readFileSync(directoryPath) {
  return Buffer.from(mockFilesContents[directoryPath]);
}

// Une version personnalisée de `readdirSync' qui lit à partir
// de la liste de fichiers simulés définie via __setMockFiles
function readdirSync(directoryPath) {
  return mockFiles[directoryPath] || [];
}

fs.__setMockFiles = __setMockFiles;
fs.readdirSync = readdirSync;
fs.readFileSync = readFileSync;

module.exports = fs;
