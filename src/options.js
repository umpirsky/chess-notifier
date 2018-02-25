document.addEventListener('DOMContentLoaded', () => {
    browser.storage.local
        .get({
            username: '',
            showNotifications: true,
            checkingInterval: 60,
        })
        .then((options) => {
            document.querySelector('#username').value = options.username;
            document.querySelector('#checking_interval').value = options.checkingInterval;
            document.querySelector('#show_notifications').checked = options.showNotifications;
        });
});
document.querySelector('form')
    .addEventListener('submit', (e) => {
        e.preventDefault();

        browser.storage.local.set({
            username: e.target['username'].value,
            checkingInterval: e.target['checking_interval'].value,
            showNotifications: e.target['show_notifications'].checked
        });

        document.getElementById('status').style.display = 'block';
        setTimeout(function() {
          document.getElementById('status').style.display = 'none';
        }, 4000);
    });
