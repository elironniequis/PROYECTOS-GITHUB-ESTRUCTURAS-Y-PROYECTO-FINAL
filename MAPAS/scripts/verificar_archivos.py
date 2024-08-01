import os

# Obtener la ruta base del archivo actual
base_path = os.path.dirname(os.path.abspath(__file__))

# Definir rutas absolutas de los archivos GeoJSON
subway_geojson_path = os.path.join(base_path, '../datos/estaciones_de_metro.geojson')
parks_geojson_path = os.path.join(base_path, '../datos/parques.geojson')

# Imprimir las rutas para verificación
print(f"Ruta de estaciones de metro: {subway_geojson_path}")
print(f"Ruta de parques: {parks_geojson_path}")

# Verificar si los archivos existen
print(f"Archivo de estaciones de metro existe: {os.path.exists(subway_geojson_path)}")
print(f"Archivo de parques existe: {os.path.exists(parks_geojson_path)}")
