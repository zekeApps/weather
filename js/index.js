(function(){
	var API_WT_KEY = "5f7ccfc002211a02b4a56a5c0ebaa";
	var API_WT_URL = "https://api.worldweatheronline.com/free/v2/tz.ashx?format=json&key=" + API_WT_KEY + "&q=" ;
	var API_WEATHER_KEY = "a919111ea1ec4dfaec135157a6c90a2e";
	var API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?APPID=" + API_WEATHER_KEY + "&";
	var API_IMG_WEATHER = "http://openweathermap.org/img/w/"
	
	var $body = $("body");
	var $loader = $(".loader");
	var cityAdd = $("[data-input='cityAdd']");
	var buttonAdd = $("[data-button='add']");

  	var today = new Date();
	var timeNow = today.toLocaleTimeString();

	var cityWeather = {};    
	cityWeather.zone;
	cityWeather.icon;
	cityWeather.temp;
	cityWeather.temp_max;
	cityWeather.temp_min;
	cityWeather.main;

	$( buttonAdd ).on("click", addNewCity);
	$ ( cityAdd ).on("keypress"), function(event){
		if(event.which==13){
			addNewCity();
		}
	}


	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(getCoords, errorFound);
	} else {
		alert('You must to update your browser')
	}

function errorFound(error) {
	alert("An error occured: " + error.code);
	//0: Unknown Error
	//1: Access Denied
	//2: Location not avaiable
	//3: Timeout
}

function getCoords(position){
	var lat = position.coords.latitude;
	var lon = position.coords.longitude;

	console.log("Current location: "+ lat + ","+lon);
	$.getJSON(API_WEATHER_URL + "lat=" + lat + "&lon=" + lon, getCurrentWeather);

};

function getCurrentWeather(data) {
	cityWeather.zone = data.name;
	cityWeather.icon = API_IMG_WEATHER + data.weather[0].icon + ".png";
	cityWeather.temp = data.main.temp - 273.15;
	cityWeather.temp_max = data.main.temp_max - 273.15;
	cityWeather.temp_min = data.main.temp_min - 273.15;
	cityWeather.main = data.weather[0].main;

	renderTemplate(cityWeather);
};

function activateTemplate(id) {
	var t = document.querySelector(id);
	return document.importNode(t.content, true);
};

function renderTemplate(cityWeather, localtime){
	var clone = activateTemplate("#template--city");

	var timeToDisplay;

	if (localtime) {
		timeToDisplay = localtime;
	} else {
		timeToDisplay = timeNow;
	}

	clone.querySelector("[data-time]").innerHTML = timeToDisplay;
	clone.querySelector("[data-city]").innerHTML = cityWeather.zone;
	clone.querySelector("[data-icon]").src = cityWeather.icon;
	clone.querySelector("[data-temp='max']").innerHTML = cityWeather.temp_max.toFixed(1);
	clone.querySelector("[data-temp='min']").innerHTML = cityWeather.temp_min.toFixed(1);
	clone.querySelector("[data-temp='current']").innerHTML = cityWeather.temp.toFixed(1);

	$( $loader ).hide();
	$( $body ).append(clone);
}

function addNewCity(event){
	event.preventDefault();
	$.getJSON(API_WEATHER_URL + "q="+ $( cityAdd ).val(), getWeatherNewCity);
	

}

function getWeatherNewCity(data) {

	$.getJSON(API_WT_URL + $(cityAdd).val(), function (response){
		
	cityWeather = {}
	cityWeather.zone = data.name;
	cityWeather.icon = API_IMG_WEATHER + data.weather[0].icon + ".png";
	cityWeather.temp = data.main.temp - 273.15;
	cityWeather.temp_max = data.main.temp_max - 273.15;
	cityWeather.temp_min = data.main.temp_min - 273.15;
	cityWeather.main = data.weather[0].main;
	

	renderTemplate(cityWeather, response.data.time_zone[0].localtime.split(" ")[1]);

	});


};

})();