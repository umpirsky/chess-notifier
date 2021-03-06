var count = 0;

function update() {
    browser.storage.local.get({
            username: '',
            showNotifications: false,
            checkingInterval: 60
        })
        .then((options) => {
            setTimeout(update, 1000 * Math.max(10, options.checkingInterval));

            if (!options.username) {
                return;
            }

            fetch('https://api.chess.com/int/player/' + options.username + '/notices', {
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
                    browser.browserAction.setTitle({
                        title: ''
                    });
                    browser.browserAction.enable();

                    let newCount = notifications.games_to_move + notifications.challenge_waiting;

                    browser.browserAction.setBadgeText({
                       text: newCount > 0 ? newCount.toString() : ''
                    });

                    if (count >= newCount) {
                        return;
                    }

                    count = newCount;

                    if (count <= 0) {
                        return;
                    }

                    if (options.showNotifications) {
                        browser.notifications.create({
                            type: 'basic',
                            iconUrl: browser.extension.getURL('icons/128/pawn_color.png'),
                            title: 'Your Turn!',
                            message: 1 === count ? "It's your turn to move." : "It's your turn to move, " + count + ' games are waiting.'
                        });
                    }
                })
                .catch((error) => {
                    browser.browserAction.setTitle({
                        title: error.message
                    });
                    browser.browserAction.disable();
                });
        });
}

update();

browser.browserAction.onClicked.addListener((e) => {
    browser.storage.local.get({
            username: ''
        })
        .then((options) => {
            if (!options.username) {
                browser.runtime.openOptionsPage();

                return;
            }

        browser.tabs.create({
            'url': 'https://www.chess.com/goto_ready_game',
            'active': true
        });
    });
});
