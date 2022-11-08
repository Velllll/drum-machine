import { ChangeDetectionStrategy, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, fromEvent, map, Observable, startWith, take } from 'rxjs';
import { IPad, IPads, StoreService } from '../../services/store/store.service';

@Component({
  selector: 'app-pads',
  templateUrl: './pads.component.html',
  styleUrls: ['./pads.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PadsComponent implements OnInit {
  pads$: Observable<IPad[]> = this.store.padsArr$

  currentPad$ = new BehaviorSubject<IPad>({padName: '', src: '', sampleName: '', volume: 1})

  volumeForm = new FormGroup({
    volume: new FormControl(1)
  })

  constructor(
    private store: StoreService
  ) { }

  ngOnInit(): void {
    combineLatest([fromEvent(window, 'keydown')]).subscribe(([e]) => {
      let event: any = e
      let pads: IPad[] = []
      this.pads$.pipe(take(1)).subscribe(ps => pads = ps)
      pads.forEach(pad => {
        const padInfo = this.store.getPadInfo(pad.padName)
        //if src not empty and you press right key 
        if(event.key === pad.padName && padInfo.src) {
          this.store.playSample(padInfo.src, padInfo.volume, padInfo.padName)
        }
      })
    })

    this.volumeForm.valueChanges.subscribe((v) => {
      const gain = +v.volume!.toString().slice(0, 3)
      const padInfo = this.currentPad$.getValue()
      this.store.setVolume(padInfo.padName, gain)
    })
  }

  palySample(padName: string) {
    const padInfo = this.store.getPadInfo(padName)
    this.currentPad$.next(padInfo)
    const volume = padInfo.volume
    this.volumeForm.patchValue({volume})
    //if src not empty
    if(padInfo.src && volume) this.store.playSample(padInfo.src, volume, padInfo.padName)
  }

  getVolume() {
    const gain = this.volumeForm.getRawValue().volume
    if(gain !== null) {
      return +gain.toString().slice(0, 3) * 2
    } else {
      return 100
    }
  }
}
