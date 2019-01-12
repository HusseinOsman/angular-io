import { Component, OnInit } from '@angular/core';

import { Dummy } from './dummy';
import { DummiesService } from './dummies.service';

@Component({
  selector: 'app-dummies',
  templateUrl: './dummies.component.html',
  providers: [ DummiesService ],
  styleUrls: ['./dummies.component.css']
})
export class DummiesComponent implements OnInit {
  dummies: Dummy[];
  editDummy: Dummy; // the dummy currently being edited

  constructor(private dummiesService: DummiesService) { }

  ngOnInit() {
    this.getDummies();
  }

  getDummies(): void {
    this.dummiesService.getDummies()
      .subscribe(dummies => this.dummies = dummies);
  }

  add(name: string): void {
    this.editDummy = undefined;
    name = name.trim();
    if (!name) { return; }

    // The server will generate the id for this new dummy
    const newDummy: Dummy = { name } as Dummy;
    this.dummiesService.addDummy(newDummy)
      .subscribe(dummy => this.dummies.push(dummy));
  }

  delete(dummy: Dummy): void {
    this.dummies = this.dummies.filter(h => h !== dummy);
    this.dummiesService.deleteDummy(dummy.id).subscribe();
    /*
    // oops ... subscribe() is missing so nothing happens
    this.dummiesService.deleteDummy(dummy.id);
    */
  }

  edit(dummy) {
    this.editDummy = dummy;
  }

  search(searchTerm: string) {
    this.editDummy = undefined;
    if (searchTerm) {
      this.dummiesService.searchDummies(searchTerm)
        .subscribe(dummies => this.dummies = dummies);
    }
  }

  update() {
    if (this.editDummy) {
      this.dummiesService.updateDummy(this.editDummy)
        .subscribe(dummy => {
          // replace the dummy in the dummies list with update from server
          const ix = dummy ? this.dummies.findIndex(h => h.id === dummy.id) : -1;
          if (ix > -1) { this.dummies[ix] = dummy; }
        });
      this.editDummy = undefined;
    }
  }
}
