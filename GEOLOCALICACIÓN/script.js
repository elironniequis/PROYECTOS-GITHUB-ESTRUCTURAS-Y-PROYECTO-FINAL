class Restaurant {
    constructor(name, latitude, longitude, description, cost, rating, address, department) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
        this.cost = cost;
        this.rating = rating;
        this.address = address;
        this.department = department;
    }
}

// Lista de 10 restaurantes reales en distintos departamentos de Perú
const restaurants = [
    new Restaurant("Central", -12.1214, -77.0305, "Restaurante en Lima que ofrece cocina contemporánea.", "$$$$", 5, "Av. Pedro de Osma 301, Barranco, Lima", "Lima"), 
    new Restaurant("Maido", -12.1222, -77.0308, "Restaurante en Lima que fusiona cocina peruana y japonesa.", "$$$$", 5, "Calle San Martin 399, Miraflores, Lima", "Lima"),
    new Restaurant("Rafael", -12.1216, -77.0306, "Restaurante en Lima especializado en mariscos.", "$$$", 4, "Calle San Martin 300, Miraflores, Lima", "Lima"),
    new Restaurant("La Mar", -12.1127, -77.0371, "Cevichería en Lima con una amplia variedad de platos de mariscos.", "$$$", 4, "Av. La Mar 770, Miraflores, Lima", "Lima"),
    new Restaurant("Chicha", -13.5319, -71.9675, "Restaurante en Cusco que ofrece cocina andina moderna.", "$$$", 4, "Calle Plaza Regocijo 261, Cusco", "Cusco"),
    new Restaurant("Cicciolina", -13.5176, -71.9781, "Restaurante en Cusco con una oferta de tapas y platos italianos.", "$$$", 4, "Calle Triunfo 393, Cusco", "Cusco"),
    new Restaurant("El Huacatay", -13.3133, -72.1165, "Restaurante en Urubamba con platos tradicionales peruanos.", "$$", 4, "Jr. Arica 620, Urubamba", "Urubamba"),
    new Restaurant("La Nueva Palomino", -16.4090, -71.5375, "Picantería en Arequipa famosa por sus platos tradicionales.", "$$", 4, "Leoncio Prado 122, Yanahuara, Arequipa", "Arequipa"),
    new Restaurant("Zig Zag", -16.4065, -71.5385, "Restaurante en Arequipa conocido por sus carnes a la piedra.", "$$$", 4, "Calle Zela 210, Arequipa", "Arequipa"),
    new Restaurant("El Muelle", -6.4820, -76.3655, "Restaurante en Tarapoto especializado en mariscos frescos.", "$$", 4, "Jr. Ramirez Hurtado 1085, Tarapoto", "San Martín")
];

// Función para convertir coordenadas en una clave de celda
function coordinateToCellKey(latitude, longitude) {
    const latCell = Math.floor(latitude * 100);
    const lonCell = Math.floor(longitude * 100);
    return `${latCell}_${lonCell}`;
}

// Función para inicializar el mapa
function initMap() {
    const map = L.map('map').setView([-12.0464, -77.0428], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    restaurants.forEach(restaurant => {
        const cellKey = coordinateToCellKey(restaurant.latitude, restaurant.longitude);
        L.marker([restaurant.latitude, restaurant.longitude])
            .addTo(map)
            .bindPopup(`${restaurant.name}<br>Celda: ${cellKey}`);
    });

    return map;
}

// Inicializar el mapa cuando la página se cargue
const map = initMap();

// Función para añadir los restaurantes al select
function populateSelect() {
    const select = document.getElementById('restaurant-select');
    restaurants.forEach((restaurant, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = restaurant.name;
        select.appendChild(option);
    });
}

// Función para mostrar el restaurante seleccionado en el mapa y la información
function showRestaurantOnMap(event) {
    event.preventDefault();
    const select = document.getElementById('restaurant-select');
    const selectedIndex = select.value;
    const restaurant = restaurants[selectedIndex];

    if (restaurant) {
        const { latitude, longitude, name, description, cost, rating, address, department } = restaurant;
        map.setView([latitude, longitude], 15);
        L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(name)
            .openPopup();

        // Añadir un cuadro alrededor del restaurante
        const bounds = [
            [latitude - 0.01, longitude - 0.01],
            [latitude + 0.01, longitude + 0.01]
        ];
        L.rectangle(bounds, { color: "#ff7800", weight: 1 }).addTo(map);

        const infoDiv = document.getElementById('restaurant-info');
        infoDiv.innerHTML = `
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Descripción:</strong> ${description}</p>
            <p><strong>Dirección:</strong> ${address}</p>
            <p><strong>Departamento:</strong> ${department}</p>
            <p><strong>Costo:</strong> ${cost}</p>
            <p><strong>Calificación:</strong> <span class="stars">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</span></p>
        `;
    }
}

document.getElementById('search-form').addEventListener('submit', showRestaurantOnMap);

// Añadir los restaurantes al select cuando la página se cargue
window.onload = populateSelect;
