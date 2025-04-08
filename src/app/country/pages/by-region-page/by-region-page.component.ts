import { Component, inject, linkedSignal, signal } from '@angular/core';
import { Region } from '../../interfaces/region.type';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { CountryService } from '../../services/country.service';
import { ActivatedRoute, Router } from '@angular/router';

function validateQueryParam(queryParam: string): Region{
  queryParam = queryParam.toLowerCase();

  const validRegions: Record<string, Region> = {
    africa: 'Africa',
    americas: 'Americas',
    asia: 'Asia',
    europe: 'Europe',
    oceania: 'Oceania',
    antarctic: 'Antarctic'
  }

  return validRegions[queryParam] ?? 'Americas';

}

@Component({
  selector: 'app-by-region-page',
  imports: [CountryListComponent],
  templateUrl: './by-region-page.component.html',
})
export class ByRegionPageComponent {
  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  activatedRouter = inject(ActivatedRoute);
  router = inject(Router);
  queryParam = this.activatedRouter.snapshot.queryParamMap.get('query') ?? '';

  seletedRegion = linkedSignal<Region|null>(() => validateQueryParam(this.queryParam));

  selectRegion(region:Region){
    this.seletedRegion.set(region);
  }

  countryService = inject(CountryService);

  countryResource = rxResource({
    request: () => ({query: this.seletedRegion()}),
    loader: ({request}) => {
      if(!request.query) return of([]);
      this.router.navigate(['/country/by-region'],{
        queryParams: {query: request.query},
      })
      return this.countryService.searchByRegion(request.query)
    }
  })
}
