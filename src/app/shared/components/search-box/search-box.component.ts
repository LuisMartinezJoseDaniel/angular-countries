import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: [],
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  // Subject -> Observable especial personalizado
  private debounce = new Subject<string>(); //Un debounce es un evento que se ejecuta despues de un determinado tiempo
  private debounceSubscription?: Subscription;

  @Input() public initialValue: string = '';

  @Input()
  public placeholder: string = '';

  // Nombre del evento en el componente
  // <shared-search-box (onValue)=""></shared-search-box>
  @Output()
  public onValue: EventEmitter<string> = new EventEmitter();
  // <shared-search-box (onValue)=""></shared-search-box>
  @Output()
  public onDebounce: EventEmitter<string> = new EventEmitter();

  ngOnInit(): void {
    // crear el debounce al crear la APP
    // debounceTime -> tiempo de espera para emitir el valor
    // hasta que se deje de escribir en el input, pasa 0.3s y despues ejecuta el subscribe
    // Manejar de manera independiente el retorno del subscribe
    this.debounceSubscription = this.debounce
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.onDebounce.emit(value);
      });
  }

  ngOnDestroy(): void {
    // Hacer solo con suscripciones personalizadas en caso de usar http, utilizar el take
    this.debounceSubscription?.unsubscribe; //Eliminar el subscription si existe
  }

  // Este metodo se llama en el input dentro del componente para emitir el valir a fuera
  public emitValue(value: string) {
    if (!value) return;

    this.onValue.emit(value);
  }

  onKeyPress(searchTerm: string) {
    this.debounce.next(searchTerm);
  }
}
