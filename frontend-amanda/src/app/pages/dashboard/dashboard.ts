import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px;">
      
      <div style="margin-bottom: 25px;">
        <h2 style="margin: 0; color: #333; font-size: 24px;">Panel principal</h2>
        <h1 style="margin: 5px 0 0 0; color: #0b4a35;">Buenos días, Admin</h1>
      </div>

      <!-- TARJETAS DE INDICADORES (KPIs) -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px;">
        
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="color: #666; font-size: 14px; margin-bottom: 10px;">Ventas totales</div>
          <div style="font-size: 28px; font-weight: bold; color: #333;">\${{ resumen.ingresos_totales }}</div>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="color: #666; font-size: 14px; margin-bottom: 10px;">Transacciones</div>
          <div style="font-size: 28px; font-weight: bold; color: #333;">{{ resumen.transacciones }}</div>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="color: #666; font-size: 14px; margin-bottom: 10px;">Productos listados</div>
          <div style="font-size: 28px; font-weight: bold; color: #333;">{{ resumen.total_productos }}</div>
        </div>

        <div style="background: #fff4e5; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid #ffcc80;">
          <div style="color: #ed6c02; font-size: 14px; margin-bottom: 10px; font-weight: bold;">⚠️ Alertas de Stock</div>
          <div style="font-size: 28px; font-weight: bold; color: #ed6c02;">{{ resumen.alertas_stock }}</div>
        </div>

      </div>

      <div *ngIf="cargando" style="text-align: center; color: #666; font-weight: bold;">
        Calculando métricas...
      </div>

    </div>
  `
})
export class Dashboard implements OnInit {
  resumen: any = {
    ingresos_totales: 0,
    transacciones: 0,
    total_productos: 0,
    alertas_stock: 0
  };
  cargando = true;
  cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    fetch('http://127.0.0.1:8000/api/dashboard/resumen')
      .then(respuesta => respuesta.json())
      .then(datos => {
        this.resumen = datos;
        this.cargando = false;
        this.cdr.detectChanges();
      })
      .catch(error => {
        console.error("Error cargando dashboard:", error);
        this.cargando = false;
        this.cdr.detectChanges();
      });
  }
}