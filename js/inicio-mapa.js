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

    let map, userMarker, userCircle;


    function initMap() {
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: -25.4284, lng: -49.2733 },
            zoom: 12
        });
    
        // Configuração de rotas
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
        
        // Obtém a localização do usuário
        localizarUsuario();
    }
    

    function localizarUsuario() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    // Remover marcador e círculo anteriores se existirem
                    if (userMarker) userMarker.setMap(null);
                    if (userCircle) userCircle.setMap(null);

                    // Criar novo marcador da localização do usuário
                    userMarker = new google.maps.Marker({
                        position: userLocation,
                        map: map,
                        icon: {
                            url: "https://maps.google.com/mapfiles/kml/shapes/man.png",
                            scaledSize: new google.maps.Size(40, 40)
                        },
                        title: 'Você está aqui!'
                    });

                    // Criar círculo para precisão da localização
                    userCircle = new google.maps.Circle({
                        center: userLocation,
                        radius: position.coords.accuracy,
                        map: map,
                        fillColor: "#4285F4",
                        fillOpacity: 0.2,
                        strokeColor: "#4285F4",
                        strokeOpacity: 0.6,
                        strokeWeight: 2
                    });

                    // Centralizar o mapa na localização do usuário
                    map.setCenter(userLocation);
                },
                (error) => {
                    console.error("Erro ao obter localização:", error);
                    alert("Não foi possível acessar sua localização.");
                },
                { enableHighAccuracy: true, maximumAge: 0 }
            );
        } else {
            alert("Seu navegador não suporta geolocalização.");
        }
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

//função para altera o a img na pagina 

document.addEventListener("DOMContentLoaded", function () {
    const userAvatar = document.getElementById("user_avatar");
    
    // Carregar imagem salva no localStorage
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
        userAvatar.src = savedImage;
    }

    // Se houver um input de arquivo na página, permite alteração da imagem
    const fileInput = document.getElementById("file_input");
    if (fileInput) {
        fileInput.addEventListener("change", function (event) {
            const reader = new FileReader();
            reader.onload = function () {
                const imageData = reader.result;
                userAvatar.src = imageData;
                localStorage.setItem("profileImage", imageData);
            };
            reader.readAsDataURL(event.target.files[0]);
        });
    }
});


window.onload = function () {
    const savedName = localStorage.getItem("userName");
    const savedImage = localStorage.getItem("profileImage");
  
    if (savedName) {
      const userNameElement = document.getElementById("user-name");
      const userSidebarName = document.getElementById("user-name-sidebar");
  
      if (userNameElement) userNameElement.innerText = savedName;
      if (userSidebarName) userSidebarName.innerText = savedName;
  
      const nameInput = document.getElementById("name-input");
      if (nameInput) nameInput.value = savedName;
    }
  
    if (savedImage) {
      const profileImg = document.getElementById("profile-img");
      const sidebarImg = document.getElementById("user_avatar");
      if (profileImg) profileImg.src = savedImage;
      if (sidebarImg) sidebarImg.src = savedImage;
    }
  };

  window.onload = function () {
    const savedName = localStorage.getItem("userName");

    if (savedName) {
      const nameElement = document.getElementById("user-name-display");
      if (nameElement) {
        nameElement.innerText = savedName;
      }
    }
  };

  window.onload = function () {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      document.getElementById("user-name-display").innerText = savedName;
    }
  };
