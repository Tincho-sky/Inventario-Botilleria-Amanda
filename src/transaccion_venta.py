import psycopg2

def registrar_venta(id_producto, cantidad):
    try:
        # 1. Conectar a la base de datos
        conexion = psycopg2.connect(
            host="localhost",
            port="5432",
            database="botilleria_amanda",
            user="postgres",
            password="TU_CONTRASEÑA_AQUI" # Reemplaza con tu clave
        )
        cursor = conexion.cursor()

        print(f"Iniciando transacción para vender {cantidad} unidad(es) del producto ID {id_producto}...")

        # 2. Paso A: Registrar el movimiento (SALIDA)
        sql_movimiento = """
            INSERT INTO movimiento_inventario (id_producto, tipo, cantidad) 
            VALUES (%s, 'SALIDA', %s);
        """
        cursor.execute(sql_movimiento, (id_producto, cantidad))

        # 3. Paso B: Descontar el stock del producto
        sql_stock = """
            UPDATE producto 
            SET stock_actual = stock_actual - %s 
            WHERE id_producto = %s;
        """
        cursor.execute(sql_stock, (cantidad, id_producto))

        # 4. CONFIRMAR TRANSACCIÓN: Si ambos pasos funcionaron, guardamos los cambios
        conexion.commit()
        print("✅ Venta registrada y stock actualizado correctamente.")

    except Exception as error:
        # 5. REVERTIR TRANSACCIÓN: Si hubo cualquier error, deshacemos todo
        if 'conexion' in locals():
            conexion.rollback()
        print("❌ Error en la transacción. Se han deshecho los cambios para evitar descuadres.")
        print(f"Detalle del error: {error}")

    finally:
        # 6. Siempre cerramos la conexión al terminar
        if 'conexion' in locals():
            cursor.close()
            conexion.close()

# --- Zona de Prueba ---
# Para que esto funcione, primero debemos tener productos ingresados en la base de datos.
# registrar_venta(id_producto=1, cantidad=2)