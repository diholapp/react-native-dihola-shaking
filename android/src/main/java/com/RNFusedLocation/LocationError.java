/**
* Original work: Copyright (c) 2018 Iftekhar Rifat
* Modified work: Copyright (c) 2019 DiHola S.L.
*
* This source code is licensed under the Apache 2.0 license found in 
* https://github.com/diholapp/react-native-dihola-shaking/blob/master/LICENSE.
*
*/

package com.diholapp.RNFusedLocation;

public enum LocationError {
    PERMISSION_DENIED(1),
    POSITION_UNAVAILABLE(2),
    TIMEOUT(3),
    PLAY_SERVICE_NOT_AVAILABLE(4),
    SETTINGS_NOT_SATISFIED(5),
    INTERNAL_ERROR(-1);

    private int value;

    LocationError(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
