import os
import folium

# Obtener la ruta base del archivo actual
base_path = os.path.dirname(os.path.abspath(__file__))

# Definir rutas absolutas de los archivos GeoJSON
subway_geojson_path = os.path.join(base_path, '../datos/estaciones_de_puno.geojson')
parks_geojson_path = os.path.join(base_path, '../datos/parques_de_puno.geojson')

# Ruta para guardar el archivo HTML
output_dir = os.path.join(base_path, '../salidas')
output_path = os.path.join(output_dir, 'puno_map_with_layers.html')

# Crear la carpeta de salida si no existe
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Crear un mapa centrado en la ciudad de Puno
m = folium.Map(location=[-15.8402, -70.0158], zoom_start=14)

# Función para crear popups con descripciones
def create_popup(feature):
    popup_text = f"Nombre: {feature['properties']['name']}"
    if 'description' in feature['properties']:
        popup_text += f"<br>Descripción: {feature['properties']['description']}"
    return folium.Popup(popup_text, max_width=300)

# Cargar los datos GeoJSON de estaciones desde el archivo local
with open(subway_geojson_path, 'r', encoding='utf-8') as f:
    subway_data = f.read()
subway_layer = folium.GeoJson(
    subway_data,
    name='Estaciones de Puno',
    popup=folium.GeoJsonPopup(fields=['name', 'description'])
)

# Cargar los datos GeoJSON de parques desde el archivo local
with open(parks_geojson_path, 'r', encoding='utf-8') as f:
    parks_data = f.read()
parks_layer = folium.GeoJson(
    parks_data,
    name='Parques de Puno',
    popup=folium.GeoJsonPopup(fields=['name', 'description'])
)

# Añadir las capas al mapa
subway_layer.add_to(m)
parks_layer.add_to(m)

# Añadir control de capas
folium.LayerControl().add_to(m)

# Guardar el mapa en un archivo HTML
m.save(output_path)

print(f"El mapa ha sido generado y guardado como '{output_path}'")
