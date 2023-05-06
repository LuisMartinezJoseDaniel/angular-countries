import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: [],
})
export class SearchBoxComponent {
  @Input()
  public placeholder: string = '';

  //Nombre del evento en el componente
  // <shared-search-box (onValue)=""></shared-search-box>
  @Output()
  public onValue: EventEmitter<string> = new EventEmitter();

  // Este metodo se llama en el input dentro del componente para emitir el valir a fuera
  public emitValue(value: string) {
    if (!value) return;

    this.onValue.emit(value);
  }
}
