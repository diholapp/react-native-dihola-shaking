# DiHola Shaking API for Android

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

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-dihola-shaking` and add `RNDiHolaShaking.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNDiHolaShaking.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

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
    
    
Usage
-------

```javascript
import { ShakingAPI, ShakingCodes } from 'react-native-dihola-shaking';

ShakingAPI.configure({
    API_KEY: "<API_KEY>",
    user: "<USER_ID>",
    onShaking: () => {
      console.log("SHAKEN");
    },
    onSuccess: (result) => {
      if(result.length) console.log("You connected with: " + result);
      else console.log("Couldn't find anyone...");
    },
    onError: (error) => {
      console.log(error);
    }
}).start();
```

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
  
