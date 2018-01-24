var express = require('express'),
path = require('path');

var app = express(),
router = express.Router();

app.use(express.static(path.join(__dirname, 'public')));
router
    .get('/', function (req, res) {
        var options = {
            root: __dirname + '/public/',
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };
        var fileName = 'main.html';
        res.sendFile(fileName, options, function (err) {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            } else {
                console.log('Sent:', fileName);
            }
        });
    });
app.use(router)
    .listen(9000);
