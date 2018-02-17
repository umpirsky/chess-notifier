var count = 0;

function update() {
    browser.storage.local.get({
            username: ''
        })
        .then((options) => {
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

                    browser.notifications.create({
                        type: 'basic',
                        iconUrl: browser.extension.getURL('icons/notification.png'),
                        title: 'Your Turn!',
                        message: 1 === count ? "It's your turn to move." : "It's your turn to move, " + count + ' games are waiting.'
                    });
                })
                .catch((error) => {
                    browser.browserAction.setTitle({
                        title: error.message
                    });
                    browser.browserAction.disable();
                });
        });
}

setInterval(update, 1000 * 60);

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
            'url': 'https://www.chess.com/daily/games/current',
            'active': true
        });
    });
});
