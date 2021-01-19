import { NgModule } from '@angular/core';
import { PersonAutoEntity } from './people';
import { PersonEntityService } from './people/person-entity.service';
import { NationalityAutoEntity } from './nationalities';
import { NationalityEntityService } from './nationalities/nationality-entity.service';

@NgModule({
    providers: [
        { provide: PersonAutoEntity, useClass: PersonEntityService },
        { provide: NationalityAutoEntity, useClass: NationalityEntityService }
    ]
})
export class AutoEntityModule { }