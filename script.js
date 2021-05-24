'use strict';




class Workout{
  date = new Date();
  id = (new String(Date.now()).slice(-10));
  clicks = 0;

  constructor(coords, distance, duration){
    this.coords = coords; // [lat, long]
    this.distance = distance; //in km
    this.duration = duration; //in min
  }

  _setDescription(){
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
  }

  click(){
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence){
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
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
    this._setDescription();
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
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];
  constructor(){
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
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
    
      this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
    
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

  _hideForm(){
    // Empty inputs
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

    form.getElementsByClassName.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 500)
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
  
    // Render workout as marker on map
    this._renderWorkoutMarker(workout);
  
    // Render workout on list
    this._renderWorkout(workout);
    
    // Hide the form & Clear Input fields
    this._hideForm();
  }

  _renderWorkoutMarker(workout){
    L.marker(workout.coords).addTo(this.#map)
    .bindPopup(L.popup({
      maxWidth: 250,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
      className: `${workout.type}-popup`,
    }))
    .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`)
    .openPopup();
  }

  _renderWorkout(workout){
    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
      <h2 class="workout_title">${workout.description}</h2>
      <div class="workout_details">
        <span class="workout_icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
        <span class="workout_value">${workout.distance}</span>
        <span class="workout_unit">km</span>
      </div>
      <div class="workout_details">
        <span class="workout_icon">⏱</span>
        <span class="workout_value">${workout.duration}</span>
        <span class="workout_unit">min</span>
      </div>
    `

    if(workout.type === 'running')
      html += `
      <div class="workout_details">
        <span class="workout_icon">⚡️</span>
        <span class="workout_value">${workout.pace.toFixed(1)}</span>
        <span class="workout_unit">min/km</span>
      </div>
      <div class="workout_details">
        <span class="workout_icon">🦶🏼</span>
        <span class="workout_value">${workout.cadence}</span>
        <span class="workout_unit">spm</span>
      </div>
      </li>
      `

      if(workout.type === 'cycling')
      html+= `
      <div class="workout_details">
        <span class="workout_icon">⚡️</span>
        <span class="workout_value">${workout.speed}</span>
        <span class="workout_unit">kn/hr</span>
      </div>
      <div class="workout_details">
        <span class="workout_icon">⛰</span>
        <span class="workout_value">${workout.elevationGain}</span>
        <span class="workout_unit">m</span>
      </div>
      </li>
      `

      form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopup(e){
    const workoutEL = e.target.closest('.workout');
    if(!workoutEL) return
    console.log(workoutEL)


    const workout = this.#workouts.find(work => work.id === workoutEL.dataset.id);
    console.log(workout)

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      }
    });

    // using the public interface
    workout.click();
  }
}

const app = new App();




