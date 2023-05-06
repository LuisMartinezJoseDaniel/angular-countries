import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Country } from '../interfaces/country';

@Injectable({ providedIn: 'root' })
export class CountriesService {
  public apiUrl: string = 'https://restcountries.com/v3.1';

  constructor(private httpClient: HttpClient) {}

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
    return (
      this.httpClient
        .get<Country[]>(url)
        // pipe(recibe elementos rxjs y se encadenan)
        // tap((countries) => console.log('Paso por tap', countries)),
        // map((countries) => []) // ->transforma la respuesta y retorna siempre un arreglo vacio
        .pipe(
          catchError((error) => of([])) // en caso de error of -> retorna un Observable con un arreglo vacio
        )
    );
  }

  searchCountry(country: string): Observable<Country[]> {
    const url = `${this.apiUrl}/name/${country}`;

    return this.httpClient.get<Country[]>(url).pipe(catchError(() => of([])));
  }
  searchRegion(region: string): Observable<Country[]> {
    const url = `${this.apiUrl}/region/${region}`;

    return this.httpClient.get<Country[]>(url).pipe(catchError(() => of([])));
  }
}
