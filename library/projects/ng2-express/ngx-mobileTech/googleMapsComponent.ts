import { Component, Input, Output, EventEmitter, ChangeDetectorRef, NgZone } from '@angular/core';
import { trigger, state, animate, transition, style } from '@angular/animations';
import { } from 'google-maps';

@Component({
  selector: 'google-maps',
  //#region template:
  template: `<div id="googleMap" [style.height.px]="height"
  [style.height.%]="heightPercent" [style.width.px]="width" [style.width.%]="widthPercent" ></div>`
  // #endregion
})
export class GoogleMapsComponent {
  promise: Promise<any>;
  private url: string;
  public googleMapKey: string;
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
  }

  public initialize() {
    this.url = 'https://maps.googleapis.com/maps/api/js?key=' + this.googleMapKey + '&callback=__onGoogleLoaded';

    this.promise = new Promise(() => {
      const s = '__onGoogleLoaded';
      window[s] = () => {
        this.loadGoogleMaps();
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

    google.maps.event.addListener(this.map, 'click', (event: google.maps.MouseEvent) => {
      this.marker.setPosition(event.latLng);
      this.latitude = event.latLng.lat();
      this.longitude = event.latLng.lng();
    });

    const contentInfoWindow = `
        <div>
        <div>Set the Latitude and Longitude</div>
        <div>to this marker location?</div>
        <button style="margin-top:.5em;" class="btn btn-primary btn-xs buttonUpdateCoordsFromMarkerLocation">Update</button>
        </div>`;
    google.maps.event.addListener(this.marker, 'click', () => {

      const div = document.createElement('div');
      div.innerHTML = contentInfoWindow;
      const buttonUpdateCoordsFromMarkerLocation = div.getElementsByClassName('buttonUpdateCoordsFromMarkerLocation');
      if (buttonUpdateCoordsFromMarkerLocation.length) {
        const button = buttonUpdateCoordsFromMarkerLocation[0] as HTMLButtonElement;
        button.onclick = () => {
          this.onClickUpdateCoordsFromMarkerLocation();
        };
      }
      const infowindow = new google.maps.InfoWindow({
        content: div
      });
      infowindow.open(this.map, this.marker);
    });

    google.maps.event.addListener(this.marker, 'dragend', (event: google.maps.MouseEvent) => {
      this.latitude = event.latLng.lat();
      this.longitude = event.latLng.lng();
    });
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

  private markerDragEnd(m: any, $event: google.maps.MouseEvent) {
    this.latitude = $event.latLng.lat();
    this.longitude = $event.latLng.lng();
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
