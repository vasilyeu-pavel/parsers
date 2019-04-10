module.exports = {
    ettan: {
        url: 'https://commercial.staylive.se',
        login: 'carlstadunitedbk@ettanplay.se',
        password: 'rIPT6u',
        loginSelector: '#input_1',
        passwordSelector: '#input_2',
        submitButton: 'body > div > div > form > md-content > button.md-primary.md-raised.md-button.md-ink-ripple',
        matchesUrl: 'https://api.staylive.se/commercial/getvideos/'
    },
    telegram: {
      token: '649626996:AAHuIMPw2xLUEgAoQgO6nM-v9rcwlQTVlEI',
      chatId: 405898308,
    },
    mediabank: {
        url: 'https://www.mediabank.me/login.php',
        login: 'igor@vif.no',
        password: 'Korva123',
        loginSelector: '#username',
        passwordSelector: '#password',
        submitButton: '#main > form > button',
    },
};
