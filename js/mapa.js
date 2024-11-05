document.addEventListener("DOMContentLoaded", function () {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.add(savedTheme + "-theme");
  updateThemeClasses(savedTheme);


  function updateThemeClasses(theme) {
      document.querySelectorAll(".side-item, #sidebar, #getLocationBtn, #user, #logout_btn, main").forEach(el => {
          el.classList.remove("light-theme", "dark-theme");
          el.classList.add(theme + "-theme");
      });
  }
});

// Inicializando o mapa usando o Leaflet com limite de zoom
var map = L.map('map', {
center: [-25.4284, -49.2733], // Curitiba
zoom: 13,
minZoom: 10, // Define o zoom mínimo
maxZoom: 19 // Define o zoom máximo
});

// Adicionando tiles do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '© OpenStreetMap'
}).addTo(map);

// Definindo limites (bounds) para impedir que o usuário navegue fora da área
var bounds = L.latLngBounds(
L.latLng(-26.0, -50.0), // sudoeste
L.latLng(-24.5, -48.0)  // nordeste
);
map.setMaxBounds(bounds);

// Impedir que o mapa "salte" para fora dos limites
map.on('drag', function() {
map.panInsideBounds(bounds, { animate: false });
});

// Exemplo de marcador de ônibus
L.marker([-25.4284, -49.2733]).addTo(map)
.bindPopup('Ônibus Exemplo')
.openPopup();

// Função para centralizar no local atual
document.getElementById('getLocationBtn').addEventListener('click', function() {
if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(function(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;

  // Centralizar o mapa e adicionar marcador
  map.setView([lat, lon], 13);
  L.marker([lat, lon]).addTo(map)
      .bindPopup('Você está aqui!')
      .openPopup();
}, function() {
  alert("Não foi possível obter a localização.");
});
} else {
alert("Geolocalização não é suportada pelo seu navegador.");
}
});

document.getElementById('open_btn').addEventListener('click', function () {
  document.getElementById('sidebar').classList.toggle('open-sidebar');
});


const newTheme = savedTheme === "light" ? "dark" : "light";
localStorage.setItem("theme", newTheme);