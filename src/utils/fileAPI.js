const fs = require('fs');
const path = require('path');

const readFileAsync = (file) => new Promise(resolve => {
    fs.readFile(file, (err, data) => {
        if (err) throw err;
        resolve(data);
    });
});

const writeFileAsync = (data, fileName) => new Promise(resolve => {
    fs.writeFile(fileName, data, (err) => {
        if (err) throw err;
        console.log(`The file ${fileName} has been saved!`);
        resolve();
    });
});

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
    readFileAsync,
    writeFileAsync,
};
