import { PermissionsAndroid, Platform, AppState, Vibration } from "react-native";
import { map, filter } from "rxjs/operators";
import * as Sensors from "./sensors";
import ShakingCodes from "./codes";
import Geolocation from "./geolocation";

const URL = "https://api.diholapplication.com/shaking/connect";
const HEADERS = {
  'accept': 'application/json',
  'content-type': 'application/json'
};

const GRAVITY = 9.80665;

export default ShakingAPI = {

  /*
  * Client API key.
  */
  API_KEY: "Get one at www.diholapp.com",

  /*
  * User unique identifier in the context of the app.
  */
  user: "",

  /*
  * Latitude and longitude coordinates.
  * Note: lat = lng = 0 is an invalid location.
  */
  lat: 0,
  lng: 0,
  
  /*
  * Sensibility for the shaking event.
  */
  sensibility: Platform.select({
    android: 40,
    ios: 40 / GRAVITY
  }),

  /*
  * Maximum time (in ms) between shaking events 
  * to be elegible for pairing.
  */
  timingFilter: 2000,

  /*
  * Maximum distance (in meters) 
  * to be elegible for pairing.
  */
  distanceFilter: 100,

  /*
  * Keep searching even if a user has been found.
  * Allows to connect with multiple devices.
  */
  keepSearching: false,

  /*
  * True if the location is provided programatically,
  * otherwise the device location will be used.
  */
  manualLocation: false,

  /*
  * Accelerometer subscription.
  */
  subscription: null,

  /*
  * API status.
  */
  stopped: true,
  paused: false,
  processing: false,
  

  /*
  * Vibrate on shaking.
  */
  vibrate: true,
  

  start: function(){

    if(this.stopped){

      this.stopped = false;
      this.paused = false;
      
      this._requestLocation();
      this._subscribe();

      AppState.addEventListener('change', this._handleAppStateChange);
    }
  },

  stop: function(){

    if(!this.stopped){

      this.stopped = true;
      this.paused = false;
      this.processing = false;

      this.subscription && this.subscription.unsubscribe();

      AppState.removeEventListener('change', this._handleAppStateChange);
    }
  },

  _restart: function(){

    if(!this.stopped && !this.processing && this.paused){
      this.paused = false;
      this._requestLocation();
      this._subscribe();
    }
  },

  _pause: function(){
    if(!this.paused){
      this.paused = true;
      this.subscription && this.subscription.unsubscribe();
    }
  },

  simulate: function(){
    this._connect();
  },

  configure: function(params){
    const { 
      API_KEY, 
      user,
      lat,
      lng,
      sensibility, 
      timingFilter, 
      distanceFilter, 
      keepSearching,
      vibrate,
      onShaking,
      onSuccess,
      onError
    } = params;

    this.API_KEY = API_KEY;
    this.user = user;

    if (sensibility !== undefined) this.setSensibility(sensibility);
    if (timingFilter !== undefined) this.setTimingFilter(timingFilter);
    if (distanceFilter !== undefined) this.setDistanceFilter(distanceFilter);
    if (keepSearching !== undefined) this.setKeepSearching(keepSearching);
    if (vibrate !== undefined) this.vibrate = vibrate;

    if(lat !== undefined && lng !== undefined){
      this.setLocation(lat, lng);
    }

    this.onShaking = onShaking;
    this.onSuccess = onSuccess;
    this.onError = onError;
    
    this._handleAppStateChange = this._handleAppStateChange.bind(this);

    return this;
  },

  setLocation: function(lat, lng){
    this.lat = lat;
    this.lng = lng;
    this.manualLocation = true;
  },

  setUser: function(user){
    this.user = user;
  },

  setSensibility: function(sensibility){
    if(Platform.OS === 'ios') sensibility /= GRAVITY;
    this.sensibility = sensibility;
  },

  setTimingFilter: function(timingFilter){
    this.timingFilter = timingFilter;
  },

  setDistanceFilter: function(distanceFilter){
    this.distanceFilter = distanceFilter;
  },

  setKeepSearching: function(keepSearching){
    this.keepSearching = keepSearching;
  },

  _subscribe: function(){
    this.subscription = Sensors.createAccelerometer()
    .pipe(map(({ x, y, z }) => Math.abs(x) + Math.abs(y) + Math.abs(z)), filter(speed => speed > this.sensibility))
    .subscribe(
      speed => this._onShakingEvent(),
      error => this.onError(ShakingCodes.SENSOR_ERROR)
    )
  },

  _onShakingEvent: function(){
    this._pause();
    this.vibrate && Vibration.vibrate();
    this.onShaking && this.onShaking();
    this._requestLocation();
    this._connect();
  },

  _connect: function(){
    
    this.processing = true;

    let requestConfig = {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        api_key: this.API_KEY,
        id: this.user,
        lat: this.lat,
        lng: this.lng,
        sensibility: this.sensibility,
        distanceFilter: this.distanceFilter,
        timingFilter: this.timingFilter,
        keepSearching: this.keepSearching
      })
    }

    fetch(URL, requestConfig)
      .then(response => response.json())
      .then(result => this._handleServerResponse(result))
      .catch(err => {

        this.processing = false;
        this.onError(ShakingCodes.SERVER_ERROR);
        setTimeout(() => {
          this._restart()
        }, 2000);

        console.log(err)
      })
  },

  _handleServerResponse: function(resp){
    const { status, response } = resp;

    if(status.code == 200){
      this.onSuccess(response);
    }
    else if (status.code == 401){
      this.onError(ShakingCodes.AUTHENTICATION_ERROR);
    }
    else if (status.code == 403){
      this.onError(ShakingCodes.API_KEY_EXPIRED);
    }
    else {
      this.onError(ShakingCodes.SERVER_ERROR);
    }
    
    this.processing = false;
    this._restart();
  },

  _requestLocation: async function() {

    if(this.manualLocation) return;

    if(Platform.OS === 'ios') this._requestLocationIOS();
    else this._requestLocationAndroid();
  },

  _requestLocationIOS: function(){
    this._getCurrentPosition();
  },

  _requestLocationAndroid: async function(){
    try {

      const permission = await this._checkAndroidPermissions();
      if (PermissionsAndroid.RESULTS.GRANTED === permission || permission === true) {
        this._getCurrentPosition();
      } 
      else if (permission === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        this.onError(ShakingCodes.LOCATION_PERMISSION_ERROR);
        this.stop();
      }
      else {
        this.onError(ShakingCodes.LOCATION_PERMISSION_ERROR);
      }

    } catch (err) {
      console.warn(err)
    }
  },

  _checkAndroidPermissions: async function(){
    const permission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )
    // In Android SDK versions lower than 23, granted is a bool
    return permission;
  },

  _getCurrentPosition: function(){
    Geolocation.getCurrentPosition(
      (position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
      },
      (error) => {

          if(error.code === 1){
            this.onError(ShakingCodes.LOCATION_PERMISSION_ERROR);
          } 
          else {
            this.onError(ShakingCodes.LOCATION_DISABLED);
          } 
          
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
    );
  },

  _handleAppStateChange: function(nextAppState) {

    if (nextAppState === 'active') {
      this._restart();
    }
    else {
      this._pause();
    }
  }
}