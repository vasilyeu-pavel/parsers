const fetch = require('node-fetch');

const cookiesParser = coockies => {
    const arrFiltered = coockies.filter((el) => el.name === '_ga' || el.name === '__zlcmid' || el.name === 'Mediabank_' || el.name === 'server-id' );

    let str = '';
    for (let i = 0; i < arrFiltered.length; i++) {
        const elCockies = `${arrFiltered[i].name}=${arrFiltered[i].value}; `;
        str += elCockies
    }

    return str;
};

const getMatchList = async (cookies, name) => {
    const options = {
        'Content-Length': '300',
        'Cookie': cookies,
    };

    const res = await fetch('https://www.mediabank.me/ajax/advanced_search.php', {
        headers: options,
        body: JSON.stringify({
            offset: 0,
            limit: 64,
            page: 1,
            sortorder: '',
            orderBy: '',
            application: 'library'
        })
    });

    const parsedRes = await res.json();

    console.log(parsedRes)
};

module.exports = {
    cookiesParser, getMatchList
};
