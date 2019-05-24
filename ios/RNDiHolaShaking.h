
/**
* Original work: Copyright (c) 2017 Daniel Schmidt
* Modified work: Copyright (c) 2019 DiHola S.L.
*
* This source code is licensed under the Apache 2.0 license found in 
* https://github.com/diholapp/react-native-dihola-shaking/blob/master/LICENSE.
*
*/

#import <React/RCTBridgeModule.h>
#import <CoreMotion/CoreMotion.h>

@interface Accelerometer : NSObject <RCTBridgeModule> {
    CMMotionManager *_motionManager;
}

- (void) isAvailableWithResolver:(RCTPromiseResolveBlock) resolve
         rejecter:(RCTPromiseRejectBlock) reject;
- (void) setUpdateInterval:(double) interval;
- (void) getUpdateInterval:(RCTResponseSenderBlock) cb;
- (void) getData:(RCTResponseSenderBlock) cb;
- (void) startUpdates;
- (void) stopUpdates;

@end
