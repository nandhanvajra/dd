import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:7000';

  constructor(private http: HttpClient) {}

  addProduct(product: Product): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/addproduct`, product);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/getallproducts`);
  }
}
