import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px;">
      <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">Historial de Ventas 🧾</h2>

      <div style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          
          <thead style="background-color: #f8f9fa; border-bottom: 2px solid #eee;">
            <tr>
              <th style="padding: 15px; color: #333; font-size: 14px;">N° Transacción</th>
              <th style="padding: 15px; color: #333; font-size: 14px;">Código</th>
              <th style="padding: 15px; color: #333; font-size: 14px;">Producto</th>
              <th style="padding: 15px; color: #333; font-size: 14px;">Cant.</th>
              <th style="padding: 15px; color: #333; font-size: 14px;">Precio Unit.</th>
              <th style="padding: 15px; color: #333; font-size: 14px;">Total Ingreso</th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let venta of ventas" style="border-bottom: 1px solid #eee; transition: 0.2s;">
              <td style="padding: 15px; color: #666; font-weight: bold;">#{{ venta.id_movimiento }}</td>
              <td style="padding: 15px; color: #666;">{{ venta.codigo_barra }}</td>
              <td style="padding: 15px; color: #000; font-weight: bold;">{{ venta.nombre_producto }}</td>
              <td style="padding: 15px; color: #000;">{{ venta.cantidad }}</td>
              <td style="padding: 15px; color: #000;">\${{ venta.precio_unitario }}</td>
              <td style="padding: 15px; color: #28a745; font-weight: bold;">\${{ venta.total }}</td>
            </tr>
            
            <tr *ngIf="ventas.length === 0">
              <td colspan="6" style="padding: 30px; text-align: center; color: #999;">
                No hay ventas registradas aún.
              </td>
            </tr>
          </tbody>
          
        </table>
      </div>
    </div>
  `
})
export class Historial implements OnInit {
  ventas: any[] = [];
  cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    fetch('http://127.0.0.1:8000/api/ventas/historial')
      .then(respuesta => respuesta.json())
      .then(datos => {
        this.ventas = datos;
        this.cdr.detectChanges();
      })
      .catch(error => console.error("Error cargando historial:", error));
  }
}