const origem = "Praça Tiradentes, Curitiba";
const destino = "Terminal Boqueirão, Curitiba";
const apiKey = "AIzaSyDzn_bdYS1y5XGLd2gK4Xiu03uLXY6h8G4"; // Substitua pela sua chave

const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origem)}&destination=${encodeURIComponent(destino)}&mode=transit&key=${apiKey}`;

fetch(url)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Erro ao buscar as rotas:", error));
