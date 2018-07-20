let axios = require('axios');
let downloader = require('./src/youtube-dl')

let option = {
    'Accept': 'application/json, text/plain',
    'Referer': 'https://www.ettanplay.se/videoklipp/25',
    'Origin': 'https://www.ettanplay.se',
    'Auth-ID': '49120',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
    'Auth-Token': 'd8d49cd10f7442db2478a993360bec0b', 
}

axios.get('https://api.staylive.se/collection/getcategory/2/25', {
  'headers': option 
  ,
})
  .then(function (response) {
    let arr = response.data
    return arr
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function (arrs) {
    downloader(arrs)
  });

