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

  function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -25.4284, lng: -49.2733 },
        zoom: 13
    });

    var marker = new google.maps.Marker({
        position: { lat: -25.4284, lng: -49.2733 },
        map: map,
        title: 'Ônibus Exemplo'
    });

    document.getElementById('getLocationBtn').addEventListener('click', function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(userLocation);
                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: 'Você está aqui!'
                });
            }, function () {
                alert("Não foi possível obter a localização.");
            });
        } else {
            alert("Geolocalização não é suportada pelo seu navegador.");
        }
    });
}

// Aguarde o carregamento do script antes de inicializar o mapa
window.onload = function () {
    initMap();
};

  // Alternar barra lateral
  document.getElementById('open_btn').addEventListener('click', function () {
      document.getElementById('sidebar').classList.toggle('open-sidebar');
  });

  // Alternar tema e salvar no localStorage
  document.getElementById('getLocationBtn').addEventListener('dblclick', function () {
      const newTheme = savedTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.body.classList.remove("light-theme", "dark-theme");
      document.body.classList.add(newTheme + "-theme");
      updateThemeClasses(newTheme);
  });

  // Carregar a imagem de perfil salva no localStorage
  const savedImage = localStorage.getItem('profileImage');
  if (savedImage) {
      document.getElementById('user_avatar').src = savedImage;
  }
});
