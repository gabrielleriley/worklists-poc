import { Component } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private store: Store<any>) {
        this.store.subscribe((s) => console.log(s));
    }
    public options = ['Table States', 'Basic Table - Loadable Entity'];
    public option = this.options[1];
    public setExample(ev: MatSelectionListChange) {
        this.option = ev.option.value;
    }
}
