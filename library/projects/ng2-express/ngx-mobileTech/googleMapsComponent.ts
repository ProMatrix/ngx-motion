import { Component, Input, Output, EventEmitter, ChangeDetectorRef, NgZone } from '@angular/core';

@Component({
  selector: 'google-maps',
  template: `<div id="googleMap"[style.height.%]="heightPercent" [style.width.%]="widthPercent" ></div>`
})
export class GoogleMapsComponent {
  promise: Promise<any>;
  url: string;
  googleMapKey = 'api key goes here';
  map: google.maps.Map;
  marker: google.maps.Marker;

  @Input() widthPercent = '';
  @Input() heightPercent = '';
  address = '';
  zipcode = '';
  latitude = 0;
  longitude = 0;

  constructor(private readonly cd: ChangeDetectorRef, private readonly ngZone: NgZone) {
  }

  public initialize() {
    this.url = 'https://maps.googleapis.com/maps/api/js?key=' + this.googleMapKey + '&callback=__onGoogleLoaded';

    this.promise = new Promise(() => {
      const s = '__onGoogleLoaded';
      window[s] = () => {
        setTimeout(() => {
          this.loadGoogleMaps();
        }, 1000);
      };

      const node = document.createElement('script');
      node.src = this.url;
      node.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(node);
    });
    return this.promise;
  }

  private loadGoogleMaps() {
    const mapProp = {
      center: new google.maps.LatLng(0, 0),
      zoom: 13,
      fullscreenControl: false,
      streetViewControl: false
    };

    this.map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
    this.marker = new google.maps.Marker({ position: new google.maps.LatLng(0, 0), draggable: true, title: 'You are here!' });
    this.marker.setVisible(false);   
    this.marker.setMap(this.map);
  }

  private recenterMapAndMarker() {
    if (this.latitude && this.longitude) {
      const latLgn = new google.maps.LatLng(this.latitude, this.longitude);
      this.map.setCenter(latLgn);
      this.marker.setPosition(latLgn);
    }
  }

  public findMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.recenterMapAndMarker();
        this.lookupAddress();
        this.marker.setVisible(true); 
      }, (error) => {
        alert(error.message);
      });
    }
  }

  findAddress() {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.address + ' ' + this.zipcode }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            this.latitude = results[0].geometry.location.lat();
            this.longitude = results[0].geometry.location.lng();
            this.recenterMapAndMarker();
            this.marker.setVisible(true);
        }
        else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

  lookupAddress() {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat: this.latitude, lng: this.longitude };
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        const parts = results[1].formatted_address.split(',');
        if (parts.length > 1) {
          this.address = parts[0] + ', ' + parts[1];
        }
        this.zipcode = results[1].address_components[7].short_name;
      }
      else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
}
