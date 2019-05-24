/**
* Copyright (c) 2019 DiHola S.L.
*
* This source code is licensed under the Apache 2.0 license found in 
* https://github.com/diholapp/react-native-dihola-shaking/blob/master/LICENSE.
*
*/

package com.diholapp;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class RNDiHolaShakingModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNDiHolaShakingModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNDiHolaShaking";
  }
}