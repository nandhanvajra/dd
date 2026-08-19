import { Routes } from '@angular/router';
import { AddProductComponent } from './components/add-product/add-product.component';
import { DisplayProductComponent } from './components/display-product/display-product.component';

export const routes: Routes = [
  { path: '', redirectTo: 'addProduct', pathMatch: 'full' },
  { path: 'addProduct', component: AddProductComponent },
  { path: 'addproduct', component: AddProductComponent },
  { path: 'displayProduct', component: DisplayProductComponent },
  { path: 'displayproduct', component: DisplayProductComponent },
  { path: '**', redirectTo: 'addProduct' }
];
