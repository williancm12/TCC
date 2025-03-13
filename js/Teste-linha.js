let map, directionsService, directionsRenderer;
let linhasOnibus = [];

function initMap() {
    // Limites geográficos aproximados de Curitiba
    const curitibaBounds = {
        north: -25.3289,  // Latitude nordeste
        south: -25.5985,  // Latitude sudoeste
        east: -49.1284,   // Longitude nordeste
        west: -49.3980    // Longitude sudoeste
    };

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -25.4284, lng: -49.2733 },
        zoom: 12,
        restriction: {
            latLngBounds: curitibaBounds,
            strictBounds: true // Impede movimentação para fora dos limites
        },
        mapTypeId: 'roadmap',
        gestureHandling: 'greedy' // Melhora a usabilidade em telas touch
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({ map });

    // Carrega dados das linhas de ônibus
    fetch("linhas.json")
        .then(response => response.json())
        .then(data => linhasOnibus = data)
        .catch(error => console.error("Erro ao carregar linhas:", error));
}