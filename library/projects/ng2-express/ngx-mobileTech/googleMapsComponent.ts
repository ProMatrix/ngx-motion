import { Component, Input, Output, EventEmitter, ChangeDetectorRef, NgZone } from '@angular/core';

@Component({
  selector: 'google-maps',
  template: `<div id="googleMap" [style.height.px]="height"
  [style.height.%]="heightPercent" [style.width.px]="width" [style.width.%]="widthPercent" ></div>`
})
export class GoogleMapsComponent {
  promise: Promise<any>;
  private url: string;
  public googleMapKey = 'ApiKey goes here';
  private maplat = 0;
  private maplng = 0;
  private map: google.maps.Map;
  private marker: google.maps.Marker;

  @Input() isVisible: boolean;
  @Input() owner: any;
  @Input() updateCoordinatesCallback: string;
  @Input() updateAddressCallback: string;
  @Input() width = '';
  @Input() height = '';
  @Input() widthPercent = '';
  @Input() heightPercent = '';
  @Input() latitude: number;
  @Input() longitude: number;
  @Output() visibleChange = new EventEmitter<boolean>();

  constructor(private readonly cd: ChangeDetectorRef, private readonly ngZone: NgZone) {
    debugger;
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
    if (!isNaN(this.latitude) && !isNaN(this.longitude)) {
      this.maplat = this.latitude;
      this.maplng = this.longitude;
    }

    const mapProp = {
      center: new google.maps.LatLng(this.maplat, this.maplng),
      zoom: 13,
      fullscreenControl: false,
      streetViewControl: false
    };

    this.map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
    this.marker = new google.maps.Marker({ position: new google.maps.LatLng(this.maplat, this.maplng), draggable: true });
    this.marker.setMap(this.map);

    const contentInfoWindow = `
        <div>
        <div>Set the Latitude and Longitude</div>
        <div>to this marker location?</div>
        <button style="margin-top:.5em;" class="btn btn-primary btn-xs buttonUpdateCoordsFromMarkerLocation">Update</button>
        </div>`;
  }

  private recenterMapAndMarker() {
    if (!isNaN(this.latitude) && !isNaN(this.longitude)) {
      this.maplat = this.latitude;
      this.maplng = this.longitude;
      const latLgn = new google.maps.LatLng(this.maplat, this.maplng);
      this.map.setCenter(latLgn);
      this.marker.setPosition(latLgn);
    }
  }

  private onClickUpdateCoordsFromMarkerLocation() {
    this.ngZone.run(() => {
      this.updateOwner();
    });
  }

  private updateOwner() {
    if (this.owner && this.updateCoordinatesCallback) {
      this.owner[this.updateCoordinatesCallback](Math.round(this.latitude * 100000) / 100000, Math.round(this.longitude * 100000) / 100000);
    }
  }

  private onBlurLatLng() {
    this.recenterMapAndMarker();
  }

  public findMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.recenterMapAndMarker();
        this.updateOwner();
      }, (error) => {
        alert(error.message);
      });
    }
  }

  public useAddress(address$: string, zipcode$: string) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address$ + ' ' + zipcode$ }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        this.latitude = results[0].geometry.location.lat();
        this.longitude = results[0].geometry.location.lng();
        this.recenterMapAndMarker();
        this.updateOwner();
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  public lookupAddress() {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat: this.latitude, lng: this.longitude };
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        const address = results[0].address_components[0].short_name + ' ' + results[0].address_components[1].short_name;
        this.owner[this.updateAddressCallback](address, results[0].address_components[6].short_name);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
}
