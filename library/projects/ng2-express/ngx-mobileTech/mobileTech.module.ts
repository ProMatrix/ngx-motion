import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../ngx-appHelper/material.module';
import { SpeechToTextComponent } from './speechToTextComponent';
import { TextToSpeechComponent } from './textToSpeechComponent';
import { GoogleMapsComponent } from './googleMapsComponent';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [SpeechToTextComponent, TextToSpeechComponent, GoogleMapsComponent],
    exports: [
        CommonModule,
        FormsModule,
      SpeechToTextComponent,
      TextToSpeechComponent,
      GoogleMapsComponent
    ],
    providers: []
})
export class MobileTechModule { }
