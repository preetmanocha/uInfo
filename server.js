const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const geoip = require('geoip-lite');
const Sniffr = require("sniffr");


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.render('index');
});


app.post('/', function (req, res) {
    let city = req.body.city;
    let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=6dde3692bc68b2c685b0f6ceefa280ff';
    var ipp = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    var geo = geoip.lookup(ipp);
    var sniffr = new Sniffr();

    sniffr.sniff(req.headers['user-agent']);
    console.log(req.headers['user-agent']);

    request(url, function (err, response, body) {
        if (err) {
            res.render('index', { weather: null, error: 'Error, please try again' });
        } else {
            let weather = JSON.parse(body);
            console.log(weather);
            if (weather.main == undefined) {
                res.render('index', { weather: null, error: 'Error, please try again' });
            } else {
                console.log(weather.main.temp);
                let degree = weather.main.temp;
                let city = weather.name;
                let weatherText = "The temp is " + degree + " in " + city ;
                let sniffer = " \n Your IP address is : " + ipp + " \n Your location is :  " + (geo.city) + "\n your Operating  system is : " + (sniffr.os.name) + "\n Your OS version is : " + (sniffr.os.version) + "\n Browser :  " + (sniffr.browser.name) + "\n Device : " + (sniffr.device);
                res.render('index', {weather: weatherText,error: null});
                res.render('index', {sniffr: sniffer, error: nulls });

            }
        } 
    });
});

app.listen(process.env.PORT || 7000, function () {
    console.log('listening on port !' + process.env.PORT || 7000);
});