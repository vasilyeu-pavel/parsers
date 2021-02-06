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

const isDownloading = (path) => fs.existsSync(`./src/youtube-dl/${path}`);

const JSONMatches = {
    name: 'matches.json',
    read(pathName) {
        const data = fs.readFileSync(`${pathName}${this.name}`, 'utf8');
        return JSON.parse(data);
    },
    write(data) {
        fs.writeFileSync(`./${this.name}`, JSON.stringify(data));
    }
};

module.exports = {
    readFile,
    isDownloading,
    JSONMatches,
};
