import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { map, Observable, catchError, throwError, delay, of, tap } from 'rxjs';
import type { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';
import { Region } from '../interfaces/region.type';

const API_URL = 'https://restcountries.com/v3.1'

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<Region, Country[]>();

  searchByCapital(query:string): Observable<Country[]> {
    query = query.toLowerCase();
    if(this.queryCacheCapital.has(query)){
      return of(this.queryCacheCapital.get(query) ?? []);
    }
    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`)
    .pipe(
      map(resp => CountryMapper.mapRestCountryArrayToCountryArray(resp) ),
      tap(countries => this.queryCacheCapital.set(query, countries)),
      catchError(error => {
        return throwError(() =>  new Error ('Error al buscar capitales'));
      })
    );
  }

  searchByCountry(query:string): Observable<Country[]> {
    query = query.toLowerCase();
    if(this.queryCacheCountry.has(query)) return of(this.queryCacheCountry.get(query) ?? []).pipe(delay(200));
    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`)
    .pipe(
      map(resp => CountryMapper.mapRestCountryArrayToCountryArray(resp) ),
      tap(countries => this.queryCacheCountry.set(query, countries)),
      catchError(error => {
        return throwError(() =>  new Error ('Error al buscar países'));
      }
    ))
  }

  searchByRegion(region:Region): Observable<Country[]> {
    if(this.queryCacheRegion.has(region)) return of(this.queryCacheRegion.get(region) ?? []).pipe(delay(200));
    return this.http.get<RESTCountry[]>(`${API_URL}/region/${region}`)
    .pipe(
      map(resp => CountryMapper.mapRestCountryArrayToCountryArray(resp) ),
      tap(countries => this.queryCacheRegion.set(region, countries)),
      catchError(error => {
        return throwError(() =>  new Error ('Error al buscar una region'));
      }
    ))
  }

  searchCountryByCode(code:string): Observable<Country | undefined> {
    return this.http.get<RESTCountry[]>(`${API_URL}/alpha/${code}`)
    .pipe(
      map(resp => CountryMapper.mapRestCountryArrayToCountryArray(resp) ),
      map(countries => countries.at(0)),
      catchError(error => {
        return throwError(() =>  new Error ('Error al buscar países'));
      }
    ))
  }
}
