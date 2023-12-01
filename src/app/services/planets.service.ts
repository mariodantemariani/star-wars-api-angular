import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlanetsService {
  private baseUrl: string = 'https://swapi.dev/api';
  private resourcePlanets: string = '/planets';

  constructor(private http: HttpClient) {}

  getPlanets(): Observable<any> {
    const requestUrl = `${this.baseUrl}${this.resourcePlanets}`;
    return this.http.get<any>(requestUrl);
  }

  getPlanetsByPage(page: number): Observable<any> {
    const requestUrl = `${this.baseUrl}${this.resourcePlanets}?page=${page}`;
    return this.http.get<any>(requestUrl);
  }
}
