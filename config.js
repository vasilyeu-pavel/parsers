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
            {
                id: 'a1da5593-7bc1-4c70-92da-19e5953a1f9b',
                name: 'football',
                leagues: {
                    'gdSF56f4V4RqrRcnWVamWO': 'Norsk Tipping-ligaen avd 3',
                    'y1Pdmwf4lPmtSnPaz3gydz': 'Norsk Tipping-ligaen avd 1',
                    '5f9f79c1-f8ac-4f34-a4e1-72b3f942fb51': 'Norsk Tipping-ligaen avd 6',
                    '713a9375-e41a-4ff8-abe8-78392c604858': 'PostNord-ligaen avd 1',
                    'RvmHrK7OP37V4RvsqbATmk': 'Norsk Tipping-ligaen avd 2',
                    'RvmHrK7OP37V4RvsqbAPhq': 'Norsk Tipping-ligaen avd 5',
                    'gdSF56f4V4RqrRcnWVaoUP': 'Norsk Tipping-ligaen avd 4',
                    'HXxyrXcCJqTr9Q2ghyCaf7': 'PostNord-ligaen avd 2',
                },
            },
        ]
    }
};
