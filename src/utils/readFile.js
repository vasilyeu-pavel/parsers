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

const isDownloading = path => fs.existsSync(`./src/youtube-dl/${path}`);

module.exports = {
    readFile,
    isDownloading,
};
