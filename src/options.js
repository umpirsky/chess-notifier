document.addEventListener('DOMContentLoaded', () => {
    browser.storage.local
        .get({
            username: ''
        })
        .then((options) => {
            document.querySelector('#username').value = options.username;
        });
});
document.querySelector('form')
    .addEventListener('submit', (e) => {
        e.preventDefault();

        browser.storage.local.set({
            username: e.target['username'].value
        });

        document.getElementById('status').style.display = 'block';
        setTimeout(function() {
          document.getElementById('status').style.display = 'none';
        }, 4000);
    });
