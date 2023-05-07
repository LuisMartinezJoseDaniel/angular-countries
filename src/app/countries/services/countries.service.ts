import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';
import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cacheStore.interface';
import { Region } from '../interfaces/region.type';

@Injectable({ providedIn: 'root' })
export class CountriesService {
  public apiUrl: string = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital: {
      term: '',
      countries: [],
    },
    byCountries: {
      term: '',
      countries: [],
    },
    byRegion: {
      region: '',
      countries: [],
    },
  };

  constructor(private httpClient: HttpClient) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage() {
    if (!localStorage.getItem('cacheStore')) return;
    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!);
  }

  private getCountriesRequest(url: string): Observable<Country[]> {
    return this.httpClient.get<Country[]>(url).pipe(
      catchError(() => of([])) // en caso de error retorna un Obserbable de []
      // delay(2000) // Esperar 2s (utiliazado para probar un loading)
    );
  }

  searchCountryByAlphaCode(code: string): Observable<Country | null> {
    const url = `${this.apiUrl}/alpha/${code}`;
    return this.httpClient.get<Country[]>(url).pipe(
      //Transformar la respuesta, si es mayor a cero retornar el primero si no retorna null
      map((countries) => (countries.length > 0 ? countries[0] : null)),
      catchError(() => of(null)) //En caso de error retornar Observable<null>
    );
  }

  searchCapital(q: string): Observable<Country[]> {
    const url = `${this.apiUrl}/capital/${q}`;
    return this.getCountriesRequest(url).pipe(
      //tap No modifica la data del observable, en este caso solo se usa para asignar al cacheStore
      tap((countries) => (this.cacheStore.byCapital = { term: q, countries })),
      tap((countries) => this.saveToLocalStorage()) //guardar en local storage
    );
  }

  searchCountry(country: string): Observable<Country[]> {
    const url = `${this.apiUrl}/name/${country}`;

    return this.getCountriesRequest(url).pipe(
      // asignar al cache store
      tap(
        (countries) =>
          (this.cacheStore.byCountries = { term: country, countries })
      ),
      tap((countries) => this.saveToLocalStorage())
    );
  }
  searchRegion(region: Region): Observable<Country[]> {
    const url = `${this.apiUrl}/region/${region}`;

    return this.getCountriesRequest(url).pipe(
      tap((countries) => (this.cacheStore.byRegion = { region, countries })),
      tap((countries) => this.saveToLocalStorage())
    );
  }
}
