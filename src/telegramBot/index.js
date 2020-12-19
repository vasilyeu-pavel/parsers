const request = require('request');

const config = {
    token: '649626996:AAHuIMPw2xLUEgAoQgO6nM-v9rcwlQTVlEI',
    chatId: 405898308
};

const createMessage = ({ matches }) => {
    if (!matches) return 'matches - 0';

    return `[#Скачались матчи]:
        ${matches.map(({ name = '', date = '' }, i) => `\n${i + 1}) *${date}_${name.replace(/ /g, '')}*`)}
    `;
};

const sendTelegramMessage = (message) => new Promise((resolve, reject) => {
    const messages = createMessage(message).replace(/,/g, '');

    const options = {
        method: 'GET',
        url: `https://api.telegram.org/bot${config.token}/sendMessage`,
        qs:
            {
                chat_id: config.chatId,
                text: messages
            },
        headers:
            {
                Connection: 'keep-alive',
                'Accept-Encoding': '',
                'Accept-Language': 'en-US,en;q=0.8',
                'cache-control': 'no-cache',
                'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
            },
        formData: { parse_mode: 'Markdown' }
    };

    request(options, (error, response, body) => {
        if (error) reject(error);
        resolve(body);
    });
});

module.exports = { sendTelegramMessage };
