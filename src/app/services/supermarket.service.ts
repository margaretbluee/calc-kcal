import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

interface SupermarketResponse {
  $id: string;
  $values: Array<{
    id: number;
    name: string;
    supermarketProducts: any;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class SupermarketService {
  private readonly apiUrl = 'http://localhost:5000/api/supermarkets';

  constructor(private http: HttpClient) {}

  getSupermarkets(): Observable<string[]> {
    return this.http.get<SupermarketResponse>(this.apiUrl).pipe(
      map(response => response.$values.map(item => item.name))
    );
  }
}