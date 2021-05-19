'use strict';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form_input--type');
const inputDistance = document.querySelector('.form_input--distance');
const inputDuration = document.querySelector('.form_input--duration');
const inputCadence = document.querySelector('.form_input--cadence');
const inputElevation = document.querySelector('.form_input--elevation');

navigator.geolocation.getCurrentPosition(function(position){
  const {latitude} = position.coords;
  const {longitude} = position.coords;
  console.log(`https://www.google.co.uk/maps/@${latitude},${longitude}`)
}, function(){
  alert('Could not get your position...');
});