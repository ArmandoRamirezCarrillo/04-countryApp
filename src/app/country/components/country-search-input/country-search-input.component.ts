import { Component, EventEmitter, input, output, Output } from '@angular/core';

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
}
