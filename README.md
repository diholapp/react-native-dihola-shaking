
# react-native-dihola-shaking

## Getting started

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
  - Add `import com.reactlibrary.RNDiHolaShakingPackage;` to the imports at the top of the file
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

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNDiHolaShaking.sln` in `node_modules/react-native-dihola-shaking/windows/RNDiHolaShaking.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Di.Hola.Shaking.RNDiHolaShaking;` to the usings at the top of the file
  - Add `new RNDiHolaShakingPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNDiHolaShaking from 'react-native-dihola-shaking';

// TODO: What to do with the module?
RNDiHolaShaking;
```
  