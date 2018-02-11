var count = 0;

function update() {
    browser.storage.local.get({
            username: ''
        })
        .then((options) => {
            if (!options.username) {
                return;
            }

            fetch(`https://api.chess.com/int/player/${options.username}/notices`, {
                    cache: 'reload'
                })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }

                    response.json().then((error) => {
                        browser.browserAction.setTitle({
                            title: error.message
                        });
                    });

                    throw new Error(response.statusText);
                })
                .then((notifications) => {
                    browser.browserAction.enable();

                    console.log(notifications.games_to_move + notifications.challenge_waiting);
                })
                .catch((error) => {
                    browser.browserAction.setTitle({
                        title: error.message
                    });
                    browser.browserAction.disable();
                });
        });
}

setInterval(update, 1000 * 10);

browser.browserAction.onClicked.addListener((e) => {
    browser.tabs.create({
        'url': 'https://www.chess.com/daily/games/current',
        'active': true
    });
});
