import { NgModule, ModuleWithProviders } from '@angular/core';

import { AppServices } from './appServices';

@NgModule({
    declarations: [
    ],
    exports: [
    ]
})
export class AppHelperModule {
    static forRoot(): ModuleWithProviders<AppHelperModule> {
        return {
          ngModule: AppHelperModule,
            providers: [AppServices]
        };
    }
}
