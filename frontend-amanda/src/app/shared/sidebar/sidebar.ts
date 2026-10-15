import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div style="padding: 20px; display: flex; flex-direction: column; height: 100%;">
      <h2 style="margin-top: 0; font-size: 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 15px;">Botillería Amanda</h2>
      
      <div style="color: #a8bbaa; font-size: 11px; text-transform: uppercase; font-weight: bold; margin-top: 15px; margin-bottom: 10px;">Principal</div>
      <ul style="list-style: none; padding: 0; margin: 0; line-height: 2.2; cursor: pointer;">
        <li routerLink="/dashboard" style="padding: 8px; border-radius: 5px; margin-bottom: 5px;">🏠 Dashboard</li>
        <li routerLink="/caja" style="padding: 8px; border-radius: 5px; margin-bottom: 5px;">🛒 Caja (POS)</li>
      </ul>

      <div style="color: #a8bbaa; font-size: 11px; text-transform: uppercase; font-weight: bold; margin-top: 25px; margin-bottom: 10px;">Administración</div>
      <ul style="list-style: none; padding: 0; margin: 0; line-height: 2.2; cursor: pointer;">
        <li routerLink="/inventario" style="padding: 8px; border-radius: 5px; margin-bottom: 5px;">📦 Inventario</li>
        <li routerLink="/historial" style="padding: 8px; border-radius: 5px; margin-bottom: 5px;">🧾 Historial de Ventas</li>
        <li style="padding: 8px; border-radius: 5px; margin-bottom: 5px; opacity: 0.5;">🚚 Proveedores</li>
      </ul>

      <div style="color: #a8bbaa; font-size: 11px; text-transform: uppercase; font-weight: bold; margin-top: 25px; margin-bottom: 10px;">Sistema</div>
      <ul style="list-style: none; padding: 0; margin: 0; line-height: 2.2; cursor: pointer;">
        <li style="padding: 8px; border-radius: 5px; margin-bottom: 5px; opacity: 0.5;">👥 Usuarios y Roles</li>
        <li style="padding: 8px; border-radius: 5px; margin-bottom: 5px; opacity: 0.5;">⚙️ Configuración</li>
      </ul>
      
      <div style="margin-top: auto; padding-top: 20px; font-size: 12px; color: #a8bbaa; text-align: center;">
        Versión 1.0.0
      </div>
    </div>
  `
})
export class Sidebar {}