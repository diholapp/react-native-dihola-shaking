import { PermissionsAndroid, Platform, AppState } from "react-native";
import { map, filter } from "rxjs/operators";
import * as Sensors from "./sensors";
import ShakingCodes from "./codes";
import Geolocation from "./geolocation";

const URL = "https://api.diholapplication.com/shaking/connect";
const HEADERS = {
  'accept': 'application/json',
  'content-type': 'application/json'
};

export default ShakingAPI = {

  API_KEY: "Get one at www.diholapp.com",
  user: "",

  lat: 0,
  lng: 0,

  sensibility: 23.75,
  timingFilter: 2000,
  distanceFilter: 100,
  keepSearching: false,

  manualLocation: false,

  subscription: null,

  stopped: true,

  appStateEventListener: false,

  start: function(){
    this.stopped = false;
    this.requestLocation();
    this.subscribe();

    if(!this.appStateEventListener){
      this.appStateEventListener = true;
      AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    }
  },

  stop: function(){
    this.stopped = true;
    this.subscription && this.subscription.unsubscribe();

    AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
  },

  simulate: function(){
    this.connect();
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
      onShaking,
      onSuccess,
      onError
    } = params;

    this.API_KEY = API_KEY;
    this.user = user;

    if (sensibility !== undefined) this.sensibility = sensibility;
    if (timingFilter !== undefined) this.timingFilter = timingFilter;
    if (distanceFilter !== undefined) this.distanceFilter = distanceFilter;
    if (keepSearching !== undefined) this.keepSearching = keepSearching;

    if(lat !== undefined && lng !== undefined){
      this.setLocation(lat, lng);
    }

    this.onShaking = onShaking;
    this.onSuccess = onSuccess;
    this.onError = onError;

    return this;
  },

  setLocation: function(lat, lng){
    this.lat = lat;
    this.lng = lng;
    this.manualLocation = false;
  },

  setUser: function(user){
    this.user = user;
  },

  setSensibility: function(sensibility){
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

  subscribe: function(){
    this.subscription = Sensors.createAccelerometer()
    .pipe(map(({ x, y, z }) => Math.abs(x) + Math.abs(y) + Math.abs(z)), filter(speed => speed > this.sensibility))
    .subscribe(
      speed => this.onShakingEvent(),
      error => this.onError(ShakingCodes.SENSOR_ERROR)
    )
  },

  onShakingEvent: function(){
    this.subscription.unsubscribe();
    this.onShaking && this.onShaking();
    this.requestLocation();
    this.connect();
  },

  connect: function(){
    
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
      .then(result => this.handleServerResponse(result))
      .catch(err => {

        this.onError(ShakingCodes.SERVER_ERROR);
        setTimeout(() => {
          !this.stopped && this.subscribe()
        }, 2000);

        console.log(err)
      })
  },

  handleServerResponse: function(resp){
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
    
    !this.stopped && this.subscribe();
  },

  requestLocation: async function() {

    if(this.manualLocation) return;

    if(Platform.OS === 'ios') this.requestLocationIOS();
    else this.requestLocationAndroid();
  },

  requestLocationIOS: function(){
    alert("Not implemented yet");
  },

  requestLocationAndroid: async function(){
    try {

      if (this.checkAndroidPermissions()) {
        this.getCurrentPosition();
      } 
      else {
        this.onError(ShakingCodes.LOCATION_PERMISSION_ERROR);
      }
    } catch (err) {
      // TODO: onError
      console.warn(err)
    }
  },

  checkAndroidPermissions: async function(){
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )
    // In Android SDK versions lower than 23, granted is a bool
    return PermissionsAndroid.RESULTS.GRANTED === granted || granted === true;
  },

  getCurrentPosition: function(){
    Geolocation.getCurrentPosition(
      (position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          console.log(position)
      },
      (error) => {
          // TODO: onError
          if(error.code === 1){
            this.onError(ShakingCodes.LOCATION_PERMISSION_ERROR);
          } 
          else {
            this.onError(ShakingCodes.LOCATION_DISABLED);
          } 
          
          console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  },

  _handleAppStateChange: function(nextAppState) {
    if (nextAppState === 'active') {
      this.start();
    }
    else {
      this.stop();
    }
  }
}