const request = require("request");

const config = {
    token: '649626996:AAHuIMPw2xLUEgAoQgO6nM-v9rcwlQTVlEI',
    chatId: 405898308,
};

const createMessage = ({ league, matches }) =>
    `[#Скачались матчи] *(${league})*:
${matches.map(({ name, date }, i) => `\n${i + 1}) *${date}_${name}*`)}
        }`;

const sendTelegramMessage = message => new Promise((resolve, reject) => {
    const messages = createMessage(message).replace(/,/g, '');

    const options = {
        method: 'GET',
        url: `https://api.telegram.org/bot${config.token}/sendMessage`,
        qs:
            { chat_id: config.chatId,
                text:  messages
            },
        headers:
            { 'Postman-Token': '56672c0d-6d15-4362-a109-480c69e37247',
                'cache-control': 'no-cache',
                'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
        formData: { parse_mode: 'Markdown' }
    };

    request(options, function (error, response, body) {
        if (error) reject(error);
        resolve(body);
    });
});

module.exports = { sendTelegramMessage };

