var fs = require('fs');
var path = require('path');

var VCS = '.myvcs';
var CWD = process.cwd();

// Create VCS directory
if (!fs.existsSync(VCS)) fs.mkdirSync(VCS);

function backup() {
  fs.mkdir(nextBackup());
  cpdirSync(CWD, path.join(latestBackup(), path.basename(CWD)));
}

function checkout(n) {
  if (!n) throw new Error('Checkout number not provided');
  cleardir(CWD);
  cpdirSync(path.join(CWD, VCS, n.toString()), path.join(CWD, '..'));
}

/**
 * Copying files and directories
 */
function cpFileSync(fIn, fOut) {
  var data = fs.readFileSync(fIn, { encoding: 'utf8' });
  fs.writeFileSync(fOut, data);
}

function cpdirSync(dIn, dOut) {
  var stats = fs.lstatSync(dIn);
  if (stats.isDirectory()) {
    console.log('Copying directory:', dIn);

    // Create backup directory
    if (!fs.existsSync(dOut)) fs.mkdirSync(dOut);

    // Recursively copy files in current directory
    var ls = fs.readdirSync(dIn);
    ls.forEach(function(file) {
      if (file === VCS) return;
      cpdirSync(path.join(dIn, file), path.join(dOut, file));
    });
  } else if (stats.isFile()) {
    console.log('Copying file:', dIn);
    cpFileSync(dIn, dOut);
  }
}

/**
 * Clearing directories
 */
function cleardir(dir) {
  var ls = fs.readdirSync(dir);
  
  // Remove empty directory
  if (ls.length === 0) return fs.rmdirSync(dir);

  ls.forEach(function(file) {
    if (!file || file === VCS) return;
    var filepath = path.join(dir, file);
    var stats = fs.lstatSync(filepath);

    // Recursively clear directory
    if (stats.isDirectory()) cleardir(filepath);

    // Remove file
    if (stats.isFile()) fs.unlinkSync(filepath);
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
  default:
    throw new Error('Invalid command');
}
