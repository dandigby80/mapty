'use strict';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form_input--type');
const inputDistance = document.querySelector('.form_input--distance');
const inputDuration = document.querySelector('.form_input--duration');
const inputCadence = document.querySelector('.form_input--cadence');
const inputElevation = document.querySelector('.form_input--elevation');

let map, mapEvent;

if(navigator.geolocation)
navigator.geolocation.getCurrentPosition(function(position){
  const {latitude} = position.coords;
  const {longitude} = position.coords;
  console.log(`https://www.google.co.uk/maps/@${latitude},${longitude}`)

  const coords = [latitude, longitude];

  map = L.map('map').setView(coords, 13);

L.tileLayer('https://{s}.tile.openstreetmap.fr/hot//{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

  //handling clicks on map
    map.on('click', function(mapE){
      mapEvent = mapE;
      form.classList.remove('hidden');
      inputDistance.focus();
      
      // console.log(mapEvent)
    //   const {lat, lng} = mapEvent.latlng;
    //   L.marker([lat,lng]).addTo(map)
    // .bindPopup(L.popup({
    //   maxWidth: 250,
    //   minWidth: 100,
    //   autoClose: false,
    //   closeOnClick: false,
    //   className: 'running-popup',
    // }))
    // .setPopupContent('Workout')
    // .openPopup();
    })
}, 
function(){
  alert('Could not get your position...');
});

form.addEventListener('submit', function(e){
  inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
  // Display marker
    console.log(mapEvent)
      const {lat, lng} = mapEvent.latlng;
      L.marker([lat,lng]).addTo(map)
    .bindPopup(L.popup({
      maxWidth: 250,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
      className: 'running-popup',
    }))
    .setPopupContent('Workout')
    .openPopup();
    e.preventDefault();
})

inputType.addEventListener('change', function(){
  inputElevation.closest('.form_row').classList.toggle('form_row--hidden')
  inputCadence.closest('.form_row').classList.toggle('form_row--hidden')
})

