const TelegramBot = require('node-telegram-bot-api');
const config = require('../../config');

const bot = new TelegramBot(config['telegram'].token, { polling: true });

const createMessage = ({ league, matches }) =>
    `Скачались матчи *(${league})*:
    ${matches.map(match => `\n ${match}`)}`;

const sendTelegramMessage = message => {
    bot.sendMessage(config['telegram'].chatId, createMessage(message).replace(/,/g,''), { parse_mode: "Markdown" });
};

module.exports = { sendTelegramMessage };
