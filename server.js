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
            //console.log(weather);
            if (weather.main == undefined) {
                res.render('index', { weather: null, error: 'Error, please try again' });
            } else {
                console.log(ipp);
                console.log(sniffr);
                let degree = weather.main.temp;
                let city = weather.name;
        
                let weatherText = "The temp of the city you asked " + degree + " in F " + city +" Your IP address is : " + ipp + " Your location is :  " + (geo.city) + ", " +(geo.country) + " \n OS : " + (sniffr.os.name) + "OS version : " + (sniffr.os.version) + "  Browser :  " + (sniffr.browser.name) + "   Browser Version :  " + (sniffr.browser.version) +
                    " Device : " + (sniffr.device.name);

                let temp1 = "The temp of the city you asked " + degree + " in F " + city + " Your IP address is : " + ipp + "\n OS : " + (sniffr.os.name) + "OS version : " + (sniffr.os.version) + "  Browser :  " + (sniffr.browser.name) + "   Browser Version :  " + (sniffr.browser.version) +
                    " Device : " + (sniffr.device.name);
            
                // res.render('index', {weather: weatherText ,temp1: temp1, error: null});
             
                //res.render('index', {weather: sniffer, error: null});

                let url2 = 'https://api.openweathermap.org/data/2.5/weather?q=' + geo.city + '&units=imperial&appid=6dde3692bc68b2c685b0f6ceefa280ff';

                request(url2, function (err, response, body) {
                    if (err) {
                        res.render('index', { weather: null, error: 'Error, please try again' });
                    } else {

                        let weather = JSON.parse(body);
                        //console.log(weather);
                        if (weather.main == undefined) {
                            res.render('index', { weather: null, error: 'Error, please try again' });
                        } else {
                            console.log(ipp);
                            console.log(sniffr);
                            let degree = weather.main.temp;
                            let city = weather.name;

                            let weatherText1 = "The temp of the city you asked " + degree + " in F " + geo.city;

                            res.render('index', {
                                weather: weatherText,
                                temp1: temp1,
                                weatherText1:weatherText1,
                                error: null,
                            });

                            //res.render('index', {weather: sniffer, error: null});

                        }
                    }
                });

            }
        } 
    });
});

app.listen(process.env.PORT || 7000, function () {
    console.log('listening on port !' + process.env.PORT || 7000);
});