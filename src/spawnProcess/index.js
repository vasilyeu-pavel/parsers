const spawn = require('child_process').spawn;

function spawnProcess(dir, cmd) {
  return (process.platform.toLowerCase().indexOf("win") >= 0) 
    ? spawnWindowsProcess(dir, cmd)
    : spawnLinuxProcess(dir, cmd);
};

function spawnWindowsProcess(dir, cmd) {
  return spawn("cmd.exe", ["/c", cmd], {cwd: dir});
};

function spawnLinuxProcess(dir, cmd) {
  let cmdParts = cmd.split(/\s+/);
  return spawn(cmdParts[0], cmdParts.slice(1), { cwd: dir});
};

module.exports = spawnProcess
