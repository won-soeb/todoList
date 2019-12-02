const weather = document.querySelector('.js-weather');

const COORDS = 'coords';
const APP_KEY = '241051bf13976dd3ddf8b8d9f247255e'

function getWeather(lat, lng) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${APP_KEY}&units=metric`)
  //API문서를 불러온다. url주소를 사용할때 사용한다.
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      const temperature = json.main.temp,
        place = json.name;
        weather.innerText = `${temperature} @ ${place}`;
    })
}

function saveCoords(coordsObj) {
  localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}

function handleGeoSucess(position) {
  const latitude = position.coords.latitude,
    longitude = position.coords.longitude;
  const coordsObj = {
    latitude, //객체의 프로퍼티와 값이 같을 경우 하나만 적어도 된다.
    longitude
  };
  saveCoords(coordsObj);
  getWeather(latitude, longitude);
}

function handleGeoError() {
  console.log('Can not access geo location');
}

function askForCoords() {
  navigator.geolocation.getCurrentPosition(handleGeoSucess, handleGeoError);
}

function loadCoords() {
  const loadCoords = localStorage.getItem(COORDS);
  if (loadCoords === null) {
    askForCoords();
  } else {
    const parseCoords = JSON.parse(loadedCoords);
    getWeather(parseCoords.latitude, parseCoords.longitude);
  }
}

function init() {
  loadCoords();
}

init();
