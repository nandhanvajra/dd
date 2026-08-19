import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  product: Product = {
    pid: null,
    pname: '',
    price: null,
    brand: ''
  };

  isSubmitting = false;

  constructor(private productService: ProductService) {}

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.isSubmitting = true;

    this.productService.addProduct(this.product).subscribe({
      next: (response) => {
        alert('Product added successfully!');
        this.isSubmitting = false;
        form.resetForm();
        this.product = {
          pid: null,
          pname: '',
          price: null,
          brand: ''
        };
      },
      error: (err) => {
        console.error('Error adding product:', err);
        alert(err.error?.error || 'Failed to add product. Please check backend connection.');
        this.isSubmitting = false;
      }
    });
  }
}
