'use strict';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


class Workout{
  date = new Date();
  id = (new String(Date.now()).slice(-10));
  constructor(coords, distance, duration){
    this.coords = coords; // [lat, long]
    this.distance = distance; //in km
    this.duration = duration; //in min
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence){
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace(){
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling'
  constructor(coords, distance, duration, elevationGain){
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }
  calcSpeed(){
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form_input--type');
const inputDistance = document.querySelector('.form_input--distance');
const inputDuration = document.querySelector('.form_input--duration');
const inputCadence = document.querySelector('.form_input--cadence');
const inputElevation = document.querySelector('.form_input--elevation');


///////////////////////////////
// Application Architecture
class App {
  #map;
  #mapEvent;
  #workouts = [];
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
    e.preventDefault();
    // Helper functions
    const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const {lat, lng} = this.#mapEvent.latlng;
    let workout;

    // If workout is running, create running object
    if(type === 'running'){
      const cadence = +inputCadence.value;

      // Check if data is valid
      if(
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
        )
      return alert('Input must be a positive number')

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout is cycling, create cycling object
    if(type === 'cycling'){
      const elevation = +inputElevation.value;

      // Check if the data is valid
      if(
        !validInputs(distance, duration, elevation) || 
        !allPositive(distance, duration)
        )
        return alert('Input must be a positive number');

        workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new object to workout array
    this.#workouts.push(workout);
    console.log(workout)

    // Render workout as marker on map
    this.renderWorkoutMarker(workout);
  
    // Render workout on list

    
    // Hide the form & Clear Input fields
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
  }

  renderWorkoutMarker(workout){
    L.marker(workout.coords).addTo(this.#map)
    .bindPopup(L.popup({
      maxWidth: 250,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
      className: `${workout.type}-popup`,
    }))
    .setPopupContent('workout')
    .openPopup();
  }
}

const app = new App();




