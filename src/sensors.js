import { NativeModules } from "react-native";
const {
  Accelerometer: AccNative
} = NativeModules;

import { DeviceEventEmitter } from "react-native";
import { Observable } from "rxjs";
import { publish, refCount } from "rxjs/operators";
import ShakingCodes from "./codes";

if (!AccNative) {
  throw new Error(
    "Native modules not available. Did react-native link run successfully?"
  );
}

// Cache the availability of sensors
const availableSensors = {};

function start() {
  AccNative.startUpdates();
}

function stop() {
  AccNative.stopUpdates();
}

function makeSingleton() {
  return source => source.pipe(publish(), refCount());
}

function isAvailable(type) {
  if (availableSensors[type]) {
    return availableSensors[type];
  }

  const promise = AccNative.isAvailable();
  availableSensors[type] = promise;

  return promise;
}

export function setUpdateInterval(updateInterval) {
  AccNative.setUpdateInterval(updateInterval);
}

export function createAccelerometer() {
  return Observable.create(function subscribe(observer) {
    this.isSensorAvailable = false;

    this.unsubscribeCallback = () => {
      if (!this.isSensorAvailable) return;
      stop();
    };

    isAvailable("accelerometer").then(
      () => {
        DeviceEventEmitter.addListener("Accelerometer", data => {
          observer.next(data);
        });

        this.isSensorAvailable = true;
        start();
      },
      () => {
        observer.error(ShakingCodes.SENSOR_ERROR);
      }
    );

    return this.unsubscribeCallback;
  }).pipe(makeSingleton());
}

