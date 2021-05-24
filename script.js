'use strict';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form_input--type');
const inputDistance = document.querySelector('.form_input--distance');
const inputDuration = document.querySelector('.form_input--duration');
const inputCadence = document.querySelector('.form_input--cadence');
const inputElevation = document.querySelector('.form_input--elevation');



class App {
  #map;
  #mapEvent;
  constructor(){
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this));
    
    inputType.addEventListener('change', this._toggleElevationField)
  }
  _getPosition(){
    if(navigator.geolocation)
navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function(){
  alert('Could not get your position...');
});
  }

  _loadMap(position){
    
      const {latitude} = position.coords;
      const {longitude} = position.coords;
      console.log(`https://www.google.co.uk/maps/@${latitude},${longitude}`)
    
      const coords = [latitude, longitude];
    
      this.#map = L.map('map').setView(coords, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot//{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.#map);
    
      //handling clicks on map
        this.#map.on('click', this._showForm.bind(this))
     
  }

  _showForm(mapE){
    this.#mapEvent = mapE;
          form.classList.remove('hidden');
          inputDistance.focus();
  }

  _toggleElevationField(){
    inputElevation.closest('.form_row').classList.toggle('form_row--hidden')
      inputCadence.closest('.form_row').classList.toggle('form_row--hidden')
  }

  _newWorkout(e){
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
    // Display marker
      console.log(this.#mapEvent)
        const {lat, lng} = this.#mapEvent.latlng;
        L.marker([lat,lng]).addTo(this.#map)
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
  }
}

const app = new App();




