from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2

app = FastAPI(
    title="API Botillería Amanda",
    description="Backend para la gestión de inventario y ventas",
    version="1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"], # Permitimos a Angular
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de la conexión a PostgreSQL
def obtener_conexion():
    return psycopg2.connect(
        host="localhost",
        port="5432",
        database="botilleria_amanda",
        user="postgres",
        password="423Volei.423"
    )

# Estructura de datos que esperamos recibir desde Angular para una venta
class VentaRequest(BaseModel):
    id_producto: int
    cantidad: int

class ProductoNuevo(BaseModel):
    codigo_barra: str
    nombre_producto: str
    precio_compra: int
    precio_venta: int
    stock_actual: int
    stock_minimo: int

@app.post("/api/ventas", status_code=201)
def registrar_venta_api(venta: VentaRequest):
    conexion = None
    cursor = None
    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()

        # 1. Registrar el movimiento (SALIDA)
        sql_movimiento = """
            INSERT INTO movimiento_inventario (id_producto, tipo, cantidad) 
            VALUES (%s, 'SALIDA', %s);
        """
        cursor.execute(sql_movimiento, (venta.id_producto, venta.cantidad))

        # 2. Descontar el stock del producto
        sql_stock = """"
            UPDATE producto 
            SET stock_actual = stock_actual - %s 
            WHERE id_producto = %s;
        """
        cursor.execute(sql_stock, (venta.cantidad, venta.id_producto))

        # 3. Confirmar transacción ACID
        conexion.commit()
        return {"mensaje": "Venta registrada con éxito", "producto_id": venta.id_producto, "cantidad_vendida": venta.cantidad}

    except Exception as error:
        if conexion:
            conexion.rollback()
        raise HTTPException(status_code=500, detail=f"Error en la transacción: {str(error)}")

    finally:
        if conexion:
            cursor.close()
            conexion.close()
@app.get("/api/productos")
def obtener_productos():
    conexion = None
    cursor = None
    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        
        # Consulta SQL corregida y directa
        sql = """
            SELECT id_producto, codigo_barra, nombre_producto, 
                   precio_compra, precio_venta, stock_actual, stock_minimo 
            FROM producto
        """
        cursor.execute(sql)
        filas = cursor.fetchall()
        
        print(f"DEBUG BACKEND: PostgreSQL encontró {len(filas)} productos") # Para la terminal
        
        productos = []
        for fila in filas:
            productos.append({
                "id_producto": fila[0],
                "codigo_barra": fila[1],
                "nombre_producto": fila[2],
                "precio_compra": fila[3],
                "precio": fila[4], 
                "stock": fila[5],
                "stock_minimo": fila[6]
            })
            
        return productos
        
    except Exception as error:
        print(f"ERROR EN BACKEND: {str(error)}") # Para la terminal
        # Si hay error en la BD, se lo avisamos a Angular para que no muestre un [] vacío
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(error)}")
        
    finally:
        if conexion:
            cursor.close()
            conexion.close()

@app.post("/api/productos")
def agregar_producto(producto: ProductoNuevo):
    conexion = None
    cursor = None
    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        
        # Insertamos el producto en PostgreSQL
        sql = """
            INSERT INTO producto 
            (id_categoria, id_proveedor, id_marca, codigo_barra, nombre_producto, 
             precio_compra, precio_venta, stock_actual, stock_minimo) 
            VALUES (1, 1, 1, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (
            producto.codigo_barra, 
            producto.nombre_producto, 
            producto.precio_compra, 
            producto.precio_venta, 
            producto.stock_actual, 
            producto.stock_minimo
        ))
        
        conexion.commit() # Confirmamos que se guarde
        return {"mensaje": "Producto guardado exitosamente en el inventario"}
        
    except Exception as error:
        if conexion:
            conexion.rollback() # Si algo falla, cancelamos para no dañar la BD
        raise HTTPException(status_code=500, detail=f"Error al guardar producto: {str(error)}")
        
    finally:
        if conexion:
            cursor.close()
            conexion.close()
@app.get("/api/dashboard/resumen")
def obtener_resumen_dashboard():
    conexion = None
    cursor = None
    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        
        # 1. Total vendido 
        # AHORA BUSCAMOS 'SALIDA' EXACTAMENTE COMO LO GUARDA TU API DE VENTAS
        sql_ventas = """
            SELECT SUM(m.cantidad * p.precio_venta) as total_ventas, COUNT(m.id_movimiento) as total_transacciones
            FROM movimiento_inventario m
            JOIN producto p ON m.id_producto = p.id_producto
            WHERE m.tipo = 'SALIDA'
        """
        cursor.execute(sql_ventas)
        res_ventas = cursor.fetchone()
        
        total_ventas = res_ventas[0] if res_ventas[0] else 0
        total_transacciones = res_ventas[1] if res_ventas[1] else 0
        
        # 2. Total de productos y alertas
        sql_inventario = """
            SELECT COUNT(id_producto) as total_productos, 
                   SUM(CASE WHEN stock_actual <= stock_minimo THEN 1 ELSE 0 END) as productos_alerta
            FROM producto
        """
        cursor.execute(sql_inventario)
        res_inv = cursor.fetchone()
        
        return {
            "ingresos_totales": total_ventas,
            "transacciones": total_transacciones,
            "total_productos": res_inv[0],
            "alertas_stock": res_inv[1]
        }
        
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error en dashboard: {str(error)}")
        
    finally:
        if conexion:
            cursor.close()
            conexion.close()

@app.get("/api/ventas/historial")
def obtener_historial():
    conexion = None
    cursor = None
    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        
        # Cruzamos los movimientos (SALIDA) con los productos
        sql = """
            SELECT m.id_movimiento, p.codigo_barra, p.nombre_producto, 
                   m.cantidad, p.precio_venta, (m.cantidad * p.precio_venta) as total
            FROM movimiento_inventario m
            JOIN producto p ON m.id_producto = p.id_producto
            WHERE m.tipo = 'SALIDA'
            ORDER BY m.id_movimiento DESC
        """
        cursor.execute(sql)
        filas = cursor.fetchall()
        
        historial = []
        for fila in filas:
            historial.append({
                "id_movimiento": fila[0],
                "codigo_barra": fila[1],
                "nombre_producto": fila[2],
                "cantidad": fila[3],
                "precio_unitario": fila[4],
                "total": fila[5]
            })
            
        return historial
        
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al obtener historial: {str(error)}")
        
    finally:
        if conexion:
            cursor.close()
            conexion.close()