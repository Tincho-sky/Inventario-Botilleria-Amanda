import psycopg2

try:
    # 1. Establecer los parámetros de conexión
    conexion = psycopg2.connect(
        host="localhost",
        port="5432",
        database="botilleria_amanda",
        user="postgres",
        password="TU_CONTRASEÑA_AQUI"  # <--- Reemplaza esto con tu clave
    )
    
    # 2. Crear un cursor (es el "vehículo" que lleva las consultas a la base de datos)
    cursor = conexion.cursor()
    
    # 3. Ejecutar una consulta de prueba (pedimos la versión de PostgreSQL)
    cursor.execute("SELECT version();")
    version = cursor.fetchone()
    
    # 4. Mostrar el resultado
    print("========================================")
    print("¡CONEXIÓN EXITOSA! 🎉")
    print("Estás conectado a la base de datos Botillería Amanda.")
    print(f"Versión del servidor: {version[0]}")
    print("========================================")
    
    # 5. Cerrar la conexión para no dejarla colgada
    cursor.close()
    conexion.close()

except Exception as error:
    print("❌ Oh no, ocurrió un error al intentar conectar:")
    print(error)