# DiHola Shaking API for React Native

DiHola Shaking API makes it easy to build fast and reliable ways to communicate between devices, just by shaking them.
We provide such a secure and flexible protocol that this technology can be applied in any form of data exchange: Payment processing, file sharing, social networking, verification processes, etc.

## Index
1. [Installation](#installation)
2. [Usage](#usage)
3. [Methods](#methods)
4. [Error Codes](#error-codes)


Installation
-------

`$ npm install react-native-dihola-shaking --save`

### Mostly automatic installation

`$ react-native link react-native-dihola-shaking`

**Note**: Manual installation step 4 for both Android and iOS is required.

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-dihola-shaking` and add `RNDiHolaShaking.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNDiHolaShaking.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Add `NSLocationWhenInUseUsageDescription` to `Info.plist`
5. Run your project (`Cmd+R`)


#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.diholapp.RNDiHolaShakingPackage;` to the imports at the top of the file
  - Add `new RNDiHolaShakingPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-dihola-shaking'
  	project(':react-native-dihola-shaking').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-dihola-shaking/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-dihola-shaking')
  	```
4. If you've defined [project-wide properties](https://developer.android.com/studio/build/gradle-tips#configure-project-wide-properties) (recommended) in your root build.gradle, this library will detect the presence of the following properties:

    ```gradle
    buildscript {...}
    allprojects {...}

    /**
     + Project-wide Gradle configuration properties
     */
    ext {
        compileSdkVersion   = 25
        targetSdkVersion    = 25
        buildToolsVersion   = "25.0.2"
        supportLibVersion   = "25.0.1"
        googlePlayServicesVersion = "11.0.0"
    }
    ```

    If you do not have *project-wide properties* defined and have a different play-services version than the one included in this library, use the following instead. But play service version should be `11+` or the library won't work.

    ```gradle
    ...
    dependencies {
        ...
        compile(project(':react-native-dihola-shaking')) {
            exclude group: 'com.google.android.gms', module: 'play-services-location'
        }
        compile 'com.google.android.gms:play-services-location:<insert your play service version here>'
    }
    ```
    
Usage
-------

```javascript
import { ShakingAPI } from 'react-native-dihola-shaking';

ShakingAPI.configure({

    API_KEY: "<API_KEY>",
    user: "<USER_ID>",
    
    onShaking: () => {
      console.log("Shaking event detected");
    },
    
    onSuccess: (result) => {
      (result.length > 0) ? 
        console.log("You connected with: " + result) :
        console.log("Couldn't find anyone...");
    },
    
    onError: (error) => {
      console.log(error);
    }
    
}).start();
```

Methods
-------

### Summary

* [`configure`](#configure)
* [`start`](#start)
* [`stop`](#stop)
* [`simulate`](#simulate)
* [`setSensibility`](#setsensibility)
* [`setDistanceFilter`](#setdistancefilter)
* [`setTimingFilter`](#settimingfilter)
* [`setKeepSearching`](#setkeepsearching)
* [`setLocation`](#setlocation)



### Details

#### `configure()`

```javascript
ShakingAPI.configure(options);
```
 - **options**:

    | Name | Type | Default | Required | Description |
    | -- | -- | -- | -- | -- |
    | API_KEY | `string` | -- | `yes` | Get one at www.diholapp.com |
    | user | `string` | -- | `yes` |User identifier |
    | lat | `double` | Device current location | `no` | Latitude coordinates
    | lng | `double` | Device current location | `no` | Longitude coordinates
    | sensibility | `double` | `25` | `no` | Shaking sensibility
    | distanceFilter | `double` | `100` | `no` | Maximum distance (in meters) between two devices to be eligible for pairing.
    | timingFilter | `double` | `2000` | `no` | Maximum time difference (in milliseconds) between two shaking events to be eligible for pairing.
    | keepSearching | `bool` | `false` | `no` | A positive value would allow to keep searching even though if a user has been found. This could allow to pair with multiple devices. The response time will be affected by the timingFilter value.
    | onShaking | `function` | -- | `no` | Invoked when the shaking event is detected
    | onSuccess | `function` | -- | `yes` | Invoked with a list of paired users
    | onError | `function` | -- | `yes` | Invoked whenever an error is encountered


---


#### `start()`

```javascript
ShakingAPI.start();
```

Starts listening to shaking events.


---

#### `stop()`

```javascript
ShakingAPI.stop();
```

Stops listening to shaking events.

---

#### `simulate()`

```javascript
ShakingAPI.simulate();
```

Simulates the shaking event.


---

#### `setSensibility()`

```javascript
ShakingAPI.setSensibility(sensibility);
```

Sets the sensibility for the shaking event to be triggered.

**Parameters:**

| Name        | Type     | Default|
| ----------- | -------- | -------- |
| sensibility| double     | 25      |

---


#### `setDistanceFilter()`

```javascript
ShakingAPI.setDistanceFilter(distanceFilter);
```

Sets the maximum distance (in meters) between two devices to be eligible for pairing.

**Parameters:**

| Name        | Type     | Default| Note|
| ----------- | -------- | -------- | ----------------------------------------- |
| distanceFilter| int     | 100  | GPS margin error must be taken into account        |

---


#### `setTimingFilter()`

```javascript
ShakingAPI.setTimingFilter(timingFilter);
```

Sets the maximum time difference (in milliseconds) between two shaking events to be eligible for pairing.

**Parameters:**

| Name        | Type     | Default| Note|
| ----------- | -------- | -------- | -------- |
| timingFilter| int   | 2000 | Value between 100 and 10000 |

---

#### `setKeepSearching()`

```javascript
ShakingAPI.setKeepSearching(keepSearching);
```

A positive value would allow to keep searching even though if a user has been found. This could allow to pair with multiple devices. The response time will be affected by the timingFilter value.

**Parameters:**

| Name        | Type     | Default|
| ----------- | -------- | -------- |
| keepSearching| boolean| false|

---


#### `setLocation()`


```javascript
ShakingAPI.setLocation(latitude, longitude);
```

Setting the location manually will disable using the device location.

**Parameters:**

| Name        | Type     | Default  |
| ----------- | -------- | -------- |
| latitude    | double   | Device current value|
| longitude   | double   | Device current value|



Error Codes
----------

| Name                     |  Description|
| ---------------------    |  -------- |
| LOCATION_PERMISSION_ERROR| Location permission has not been accepted|
| LOCATION_DISABLED        | Location is disabled|
| SENSOR_ERROR             | The sensor devices are not available |
| AUTHENTICATION_ERROR     | API key invalid|
| API_KEY_EXPIRED          | API key expired|
| SERVER_ERROR             | Server is not available|
  
Example:

```javascript
import { ShakingAPI, ShakingCodes } from 'react-native-dihola-shaking';

ShakingAPI.configure({

  ...
      
  onError: (error) => {

    switch(error){
      case ShakingCodes.LOCATION_PERMISSION_ERROR:
        // Do something
        break;
      case ShakingCodes.LOCATION_DISABLED:
        // Do something
        break;
      case ShakingCodes.AUTHENTICATION_ERROR:
        // Do something
        break;
      case ShakingCodes.API_KEY_EXPIRED:
        // Do something
        break;
      case ShakingCodes.SERVER_ERROR:
        // Do something
        break;
      case ShakingCodes.SENSOR_ERROR:
        // Do something
        break;
    }

  }
      
});

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
