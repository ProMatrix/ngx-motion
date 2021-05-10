/// <reference types="googlemaps" />
import { ChangeDetectorRef, NgZone } from '@angular/core';
export declare class GoogleMapsComponent {
    private readonly cd;
    private readonly ngZone;
    promise: Promise<any>;
    url: string;
    googleMapKey: string;
    map: google.maps.Map;
    marker: google.maps.Marker;
    widthPercent: string;
    heightPercent: string;
    address: string;
    zipcode: string;
    latitude: number;
    longitude: number;
    constructor(cd: ChangeDetectorRef, ngZone: NgZone);
    initialize(): Promise<any>;
    private loadGoogleMaps;
    private recenterMapAndMarker;
    findMe(): void;
    findAddress(address$: any, zipcode$: any): void;
    lookupAddress(): void;
}
