import { Component, inject, linkedSignal, resource, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom, of } from 'rxjs';

import { CountrySearchInputComponent } from "../../components/country-search-input/country-search-input.component";
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { CountryService } from '../../services/country.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-by-country-page',
  imports: [CountrySearchInputComponent, CountryListComponent],
  templateUrl: './by-country-page.component.html',
})
export class ByCountryPageComponent {
  // onSearch(value:string){
  //   console.log({value});
  // }
  countryService = inject(CountryService);

  activatedRouter = inject(ActivatedRoute);
  router = inject(Router);
  queryParam = this.activatedRouter.snapshot.queryParamMap.get('query') ?? '';

  query = linkedSignal(() =>this.queryParam);

  countryResource = rxResource({
    request: () => ({query: this.query()}),
    loader: ({request}) => {
      if(!request.query) return of([]);
      this.router.navigate(['/country/by-country'],{
        queryParams: {query: request.query},
      })
      return this.countryService.searchByCountry(request.query)
    }
  })

  // countryResource = resource({
  //   request: () => ({query: this.query()}),
  //   loader: async({request}) => {
  //     if(!request.query) return [];
  //     return await firstValueFrom(this.countryService.searchByCountry(request.query))
  //   }
  // })
}
