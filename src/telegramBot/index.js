const TelegramBot = require('node-telegram-bot-api');
const config = require('../../config');

const bot = new TelegramBot(config['telegram'].token, { polling: true });

const createMessage = ({ ligue, matches }) =>
    `Скачалились матчи <b>${ligue}</b> лиги:
    ${matches.map((match, i) => `<strong>${++i}</strong>) ${match}`)}`;

const sendTelegramMessage = message => {
    bot.sendMessage(config['telegram'].chatId, createMessage(message), {parse_mode: "HTML"});
};

module.exports = { sendTelegramMessage };
