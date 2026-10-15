import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px;">
      
      <!-- CABECERA -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="margin: 0; color: white;">{{ mostrarFormulario ? 'Registrar producto' : 'Inventario 📦' }}</h2>
        
        <!-- Botón dinámico: Cambia entre "+ Agregar" y "Volver" -->
        <button (click)="alternarVista()" 
                style="padding: 10px 20px; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;"
                [ngStyle]="{'background-color': mostrarFormulario ? '#666' : '#28a745'}">
          {{ mostrarFormulario ? 'Volver al listado' : '+ Agregar producto' }}
        </button>
      </div>

      <!-- VISTA 1: LA TABLA DE INVENTARIO (Se oculta si mostrarFormulario es true) -->
      <div *ngIf="!mostrarFormulario" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead style="background-color: #f8f9fa; border-bottom: 2px solid #eee;">
            <tr>
              <th style="padding: 15px; color: #333;">Código</th>
              <th style="padding: 15px; color: #333;">Nombre</th>
              <th style="padding: 15px; color: #333;">Costo</th>
              <th style="padding: 15px; color: #333;">Precio</th>
              <th style="padding: 15px; color: #333;">Stock</th>
              <th style="padding: 15px; color: #333;">Mínimo</th>
              <th style="padding: 15px; color: #333;">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let prod of productos" style="border-bottom: 1px solid #eee;">
              <td style="padding: 15px; color: #000;">{{ prod.codigo_barra }}</td>
              <td style="padding: 15px; color: #000; font-weight: bold;">{{ prod.nombre_producto }}</td>
              <td style="padding: 15px; color: #000;">\${{ prod.precio_compra }}</td>
              <td style="padding: 15px; color: #000;">\${{ prod.precio }}</td>
              <td style="padding: 15px; color: #000; font-weight: bold;">{{ prod.stock }}</td>
              <td style="padding: 15px; color: #666;">{{ prod.stock_minimo }}</td>
              <td style="padding: 15px;">
                <span [ngStyle]="{'background-color': getEstado(prod.stock, prod.stock_minimo).fondo, 'color': getEstado(prod.stock, prod.stock_minimo).texto}" 
                      style="padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                  {{ getEstado(prod.stock, prod.stock_minimo).etiqueta }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- VISTA 2: EL FORMULARIO DE REGISTRO -->
      <div *ngIf="mostrarFormulario" style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 600px;">
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div>
            <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333;">Nombre del producto</label>
            <input type="text" #nombre style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
          </div>
          <div>
            <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333;">Código de barras</label>
            <input type="text" #codigo style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
          </div>
          <div>
            <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333;">Precio de compra</label>
            <input type="number" #compra style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
          </div>
          <div>
            <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333;">Precio de venta</label>
            <input type="number" #venta style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
          </div>
          <div>
            <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333;">Stock inicial</label>
            <input type="number" #stock style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
          </div>
          <div>
            <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333;">Stock mínimo (Alerta)</label>
            <input type="number" #minimo style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
          </div>
        </div>

        <button (click)="guardarProducto(codigo.value, nombre.value, compra.value, venta.value, stock.value, minimo.value)" 
                style="width: 100%; padding: 12px; background: #0b4a35; color: white; border: none; border-radius: 5px; font-weight: bold; font-size: 16px; cursor: pointer;">
          💾 Guardar Producto
        </button>

        <div *ngIf="mensajeGuardado" style="margin-top: 15px; text-align: center; font-weight: bold; color: #28a745;">
          {{ mensajeGuardado }}
        </div>
      </div>

    </div>
  `
})
export class Inventario implements OnInit {
  productos: any[] = [];
  mostrarFormulario: boolean = false;
  mensajeGuardado: string = '';
  cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    fetch('http://127.0.0.1:8000/api/productos')
      .then(respuesta => respuesta.json())
      .then(datos => {
        this.productos = datos;
        this.cdr.detectChanges();
      });
  }

  alternarVista() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.mensajeGuardado = ''; // Limpiamos el mensaje al cambiar de pantalla
  }

  guardarProducto(codigo: string, nombre: string, compra: string, venta: string, stock: string, minimo: string) {
    this.mensajeGuardado = 'Guardando...';

    const nuevoProducto = {
      codigo_barra: codigo,
      nombre_producto: nombre,
      precio_compra: parseInt(compra),
      precio_venta: parseInt(venta),
      stock_actual: parseInt(stock),
      stock_minimo: parseInt(minimo)
    };

    fetch('http://127.0.0.1:8000/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProducto)
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
      this.mensajeGuardado = '✅ ' + datos.mensaje;
      this.cargarDatos(); // Recargamos la tabla en segundo plano
      
      // Esperamos 1.5 segundos y volvemos a la tabla automáticamente
      setTimeout(() => {
        this.alternarVista();
        this.cdr.detectChanges();
      }, 1500);
    })
    .catch(error => {
      this.mensajeGuardado = '❌ Error al guardar';
      console.error(error);
    });
  }

  getEstado(stock: number, minimo: number) {
    if (stock <= 0) return { etiqueta: '🔴 Agotado', fondo: '#ffe5e5', texto: '#d32f2f' };
    if (stock <= minimo) return { etiqueta: '🟠 Stock bajo', fondo: '#fff4e5', texto: '#ed6c02' };
    return { etiqueta: '🟢 Disponible', fondo: '#e8f5e9', texto: '#2e7d32' };
  }
}