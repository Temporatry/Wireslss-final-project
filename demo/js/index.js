//Variables for working with Location, Temprature and Times
var latitude;
	var lon;
	var tempInF;
	var tempInC;
	var timeFormatted;

	//Quotes depending on the weather
	var weatherQuotes ={
		rain: "\"The best thing one can do when it's raining is to let it rain.\" -Henry Wadsworth Longfellow",
		clearDay: "\"Wherever you go, no matter what the weather, always bring your own sunshine.\" -Anthony J. D'Angelo",
		clearNight: "\"The sky grew darker, painted blue on blue, one stroke at a time, into deeper and deeper shades of night.\" -Haruki Murakami",
		snow: "\"So comes snow after fire, and even dragons have their ending!\" -J. R. R. Tolkien",
		sleet: "\"Then come the wild weather, come sleet or come snow, we will stand by each other, however it blow.\" -Simon Dach",
		wind: "\"Kites rise highest against the wind - not with it.\" -Winston Churchill",
		fog: "\"It is not the clear-sighted who rule the world. Great achievements are accomplished in a blessed, warm fog.\" -Joseph Conrad",
		cloudy: "\"Happiness is like a cloud, if you stare at it long enough, it evaporates.\" -Sarah McLachlan",
		partlyCloudy: "\"Try to be a rainbow in someone's cloud.\" -Maya Angelou",
		default: "\"The storm starts, when the drops start dropping When the drops stop dropping then the storm starts stopping.\"― Dr. Seuss "
	};

	function locateYou() {
		//Try to get location from users browser (device).
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) {
				latitude = position.coords.latitude;
				lon = position.coords.longitude;
				console.log(lat + " " + lon + "geo");
				// yourAddress();
				// getWeather();
			});
		}
	};

	//After collecting the Latiture and Longitute, Getting their formatted address from Google Maps.
	function yourAddress() {
		var googleApiCall = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyC8UY5L0pC6c3PaOZRcVr8u0R5cuxFC8qU&language=zh-TW`;
		$.getJSON(googleApiCall, function (locationName) {
			console.log(locationName.results);
			$(".locName").html(locationName.results[4].formatted_address);
			// console.log(locationName.results[2].formatted_address); (For checking the precision)
		});
	}

	function getWeather() {
		//Looking up the weather from Darkskies using users latitude and longitude.
		//Please don't use this API key. Get your own from DarkSkies.
		var weatherApiKey = "a3219d4e2772db6e34c6491e62144b27";
		var weatherApiCall = "https://api.darksky.net/forecast/" + weatherApiKey + "/" + lat + "," + lon +"?units=si&lang=zh-tw";
		$.ajax({
			url: weatherApiCall,
			type: "GET",
			dataType: "jsonp",
			success: function(weatherData) {
				//Fetching all the infor from the JSON file and plugging it into UI
				$(".currentTemp").html((weatherData.currently.temperature).toFixed(1));
				$(".weatherCondition").html(weatherData.currently.summary);
				$(".feelsLike").html((weatherData.currently.apparentTemperature).toFixed(1) + " °C");
				$(".humidity").html((weatherData.currently.humidity * 100).toFixed(0));
				$(".windSpeed").html((weatherData.currently.windSpeed/0.6213).toFixed(1));
				
				$(".todaySummary").html(weatherData.hourly.summary);
				$(".tempMin").html((weatherData.daily.data[0].temperatureMin).toFixed(1)+" °C");
				$(".tempMax").html((weatherData.daily.data[0].temperatureMax).toFixed(1)+" °C");

				$(".cloudCover").text((weatherData.currently.cloudCover*100).toFixed(1)+" %");
				$(".dewPoint").text(weatherData.currently.dewPoint + " °F");
  			
  			//Converting UNIX time
  			unixToTime(weatherData.daily.data[0].sunriseTime);
  			var sunriseTimeFormatted = timeFormatted+" AM";
  			$(".sunriseTime").text(sunriseTimeFormatted);

  			unixToTime(weatherData.daily.data[0].sunsetTime);
  			var sunsetTimeFormatted = timeFormatted+" PM";
  			$(".sunsetTime").text(sunsetTimeFormatted);

  			//Loading weekly Data in UI
  			$(".weekDaysSummary").text(weatherData.daily.summary);
  			var skycons = new Skycons({"color": "white"});

  			for (i=1; i<7; i++) {
  				$(".weekDayTempMax"+i).text(weatherData.daily.data[i].temperatureMax);
  				$(".weekDayTempMin"+i).text(weatherData.daily.data[i].temperatureMin);
  				$(".weekDaySunrise"+i).text(unixToTime(weatherData.daily.data[i].sunriseTime));
  				$(".weekDaySunset"+i).text(unixToTime(weatherData.daily.data[i].sunsetTime));
  				$(".weekDayName"+i).text(unixToWeekday(weatherData.daily.data[i].time));
  				$(".weekDaySummary"+i).text(weatherData.daily.data[i].summary);
  				$(".weekDayWind"+i).text((weatherData.daily.data[i].windSpeed/0.6213).toFixed(2));
  				$(".weekDayHumid"+i).text((weatherData.daily.data[i].humidity*100).toFixed(0));
  				$(".weekDayCloud"+i).text((weatherData.daily.data[i].cloudCover*100).toFixed(0));
  				skycons.set("weatherIcon"+i, weatherData.daily.data[i].icon);
  			}

  			//Skycon Icons
  			skycons.set("weatherIcon", weatherData.currently.icon);
  			skycons.set("expectIcon", weatherData.hourly.icon);
  			skycons.play();

  			//Coverting data between Celcius and Farenheight
  			tempInF = ((weatherData.currently.temperature*9/5) + 32).toFixed(1);
  			tempInC = (weatherData.currently.temperature).toFixed(1);
  			feelsLikeInC = 	(weatherData.currently.apparentTemperature).toFixed(1);
  			feelsLikeInF = ((weatherData.currently.apparentTemperature*9/5) + 32).toFixed(1);

  			//Load Quotes
  			var selectQuote = weatherData.currently.icon;
  			var loadQuote = $(".quote");
  			switch (weatherData.currently.icon) {
  				case "clear-day":
  					$(".quote").text(weatherQuotes.clearDay);
  					break;
  				case "clear-night":
  					$(".quote").text(weatherQuotes.clearNight);
  					break;
  				case "rain":
  					$(".quote").text(weatherQuotes.rain);
  					break;
  				case "snow":
  					$(".quote").text(weatherQuotes.snow);
  					break;
  				case "sleet":
  					$(".quote").text(weatherQuotes.sleet);
  					break;
  				case "clear-night":
  					$(".quote").text(weatherQuotes.clearNight);
  					break;
  				case "wind":
  					$(".quote").text(weatherQuotes.wind);
  					break;
  				case "fog":
  					$(".quote").text(weatherQuotes.fog);
  					break;
  				case "cloudy":
  					$(".quote").text(weatherQuotes.cloudy);
  					break;
  				case "partlyCloudy":
  					$(".quote").text(weatherQuotes.partlyCloudy);
  					break;
  				default:
  					$(".quote").text(weatherQuotes.default);
  			}
			}
		});
	}

	//Calling the function to locate user and fetch the data
	locateYou();

	//Function for converting UNIX time to Local Time
	function unixToTime(unix) {
		unix *= 1000;
		var toTime = new Date(unix);
		var hour = ((toTime.getHours() % 12 || 12 ) < 10 ? '0' : '') + (toTime.getHours() % 12 || 12);
  	var minute = (toTime.getMinutes() < 10 ? '0' : '') + toTime.getMinutes();
  	timeFormatted = hour+":"+minute;
  	return timeFormatted;
	}

	function unixToWeekday(unix) {
		unix *= 1000;
		var toWeekday = new Date(unix);
		var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		var weekday = days[toWeekday.getDay()];
		return weekday;
	}

	//UI Tweaks
	$(".convertToggle").on("click", function() {
		$(".toggleIcon").toggleClass("ion-toggle-filled");
		var tmpNow = $(".currentTemp");
		var unit = $(".unit");
		var feelsLike = $(".feelsLike");

		if (tmpNow.text() == tempInC) {
			tmpNow.text(tempInF);
			unit.text("°F");
			feelsLike.text(feelsLikeInF + " °F")
		} else {
			tmpNow.text(tempInC);
			unit.text("°C");
			feelsLike.text(feelsLikeInC + " °C")
		}
	});


	//Smooth Scrool to Weekly Forecast section
	$(".goToWeek").on("click", function() {
		$('html, body').animate({
	    scrollTop: $("#weeklyForecast").offset().top
		}, 1000);
	});



function show(){
	//Initiate wow.js
	new WOW().init();
	const weatherSection = document.getElementById('weather-section');
	// const dailyForecast = document.getElementById('dailyForecast');
	const statusSection = document.getElementById('status-section');
	weatherSection.style.display="block";
	// dailyForecast.style.display = "flex";
	statusSection.style.display = "none";
}


/** 以下為硬體裝置端程式 */
let nowDistance; // 目前距離
let beforDistance = 0; // 前一次距離
let restart = true; // 初始化
let dht; // 溫濕度
boardReady({ device: 'nWxRb' }, function (board) {
	board.systemReset();
	board.samplingInterval = 500;
	ultrasonic = getUltrasonic(board, 8, 9); // 超音波腳位8 9
	dht = getDht(board, 13);
	onStartDHT(); // 持續偵測溫濕度
	onStart(); // 開始偵測超音波
});

// 超音波初始化
function onStart() {
	ultrasonic.ping(function (cm) {
		nowDistance = ultrasonic.distance;
		document.getElementById("status").innerHTML = '連接成功';
		if (restart) {
			console.log('超音波初始化中...');
			beforDistance = nowDistance;
			restart = false;
		}
		else {
			let absDistance = Math.abs(nowDistance - beforDistance);
			console.log("目前距離：" + nowDistance + " 前一次距離：" + beforDistance + " 差距：" + absDistance);
			document.getElementById("demo-area-01-show").innerHTML = nowDistance;
			if (absDistance >= 100) {
				document.getElementById("status").innerHTML = '連接成功[機器人觸發]';
				document.getElementById("demo-area-01-show").style.color = '#ff0000';
				restart = true;
				ultrasonic.stopPing(); // 停止超音波偵測
				startRecognize();
			} else {
				document.getElementById("demo-area-01-show").style.color = '#000000';
			}
			beforDistance = nowDistance;
		}
	}, 500);
}

// 溫濕度初始化
function onStartDHT() {
	document.getElementById("demo-area-02-show").style.fontSize = 20 + "px";
	document.getElementById("demo-area-02-show").style.lineHeight = 20 + "px";
	dht.read(function (evt) {
		document.getElementById("demo-area-02-show").innerHTML = (['溫度：', dht.temperature, '度<br/>濕度：', dht.humidity, '%'].join(''));
	}, 1000);
}

// 語音辨識初始化
if (!("webkitSpeechRecognition" in window)) {
	alert("本瀏覽器不支援語音辨識，請更換瀏覽器！(Chrome 25 版以上才支援語音辨識)");
} else {
	window._recognition = new webkitSpeechRecognition();
	window._recognition.continuous = true;
	window._recognition.interimResults = true;
	window._recognition.lang = "cmn-Hant-TW";
	// 開始語音辨識
	window._recognition.onstart = function () {
		window._recognition.status = true;
		console.log("Start recognize...");
	};
	// 結束語音辨識
	window._recognition.onend = function () {
		console.log("Stop recognize");
		if (window._recognition.status) {
			window._recognition.start();
		}
	};
}

function voiceEndCallback() {
	document.getElementById("status").innerHTML = '連接成功[語音辨識]';
	// 開始語音辨識
	window._recognition.onresult = function (event, result) {
		result = {};
		result.resultLength = event.results.length - 1;
		city = event.results[result.resultLength][0].transcript;
		if (event.results[result.resultLength].isFinal === true) {
			console.log(city);
			parseCity(city);
			console.log("final");
		} else if (event.results[result.resultLength].isFinal === false) {
			// 語音辨識持續偵測
		}
	};
	window._recognition.start();
}

// 觸發語音監聽事件
function startRecognize() {
	let zhText = '請問您要';
	var audio = document.getElementById('audio');
	audio.src = "https://temporatry.github.io/Wireslss-final-project/audio/siri_begin.mp3";
	setTimeout(function () {
		console.log('resta')
		voiceEndCallback();
	}, 1000);
}

// 取得目前經緯度和地址
function getLocation() {
	return new Promise(function (resolve, reject) {
		let longitude, latitude; // 經緯度
		// JS 取得經緯度
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (res) {
				longitude = res.coords.longitude
				latitude = res.coords.latitude;
				//console.log(longitude + " " + latitude);
				// Google GeoCode API 經緯度取得地址
				$.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyC8UY5L0pC6c3PaOZRcVr8u0R5cuxFC8qU`, function (data) {
					//console.log(JSON.stringify(data, null, 2));
					//return JSON.stringify(data, null, 2);
					resolve(JSON.stringify(data, null, 2));
				});
			}, function (error) {
				console.log(error);
			});
		} else {
			console.log("Geolocation is not supported by this browser.");
		}
	})
}



// 取得縣市經緯度
function parseCity(city) {
	if (city.indexOf('台北') !== -1) {
		getCityWeatherData(121.5598, 25.09108);
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('新北') !== -1) {
		getCityWeatherData(121.6739, 24.91571);
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('宜蘭') !== -1) {
		getCityWeatherData(121.7195, 24.69295);
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('花蓮') !== -1) {
		getCityWeatherData(121.3542, 23.7569);
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('金門') !== -1) {
		getCityWeatherData(118.3186, 24.43679);
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('南投') !== -1) {
		getCityWeatherData(120.9876, 23.83876);
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('屏東') !== -1) {
		getCityWeatherData(120.62, 22.54951);
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('苗栗') !== -1) {
		getCityWeatherData(120.9417, 24.48927);
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('桃園') !== -1) {
		getCityWeatherData(121.2168, 24.93759);
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('高雄') !== -1) {
		getCityWeatherData(120.666, 23.01087);
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('基隆') !== -1) {
		getCityWeatherData(121.7081, 25.10898);
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('連江') !== -1) {
		getCityWeatherData(119.5397, 26.19737);
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('雲林') !== -1) {
		getCityWeatherData(120.3897, 23.75585);
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('嘉義') !== -1) {
		getCityWeatherData(120.574, 23.45889);
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('新竹') !== -1) {
		getCityWeatherData(121.1252, 24.70328);
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('彰化') !== -1) {
		getCityWeatherData(120.4818, 23.99297);
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('臺中') !== -1) {
		getCityWeatherData(120.9417, 24.23321);
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('台東') !== -1) {
		getCityWeatherData(120.9876, 22.98461);
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('台南') !== -1) {
		getCityWeatherData(120.2513, 23.1417);
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('澎湖') !== -1) {
		getCityWeatherData(119.6151, 23.56548);
		window._recognition.status = false;
		window._recognition.stop();
	} else if (city.indexOf('目前') !== -1) {
		getNowGEOWeatherData();
		window._recognition.status = false;
		window._recognition.stop();
	}
}

// 縣市名稱取得天氣資料
function getCityWeatherData(longitude, latitude) {
	console.log(longitude + " " + latitude);
	async.waterfall([
		function (callback) {
			// const zhText = '搜尋中請稍候';
			// const audio = document.getElementById('audio');
			// console.log(audio);
			// audio.src = `https://translate.google.com/translate_tts?ie=UTF-8&total=${zhText.length}&idx=0&textlen=32&client=tw-ob&q=${zhText}&tl=zh-TW`;
			speakTTS('搜尋中請稍候');
			callback(null);
		},
		function (callback) {
			// 直接縣市經緯度搜尋天氣
			callback(null, 'done city weather');
		}
	], function (err, result) {
		// result now equals 'done'
		console.log(result);
		setTimeout(() => {
			speakTTS('目前天氣晴最高溫三十度');
		}, 4000);
		onStart();
	});

}

function speakTTS(text) {
	console.log('TTS');
	var resAudio = document.createElement('audio');
	resAudio.id = 'resAudio';
	resAudio.src = `http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&per=1&text=${text}`;
	resAudio.autoplay = 'true';
	document.body.appendChild(resAudio);
}
// 目前位置的天氣資料
function getNowGEOWeatherData() {
	console.log('getNowGEOWeatherData');
	async.waterfall([
		function (callback) {
			speakTTS('搜尋中請稍候');
			callback(null);
		},
		function (callback) {
			// arg1 now equals 'one' and arg2 now equals 'two'
			getLocation().then((data) => {
				// Google API取得目前地址
				callback(null, data);
			});

		},
		function (arg1, callback) {
			// arg1 now equals 'three'
			console.log(arg1);
			callback(null, 'done now location weather');
		}
	], function (err, result) {
		// result now equals 'done'
		console.log(result);
		speakTTS('目前台南市天氣晴最高溫36度最低溫18度');
		getWeather();
		onStart();
	});

}

