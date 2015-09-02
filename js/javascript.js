function getWeatherData(lang, fnOK, fnError) {
    navigator.geolocation.getCurrentPosition(locSuccess, locError);

    function locSuccess(position) {
        var cache = localStorage.weatherCache && JSON.parse(localStorage.weatherCache);
        var currDate = new Date();
        if(cache && cache.timestamp && cache.timestamp > currDate.getTime() - 30*60*1000){
            fnOK.call(this, cache.data);
        } else {
            $.getJSON(
                'api.openweathermap.org/data/2.5/weather?lat=' + position.coords.latitude + '&lon=' +
                position.coords.longitude + '&cnt=16&units=metric' + '&lang=' + lang + '&callback=?',
                function (response) {
        
                    localStorage.weatherCache = JSON.stringify({
                        timestamp: (new Date()).getTime(),	// getTime() returns milliseconds
                        data: response
                    });
                    
                    locSuccess(position);
                }
            );
        }
    }

    function locError(error) {
        var message = 'Location error. ';
        switch(error.code) {
            case error.TIMEOUT:
                message += 'A timeout occured! Please try again!';
                break;
            case error.POSITION_UNAVAILABLE:
                message += 'We can\'t detect your location. Sorry!';
                break;
            case error.PERMISSION_DENIED:
                message += 'Please allow geolocation access for this to work.';
                break;
            case error.UNKNOWN_ERROR:
                message += 'An unknown error occured!';
                break;
        }
        fnError.call(this, message);
    }
}

