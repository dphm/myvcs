var fs = require('fs');
var path = require('path');

var VCS = '.myvcs';
var CWD = process.cwd();

// Create VCS directory
if (!fs.existsSync(VCS)) fs.mkdirSync(VCS);

function backup() {
  fs.mkdir(nextBackup());
  fs.mkdir(path.join(nextBackup(), path.basename(CWD)));
  cpContents(CWD, path.join(latestBackup(), path.basename(CWD)));
}

function checkout(n) {
  if (!n) throw new Error('Checkout number not provided');
  cleardir(CWD);
  cpContents(path.join(CWD, VCS, n.toString(), path.basename(CWD)), path.join(CWD));
}

/**
 * Copying files and directories
 */
function cpFile(fIn, fOut) {
  var data = fs.readFileSync(fIn, { encoding: 'utf8' });
  fs.writeFileSync(fOut, data);
}

function cpContents(dIn, dOut) {
  console.log('Copying contents:', dIn);

  var ls = fs.readdirSync(dIn);
  ls.forEach(function(file) {
    if (file === VCS) return;
    var fIn = path.join(dIn, file);
    var fOut = path.join(dOut, file);
    var stats = fs.lstatSync(fIn);

    if (stats.isDirectory()) {
      fs.mkdirSync(fOut);
      cpContents(fIn, fOut);
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
  var ls = fs.readdirSync(dir);

  ls.forEach(function(file) {
    if (file === VCS) return;
    var filepath = path.join(dir, file);
    var stats = fs.lstatSync(filepath);

    if (stats.isDirectory()) {
      cleardir(filepath);
    } else if (stats.isFile()) {
      fs.unlinkSync(filepath);
    }
  });

  if (dir !== CWD) {
    fs.rmdirSync(dir);
  }
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
  case 'clear':
    cleardir(CWD);
    break;
  default:
    throw new Error('Invalid command');
}

