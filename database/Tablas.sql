
-- 1. Tabla USUARIO
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL
);

-- 2. Tabla MARCA
CREATE TABLE marca (
    id_marca SERIAL PRIMARY KEY,
    nombre_marca VARCHAR(100) NOT NULL
);

-- 3. Tabla CATEGORIA
CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(50) NOT NULL,
    pasillo_ubicacion VARCHAR(50)
);

-- 4. Tabla PROVEEDOR
CREATE TABLE proveedor (
    id_proveedor SERIAL PRIMARY KEY,
    rut VARCHAR(12) UNIQUE NOT NULL,
    razon_social VARCHAR(100) NOT NULL,
    dia_visita_vendedor VARCHAR(20)
);

-- 5. Tabla PRODUCTO 
CREATE TABLE producto (
    id_producto SERIAL PRIMARY KEY,
    id_categoria INTEGER NOT NULL,
    id_proveedor INTEGER NOT NULL,
    id_marca INTEGER NOT NULL,
    codigo_barra VARCHAR(50) UNIQUE NOT NULL,
    nombre_producto VARCHAR(100) NOT NULL,
    precio INTEGER NOT NULL,
    stock_actual INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 5,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
    FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor),
    FOREIGN KEY (id_marca) REFERENCES marca(id_marca)
);

-- 6. Tabla MOVIMIENTO_INVENTARIO 
CREATE TABLE movimiento_inventario (
    id_movimiento SERIAL PRIMARY KEY,
    id_producto INTEGER NOT NULL,
    tipo VARCHAR(10) NOT NULL, 
    cantidad INTEGER NOT NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);