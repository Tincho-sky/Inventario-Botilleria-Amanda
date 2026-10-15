import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="display: flex; gap: 20px; padding: 20px;">
      
      <!-- PANEL IZQUIERDO: Buscador y Catálogo -->
      <div style="flex: 1; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="margin-top: 0;">Nueva venta</h2>
        
        <!-- Buscador / Pistola de Código de Barras -->
        <div style="position: relative; margin-bottom: 20px;">
          <input type="text" #inputCodigo 
                 (keyup.enter)="buscarProducto(inputCodigo.value); inputCodigo.value=''"
                 placeholder="Buscar producto o escanear código de barras (Ej: 7801234567890)..." 
                 style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;">
        </div>

        <div *ngIf="mensajeError" style="color: red; margin-bottom: 15px; font-weight: bold;">
          {{ mensajeError }}
        </div>

        <!-- Catálogo Visual -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
          <div *ngFor="let prod of catalogo" 
               (click)="agregarAlCarrito(prod)"
               style="border: 1px solid #eee; padding: 15px; border-radius: 8px; text-align: center; cursor: pointer; transition: 0.2s;">
            <div style="font-size: 24px; margin-bottom: 10px;">🍺</div>
            <div style="font-weight: bold; font-size: 14px;">{{ prod.nombre_producto }}</div>
            <div style="color: #666; font-size: 12px;">Stock disponible: {{ prod.stock }}</div>
            <div style="color: #0b4a35; font-weight: bold; margin-top: 5px;">\${{ prod.precio }}</div>
          </div>
        </div>
      </div>

      <!-- PANEL DERECHO: Carrito de Compras -->
      <div style="width: 350px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; flex-direction: column;">
        <h3 style="margin-top: 0;">Carrito de venta</h3>
        
        <div style="flex-grow: 1; overflow-y: auto; min-height: 200px;">
          <div *ngFor="let item of carrito; let i = index" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <div style="flex: 2;">
              <div style="font-weight: bold; font-size: 14px;">{{ item.nombre_producto }}</div>
              <div style="color: #666; font-size: 12px;">\${{ item.precio }} x {{ item.cantidad }}</div>
            </div>
            <div style="flex: 1; text-align: right; font-weight: bold;">
              \${{ item.precio * item.cantidad }}
            </div>
            <button (click)="eliminarDelCarrito(i)" style="background: none; border: none; color: red; cursor: pointer; font-size: 16px; margin-left: 10px;">🗑️</button>
          </div>
          
          <div *ngIf="carrito.length === 0" style="text-align: center; color: #999; margin-top: 50px;">
            El carrito está vacío
          </div>
        </div>

        <!-- Total y Botón de Pago -->
        <div style="border-top: 2px solid #eee; padding-top: 15px; margin-top: 15px;">
          <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; margin-bottom: 20px;">
            <span>Total de la venta</span>
            <span style="color: #0b4a35;">\${{ total }}</span>
          </div>

          <button (click)="finalizarVenta()" 
                  [disabled]="carrito.length === 0"
                  style="width: 100%; padding: 15px; background: #28a745; color: white; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;"
                  [style.opacity]="carrito.length === 0 ? '0.5' : '1'">
            Confirmar Venta
          </button>
          
          <div style="margin-top: 15px; text-align: center; font-weight: bold; color: #0b4a35;">
            {{ mensajeExito }}
          </div>
        </div>
      </div>
      
    </div>
  `
})
export class Caja implements OnInit {
  http = inject(HttpClient);
  
  catalogo: any[] = [];
  carrito: any[] = [];
  total: number = 0;
  mensajeError = '';
  mensajeExito = '';

  // 1. Al abrir la pantalla, pedimos los productos a Python
  ngOnInit() {
    this.http.get('http://127.0.0.1:8000/api/productos').subscribe((data: any) => {
      this.catalogo = data;
    });
  }

  // 2. Simulador del lector de Código de Barras
  buscarProducto(codigoBarra: string) {
    this.mensajeError = '';
    this.mensajeExito = '';
    const productoEncontrado = this.catalogo.find(p => p.codigo_barra === codigoBarra);
    
    if (productoEncontrado) {
      this.agregarAlCarrito(productoEncontrado);
    } else {
      this.mensajeError = '❌ Producto no encontrado en el catálogo.';
    }
  }

  // 3. Lógica del carrito
  agregarAlCarrito(producto: any) {
    this.mensajeExito = '';
    this.mensajeError = '';
    const itemExistente = this.carrito.find(item => item.id_producto === producto.id_producto);
    
    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }
    this.calcularTotal();
  }

  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  }

  // 4. Enviar a la base de datos
  finalizarVenta() {
    this.mensajeExito = 'Procesando en PostgreSQL...';
    let exitos = 0;
    
    // Recorremos el carrito y enviamos cada producto a nuestra API
    this.carrito.forEach(item => {
      const venta = { id_producto: item.id_producto, cantidad: item.cantidad };
      
      this.http.post('http://127.0.0.1:8000/api/ventas', venta).subscribe({
        next: () => {
          exitos++;
          if (exitos === this.carrito.length) {
            this.mensajeExito = '✅ Venta registrada con éxito en la BD';
            this.carrito = [];
            this.calcularTotal();
            this.ngOnInit(); // Recargar el stock visual
          }
        },
        error: () => {
          this.mensajeError = '❌ Error de integridad en la BD.';
        }
      });
    });
  }
}