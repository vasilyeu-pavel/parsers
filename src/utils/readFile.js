const fs = require('fs');
const path = require('path');

const readFile = (readFileName, callback) => {
    const readStream = fs.createReadStream(path.join(__dirname, readFileName));
    let data = '';
    readStream
        .on('data', (chunk) => {
            data += chunk;
        })
        .on('end', () => {
            const arr = data.split(',');
            callback(arr);
        });
};

module.exports = readFile;
