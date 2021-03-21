import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpandVisibleComponent } from './expandVisible';
import { ViewFaderComponent } from './viewFader';
import { ViewBlinkerComponent } from './viewBlinker';
import { ModalDialogComponent } from './modalDialog';

@NgModule({
  imports: [CommonModule],
  declarations: [ViewFaderComponent, ViewBlinkerComponent, ExpandVisibleComponent, ModalDialogComponent],
  exports: [
    CommonModule,
    FormsModule,
    ViewFaderComponent,
    ViewBlinkerComponent,
    ExpandVisibleComponent,
    ModalDialogComponent
  ]
})
export class AppAnimationModule { }
