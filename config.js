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
    nasport: {
        sports: [
        /*  {
                 id: '24649df6-3225-49ff-b9cb-ba3100d43db6',
                 name: 'basket'
             },
             {
                 id: '52aa1912-2e88-4fdb-bf82-76719f91c53c',
                 name: 'handball',
             },
             {
                 id: '01371b25-75da-4587-a347-ad3bf0e63971',
                 name: 'hockey'
              }, */
            {
                id: 'a1da5593-7bc1-4c70-92da-19e5953a1f9b',
                name: 'football'
            }
        ]
    }
};
