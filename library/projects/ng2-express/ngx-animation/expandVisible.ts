import { Component, OnChanges, Input, AfterViewInit } from '@angular/core';
import { trigger, state, animate, transition, style } from '@angular/animations';

@Component({
    selector: 'expand-visible',
    template: `
    <div [@visibilityChanged]="visibility" [style.visibility]="initalized ? 'visible' : 'hidden' ">
      <ng-content></ng-content>
    </div>
  `,
    animations: [
        trigger('visibilityChanged', [
            state('shown', style({ opacity: 1, height: '100%', width: '100%' })),
            state('hidden', style({ opacity: 0, height: '0', width: '0' })),
            transition('* => *', animate('.5s'))
        ])
    ]
})
export class ExpandVisibleComponent implements OnChanges, AfterViewInit {
    @Input() isVisible = false;
    visibility = 'hidden';
    initalized = false;

    ngAfterViewInit() {
        setTimeout(() => {
            this.initalized = true;
        }, 500);
    }

    ngOnChanges() {
        this.visibility = this.isVisible ? 'shown' : 'hidden';
    }
}
