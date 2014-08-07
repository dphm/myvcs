var fs = require('fs');
var path = require('path');

var VCS = '.myvcs';
var CWD = process.cwd();
var HEAD = path.join(VCS, 'head');

// Create VCS directory
if (!fs.existsSync(VCS)) {
  fs.mkdirSync(VCS);
}

// Create head file
if (!fs.existsSync(HEAD)) {
  fs.writeFileSync(HEAD, '');
}

function backup() {
  fs.mkdir(nextBackup());
  cpdir(CWD, latestBackup(), { cpTopLevel: true });
  setHead(latestIndex());
}

function checkout(n) {
  if (!n) throw new Error('Checkout number not provided');
  var backup = path.join(CWD, VCS, n.toString(), path.basename(CWD));
  cleardir(CWD);
  cpdir(backup, CWD);
  setHead(n);
}

function current() {
  var data = fs.readFileSync(HEAD, { encoding: 'utf8' });
  console.log(data);
  return data;
}

/**
 * Copying files and directories
 */
function cpFile(fIn, fOut) {
  var data = fs.readFileSync(fIn, { encoding: 'utf8' });
  fs.writeFileSync(fOut, data);
}

function cpdir(dIn, dOut, options) {
  options = options || {};
  console.log('Copying contents:', dIn);

  if (options.cpTopLevel === true) {
    var dOut = path.join(dOut, path.basename(dIn));
    fs.mkdirSync(dOut);
  }

  var ls = fs.readdirSync(dIn);
  ls.forEach(function(file) {
    if (file === VCS) return;
    var fIn = path.join(dIn, file);
    var fOut = path.join(dOut, file);
    var stats = fs.lstatSync(fIn);

    if (stats.isDirectory()) {
      fs.mkdirSync(fOut);
      cpdir(fIn, fOut);
    } else if (stats.isFile()) {
      console.log('Copying file:', fIn);
      cpFile(fIn, fOut);
    }
  });
}

/**
 * Clearing directories
 */
function cleardir(dir) {
  function dirFn(filepath) { fs.rmdirSync(filepath); }
  function fileFn(filepath) { fs.unlinkSync(filepath); }
  traverseWith(dir, dirFn, fileFn, { post: true });
}

/**
 * Traversing directory tree, applying dirFn and fileFn
 */
function traverseWith(dir, dirFn, fileFn, options) {
  options = options || {};
  var ls = fs.readdirSync(dir);

  ls.forEach(function(file) {
    if (file === VCS) return;
    var filepath = path.join(dir, file);
    var stats = fs.lstatSync(filepath);

    if (stats.isDirectory()) {
      if (options.pre === true) {
        dirFn(filepath);
      }
      traverseWith(filepath, dirFn, fileFn, options);
      if (options.post === true) {
        dirFn(filepath);
      }
    } else if (stats.isFile()) {
      fileFn(filepath);
    }
  });
}

/**
 * Backup helpers
 */
function numBackups() {
  return fs.readdirSync(VCS).length;
}

function latestIndex() {
  return numBackups() - 1;
}

function latestBackup() {
  return path.join(CWD, VCS, latestIndex().toString());
}

function nextBackup() {
  return path.join(CWD, VCS, numBackups().toString());
}

function setHead(n) {
  fs.writeFileSync(HEAD, n);
}

/**
 * Command line processing
 */
var args = process.argv.slice(2);
switch (args[0]) {
  case 'backup':
    backup();
    break;
  case 'checkout':
    checkout(args[1]);
    break;
  case 'latest':
    checkout(latestIndex());
    break;
  case 'current':
    current();
    break;
  case 'clear':
    cleardir(CWD);
    break;
  default:
    throw new Error('Invalid command');
}

