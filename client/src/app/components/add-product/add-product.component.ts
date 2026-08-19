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

  isProductValid(): boolean {
    return Number.isInteger(this.product.pid) && (this.product.pid as number) > 0 &&
      typeof this.product.pname === 'string' && this.product.pname.trim().length > 0 &&
      Number.isFinite(this.product.price) && (this.product.price as number) >= 0 &&
      typeof this.product.brand === 'string' && this.product.brand.trim().length > 0;
  }

  preventInvalidNumberKey(event: KeyboardEvent, allowDecimal = false): void {
    const navigationKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (navigationKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    if (/^\d$/.test(event.key)) {
      return;
    }

    const input = event.target as HTMLInputElement;
    if (allowDecimal && event.key === '.' && !input.value.includes('.')) {
      return;
    }

    event.preventDefault();
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || !this.isProductValid()) {
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
