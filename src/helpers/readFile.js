const fs = require('fs');
const path = require('path');

const readFile = (readFileName, callback) => {
  let readStream = fs.createReadStream(path.join(__dirname, readFileName));
  let data = ''
  readStream
  .on('data', function(chunk) {
      data += chunk;
  })
  .on('end', function() {
    let arr = data.split(',')
    callback(arr)
  });
}

module.exports = readFile