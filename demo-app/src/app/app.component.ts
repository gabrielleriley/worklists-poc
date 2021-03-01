import { Component } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public options = ['Table States', 'Basic Table - Loadable Entity'];
    public option = this.options[1];
    public setExample(ev: MatSelectionListChange) {
        this.option = ev.option.value;
    }
}
