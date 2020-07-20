import { NgModule } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from './material.module';
import { NgxsModule } from '@ngxs/store';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    RouterTestingModule, HttpClientModule, MaterialModule, NgxsModule.forRoot([])
  ],
  exports: [
    RouterTestingModule, HttpClientModule, MaterialModule, NgxsModule
  ]
})
export class AppTestingModule {

}
