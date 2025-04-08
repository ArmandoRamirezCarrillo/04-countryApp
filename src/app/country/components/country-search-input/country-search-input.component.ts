import { Component, effect, EventEmitter, input, linkedSignal, output, Output, signal } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './country-search-input.component.html',
})
export class CountrySearchInputComponent {
  value = output<string>();

  // @Output() datoEnviado = new EventEmitter<string>();

  // onSearch(value:string){
  //   this.datoEnviado.emit(value);
  // }

  placeholder = input('Buscar');
  initialValue = input<string>();
  inputValue = linkedSignal<string>(() => this.initialValue() ?? '');
  debounceTime = input(1000);

  debounceEffect = effect((onCleanup) => {
    const value = this.inputValue();
    const timeout = setTimeout(() => {
      this.value.emit(value);
    },this.debounceTime());

    onCleanup(() => clearTimeout(timeout))
  })
}
