const options = require('./options.js');
const login = require('./login.js');
const signup = require('./signup.js');
const scores = require('./scores.js');

const routes = [
    {
        path: '/options',
        method: 'GET',
        handler: options.getKeyCodes
    },
    {
        path: '/options',
        method: 'POST',
        handler: options.updateKeyCode
    },
    {
        path: '/login',
        method: 'POST',
        handler: login.login
    },
    {
        path: '/signup',
        method: 'POST',
        handler: signup.signup
    },
    {
        path: '/scores',
        method: 'GET',
        handler: scores.firstN
    }
];

module.exports = {
    routes
}