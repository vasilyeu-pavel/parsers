var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

const chunkArray = (arr, chunk) => {
  let i, j, result = [];
  for (i = 0, j = arr.length; i < j; i += chunk) {
    result.push(arr.slice(i, i + chunk));
  }
  return result;
}

function spawnProcess(dir, cmd) {
  return (process.platform.toLowerCase().indexOf("win") >= 0) 
    ? spawnWindowsProcess(dir, cmd)
    : spawnLinuxProcess(dir, cmd);
}

function spawnWindowsProcess(dir, cmd) {
  return spawn("cmd.exe", ["/c", cmd], {cwd: dir});
}

function spawnLinuxProcess(dir, cmd) {
  var cmdParts = cmd.split(/\s+/);
  return spawn(cmdParts[0], cmdParts.slice(1), { cwd: dir});
}

function runCmdHandler(dir, cmd) {
  var process = null;
  try {
    process = spawnProcess(dir, cmd);
    return new Promise((resolve) => {
      console.log('start --->', cmd);
      process.stdout.on('data', function (data) {
        console.log("progress", data.toString('utf-8'));
    });
     process.stderr.on('data', function (data) {
        console.log("error", data.toString('utf-8'));
     });
      process.on('exit', (code, signal) => {
        console.log('finish ---> resolve', code, signal);
        resolve('true');
      })
    });

  } catch (e) {
    console.error("Error trying to execute command '" + cmd + "' in directory '" + dir + "'");
    console.error(e);
    console.log("error", e.message);
    console.log("finished");
    return;
  }
}

let downloader = (arrLinks, count) => {
  let result = []
  for (var i = 0; i < arrLinks.length; i++) {
    let link = `youtube-dl stor-2.staylive.se/seodiv/${arrLinks[i].ID}/720/720.m3u8 --output ${arrLinks[i].ID}.mp4`
    result.push(runCmdHandler('./youtube-dl', link))
  }
  return Promise.all(result)
}

let filterForDate = (arr, dayAgo) => {
  let newDate = new Date(new Date - (86400 * 1000) * dayAgo)

  let filteredArr = arr.filter((el) => {
    let date = new Date(el.date)
    return date >= newDate.getDate()
  })

  return filteredArr
}

async function start(arr){
  let filteredByDate = filterForDate(arr, 9)
    console.log(filteredByDate)
  let chunkArr = chunkArray(filteredByDate, 3)
  for (var i = 0; i < chunkArr.length; i++) {
    let a = await downloader(chunkArr[i], i)
  }
}

module.exports = start

