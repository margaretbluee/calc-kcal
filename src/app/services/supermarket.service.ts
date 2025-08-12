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
interface Supermarket {
  id: number;
  name: string;
  supermarketProducts: any;
}

export interface ISuperMarketProducts  {
  $id: string;
  $values: any[]
}

export interface Product {
  $id: string;
  id: number;
  name: string;
  price: number;
  imageBase64: string;
  discount: boolean;
  category: string;
  kcal: number | null;
  supermarketProducts: ISuperMarketProducts
}

export interface PagedResult<T> {
  $id: string,
  totalCount: number;
  items:{
    $id: string,
    $values:    T[];
  }
}
@Injectable({
  providedIn: 'root'
})
export class SupermarketService {
  private readonly apiUrl = 'http://localhost:5000/api/supermarkets';

  constructor(private http: HttpClient) {}

  getSupermarkets(): Observable<Supermarket[]> {
    return this.http.get<{ $id: string; $values: Supermarket[] }>(this.apiUrl).pipe(
      map(response => response.$values)
    );
  }

    // Used by SupermarketSelectionScreenComponent
  getSupermarketNames(): Observable<string[]> {
    return this.getSupermarkets().pipe(
      map(supermarkets => supermarkets.map(market => market.name))
    );
  }

getProductsBySupermarket(
  supermarketId: number,
  page: number,
  pageSize: number,
  category?: string | null,
  priceMin?: number | null,
  priceMax?: number | null,
  kcalMin?: number | null,
  kcalMax?: number | null,
  sortBy?: string
): Observable<PagedResult<Product>> {
  const params: any = { page, pageSize };
  if (category) params.category = category;
  if (priceMin !== null) params.priceMin = priceMin;
  if (priceMax !== null) params.priceMax = priceMax;
  if (kcalMin !== null) params.kcalMin = kcalMin;
  if (kcalMax !== null) params.kcalMax = kcalMax;
  if (sortBy) params.sortBy = sortBy;

  return this.http.get<PagedResult<Product>>(
    `${this.apiUrl}/${supermarketId}/products`,
    { params }
  );
}

getProductsByCategory(
  category: string,
  page: number,
  pageSize: number,
  priceMin?: number | null,
  priceMax?: number | null,
  kcalMin?: number | null,
  kcalMax?: number | null,
  sortBy?: string
): Observable<PagedResult<Product>> {
  const params: any = {
    page,
    pageSize,
    category,
    sortBy
  };
  if (priceMin !== null) params.priceMin = priceMin;
  if (priceMax !== null) params.priceMax = priceMax;
  if (kcalMin !== null) params.kcalMin = kcalMin;
  if (kcalMax !== null) params.kcalMax = kcalMax;

  return this.http.get<PagedResult<Product>>(
    `${this.apiUrl}/products-by-category`,
    { params }
  );
}

 
}