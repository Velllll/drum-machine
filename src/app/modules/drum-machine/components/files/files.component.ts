import { Component, Input, OnInit } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { StoreService } from '../../services/store/store.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  @Input('isTutorial') tutorial?: boolean

  folders = this.store.folder$.getValue()
  
  constructor(
    private store: StoreService
  ) { }

  ngOnInit(): void {

  }

  play(src: string) {
    this.store.selectSamplePlay(src)
  }

  appointToPad(sapmlesSrc: string, pad: string, sampleName: string) {
    if(!this.tutorial) this.store.appointPad(sapmlesSrc, pad, sampleName)
  }

}
