const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');

//Geo IP 
const geoip = require('geoip-lite');
const Sniffr = require("sniffr");


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.render('index');
});


app.post('/', function (req, res) {
    //console.log('BODY', req);

    let city = req.body.city;
    
    let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=6dde3692bc68b2c685b0f6ceefa280ff';

    var ipp = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    
    var geo = geoip.lookup(ipp);
    var sniffr = new Sniffr();
    //console.log(geo);
    //sniffr.sniff(req.headers['user-agent']);
    //console.log(req.headers['user-agent']);
    console.log(req.headers);
    
    request(url, function (err, response, body) {
        
        if (err) {
            res.render('index', { weather: null, error: 'Error, please try again' });
        } else {
            let weather = JSON.parse(body);
            if (weather.main == undefined) {
                res.render('index', { weather: null, error: 'Error, please Enter correct city name' });
            } else {
                
                let degree = weather.main.temp;
                let city = weather.name;
        
                let weatherText = "The temperature of " + city+ "  is  " + degree + " F ";

                let temp1 = " ****Your IP address is : " + ipp + "    OS : " + (sniffr.os.name) + "    OS version : " + (sniffr.os.versionString) + "    Browser :  " + (sniffr.browser.name) + "  Browser Version :  " + (sniffr.browser.versionString)  +
                    "   Device : " + (sniffr.device.name) + "******";
                //console.log(weather);
                let url2 = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=6dde3692bc68b2c685b0f6ceefa280ff';

                request(url2, function (err, response, body) {
                    if (err) {
                        res.render('index', { weather: null, error: 'Error, please try again' });
                    } else {

                        let weather = JSON.parse(body);
                        //console.log(weather);
                        if (weather.main == undefined) {
                            res.render('index', { weather: null, error: 'Error, please try again' });
                        } else {
                            // console.log(req.ip);
                            // console.log(ipp);
                            // console.log(sniffr);
                            // console.log(geo.city);
                            
                            let degree = weather.main.temp;
                            let city = weather.name;

                            let weatherText1 = "***** BUTt, Your current location is :  "+ geo + " and your weather is " +degree + " F *****";

                            res.render('index', {weather: weatherText,temp1: temp1,weather1: weatherText1,
                                error: null,
                            });

                    

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