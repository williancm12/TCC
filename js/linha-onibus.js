const origem = "Praça Tiradentes, Curitiba";
const destino = "Terminal Boqueirão, Curitiba";
const apiKey = "AIzaSyDzn_bdYS1y5XGLd2gK4Xiu03uLXY6h8G4"; // Substitua pela sua chave

const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origem)}&destination=${encodeURIComponent(destino)}&mode=transit&key=${apiKey}`;

fetch(url)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Erro ao buscar as rotas:", error)); let map, directionsService, directionsRenderer;
  let linhasOnibus = [];

  function initMap() {
      map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: -25.4284, lng: -49.2733 },
          zoom: 12,
      });

      directionsService = new google.maps.DirectionsService();
      directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      fetch("linhas.json")
          .then(response => response.json())
          .then(data => {
              linhasOnibus = data;
          })  
          .catch(error => console.error("Erro ao carregar linhas:", error));
  }

  function buscarRota() {
      const linhaDigitada = document.getElementById("linha").value.trim();
      if (!linhaDigitada) {
          alert("Por favor, digite o nome ou número da linha de ônibus.");
          return;
      }

      const linhaEncontrada = linhasOnibus.find(linha =>
          linha.numero === linhaDigitada || linha.nome.toLowerCase().includes(linhaDigitada.toLowerCase())
      );

      if (!linhaEncontrada) {
          alert("Linha de ônibus não encontrada.");
          return;
      }

      const request = {
          origin: linhaEncontrada.origem,
          destination: linhaEncontrada.destino,
          travelMode: "TRANSIT",
          transitOptions: { modes: ["BUS"] }
      };

      directionsService.route(request, (result, status) => {
          if (status === "OK") {
              directionsRenderer.setDirections(result);
          } else {
              alert("Erro ao buscar a rota. Tente novamente.");
          }
      });
  }

  window.onload = initMap;

  // Limitar o tamanho no mapa

  


// Chamar função para localização em tempo real
  let userMarker, userCircle;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -25.4284, lng: -49.2733 },
      zoom: 12,
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  fetch("linhas.json")
      .then(response => response.json())
      .then(data => {
          linhasOnibus = data;
      })  
      .catch(error => console.error("Erro ao carregar linhas:", error));

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

              if (userMarker) {
                  userMarker.setMap(null);
                  userCircle.setMap(null);
              }

          
              userMarker = new google.maps.Marker({
                  position: userLocation,
                  map: map,
                  icon: {
                      url: "https://maps.google.com/mapfiles/kml/shapes/man.png",
                      scaledSize: new google.maps.Size(40, 40)
                  }
              });

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

window.onload = initMap;

// tambem não sei ainda 

function salvarLinhaFavorita(linha) {
    localStorage.setItem("linhaFavorita", linha);
    alert(`Linha ${linha} salva como favorita!`);
}

function removerLinhaFavorita() {
    localStorage.removeItem("linhaFavorita");
    alert("Linha favorita removida!");
}

function obterLinhaFavorita() {
    return localStorage.getItem("linhaFavorita") || "Nenhuma linha favorita selecionada.";
}
