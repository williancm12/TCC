  document.addEventListener("DOMContentLoaded", function () {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      const nameEl = document.getElementById("user-name-display");
      if (nameEl) nameEl.innerText = savedName;
    }

    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      const avatar = document.getElementById("user_avatar");
      if (avatar) avatar.src = savedImage;
    }

    // Código da sidebar
    const openBtn = document.getElementById("open_btn");
    const sidebar = document.getElementById("sidebar");

    openBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open-sidebar");
    });
  });
    
        function openPage(page) {
            window.location.href = page;
        }

        let map, directionsService, directionsRenderer, geocoder;
        let linhasOnibus = [];

        document.addEventListener("DOMContentLoaded", () => {
            console.log("DOM carregado, inicializando...");
            
            fetch("linhas.json")
                .then(response => response.json())
                .then(data => {
                    linhasOnibus = data;
                    console.log("Linhas carregadas:", linhasOnibus.length);
                })
                .catch(error => console.error("Erro ao carregar linhas:", error));

            // Verifica se os elementos existem
            console.log("Elementos encontrados:", {
                linhaInfo: document.getElementById("linhaInfo"),
                linha: document.getElementById("linha"),
                suggestions: document.getElementById("suggestions")
            });
        });

        function initMap() {
            map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: -25.4284, lng: -49.2733 },
                zoom: 12,
            });

            directionsService = new google.maps.DirectionsService();
            directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);

            geocoder = new google.maps.Geocoder();

            localizarUsuario();
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

            geocoder.geocode({ address: linhaEncontrada.origem }, (resultsOrigem, statusOrigem) => {
                if (statusOrigem !== "OK") {
                    alert("Endereço de origem não encontrado: " + statusOrigem);
                    return;
                }

                geocoder.geocode({ address: linhaEncontrada.destino }, (resultsDestino, statusDestino) => {
                    if (statusDestino !== "OK") {
                        alert("Endereço de destino não encontrado: " + statusDestino);
                        return;
                    }

                    const request = {
                        origin: resultsOrigem[0].geometry.location,
                        destination: resultsDestino[0].geometry.location,
                        travelMode: "TRANSIT",
                        transitOptions: { modes: ["BUS"] }
                    };

                    directionsService.route(request, (result, status) => {
                        if (status === "OK") {
                            directionsRenderer.setDirections(result);
                        } else {
                            alert("Erro ao buscar a rota: " + status);
                            console.error("Google Maps Directions error:", status);
                        }
                    });
                });
            });
        }

        function localizarUsuario() {
            if (navigator.geolocation) {
                navigator.geolocation.watchPosition(
                    (position) => {
                        const userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        const userMarker = new google.maps.Marker({
                            position: userLocation,
                            map: map,
                            icon: {
                                url: "https://maps.google.com/mapfiles/kml/shapes/man.png",
                                scaledSize: new google.maps.Size(40, 40)
                            }
                        });

                        const userCircle = new google.maps.Circle({
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
            
        window.onload = function () {
        initMap();
    };
    
        function salvarLinhaFavorita() {
            const linhaDigitada = document.getElementById("linha").value.trim();
            if (!linhaDigitada) {
                alert("Digite um número ou nome de linha antes de salvar.");
                return;
            }

            const linhaEncontrada = linhasOnibus.find(linha =>
                linha.numero === linhaDigitada || linha.nome.toLowerCase().includes(linhaDigitada.toLowerCase())
            );

            if (!linhaEncontrada) {
                alert("Linha de ônibus não encontrada.");
                return;
            }

            let linhasFavoritas = JSON.parse(localStorage.getItem("linhasFavoritas") || "[]");

            if (linhasFavoritas.length >= 10) {
                alert("Você já tem 10 linhas favoritas. Remova uma antes de adicionar outra.");
                return;
            }

            const jaSalva = linhasFavoritas.some(linha => linha.numero === linhaEncontrada.numero);
            if (jaSalva) {
                alert("Essa linha já está salva como favorita.");
                return;
            }

            linhasFavoritas.push({ 
                numero: linhaEncontrada.numero, 
                nome: linhaEncontrada.nome,
                origem: linhaEncontrada.origem,
                destino: linhaEncontrada.destino,
                tarifa_dinheiro: linhaEncontrada.tarifa_dinheiro,
                tarifa_cartao: linhaEncontrada.tarifa_cartao,
                operadora: linhaEncontrada.operadora
            });
            localStorage.setItem("linhasFavoritas", JSON.stringify(linhasFavoritas));

            alert(`Linha ${linhaEncontrada.nome} (${linhaEncontrada.numero}) salva como favorita!`);
        }

        // Sugestões enquanto digita
        const inputLinha = document.getElementById("linha");
        const suggestionsBox = document.getElementById("suggestions");
        const linhaInfo = document.getElementById("linhaInfo");

        if (inputLinha && suggestionsBox) {
            inputLinha.addEventListener("input", () => {
                const valor = inputLinha.value.toLowerCase();
                suggestionsBox.innerHTML = "";

                if (valor.length === 0) {
                    suggestionsBox.style.display = "none";
                    limparBotaoFavorito();
                    return;
                }

                const filtradas = linhasOnibus.filter(linha =>
                    linha.numero.toLowerCase().includes(valor) ||
                    linha.nome.toLowerCase().includes(valor)
                );

                if (filtradas.length === 0) {
                    suggestionsBox.style.display = "none";
                    limparBotaoFavorito();
                    return;
                }

                filtradas.forEach(linha => {
                    const div = document.createElement("div");
                    div.textContent = `${linha.numero} - ${linha.nome}`;
                    div.onclick = () => mostrarLinhaInfo(linha);
                    suggestionsBox.appendChild(div);
                });

                suggestionsBox.style.display = "block";
            });
        }

        // Mostrar informações da linha selecionada
        function mostrarLinhaInfo(linha) {
            console.log("Mostrando informações da linha:", linha);

            document.getElementById("linhaTitulo").textContent = `${linha.numero} - ${linha.nome}`;
            document.getElementById("linhaOrigem").textContent = linha.origem;
            document.getElementById("linhaDestino").textContent = linha.destino;
            document.getElementById("linhaTarifa").textContent = linha.tarifa_dinheiro.toFixed(2);
            document.getElementById("linhaOperadora").textContent = linha.operadora;

            atualizarBotaoFavorito(linha.numero);

            linhaInfo.classList.add('visible');
            linhaInfo.style.display = 'block';

            suggestionsBox.style.display = "none";
            inputLinha.value = "";

            buscarRotaDireto(linha);
        }

        function limparBotaoFavorito() {
            const favoritoBtn = document.getElementById("favoritoBtn");
            if (favoritoBtn) {
                favoritoBtn.innerHTML = '<span class="icon">❤</span><span class="texto">Adicionar aos Favoritos</span>';
                favoritoBtn.style.background = '#ff4d4d';
            }
        }

        function atualizarBotaoFavorito(numeroLinha) {
            const linhasFavoritas = JSON.parse(localStorage.getItem("linhasFavoritas") || "[]");
            const jaSalva = linhasFavoritas.some(linha => linha.numero === numeroLinha);
            
            const favoritoBtn = document.getElementById("favoritoBtn");
            
            if (jaSalva) {
                favoritoBtn.innerHTML = '<span class="icon">💔</span><span class="texto">Remover dos Favoritos</span>';
                favoritoBtn.style.background = '#dc3545';
            } else {
                favoritoBtn.innerHTML = '<span class="icon">❤</span><span class="texto">Adicionar aos Favoritos</span>';
                favoritoBtn.style.background = '#ff4d4d';
            }
        }

        function buscarRotaDireto(linhaEncontrada) {
            geocoder.geocode({ address: linhaEncontrada.origem }, (resultsOrigem, statusOrigem) => {
                if (statusOrigem !== "OK") {
                    alert("Endereço de origem não encontrado: " + statusOrigem);
                    return;
                }

                geocoder.geocode({ address: linhaEncontrada.destino }, (resultsDestino, statusDestino) => {
                    if (statusDestino !== "OK") {
                        alert("Endereço de destino não encontrado: " + statusDestino);
                        return;
                    }

                    const request = {
                        origin: resultsOrigem[0].geometry.location,
                        destination: resultsDestino[0].geometry.location,
                        travelMode: "TRANSIT",
                        transitOptions: { modes: ["BUS"] }
                    };

                    directionsService.route(request, (result, status) => {
                        if (status === "OK") {
                            directionsRenderer.setDirections(result);
                        } else {
                            alert("Erro ao buscar a rota: " + status);
                            console.error("Google Maps Directions error:", status);
                        }
                    });
                });
            });
        }

        function toggleFavorito() {
            const linhaTitulo = document.getElementById("linhaTitulo").textContent;
            if (!linhaTitulo) {
                alert("Nenhuma linha selecionada para favoritar.");
                return;
            }

            const numeroLinha = linhaTitulo.split(" - ")[0];
            const linhaEncontrada = linhasOnibus.find(linha => linha.numero === numeroLinha);

            if (!linhaEncontrada) {
                alert("Linha não encontrada.");
                return;
            }

            let linhasFavoritas = JSON.parse(localStorage.getItem("linhasFavoritas") || "[]");
            const jaSalva = linhasFavoritas.some(linha => linha.numero === linhaEncontrada.numero);

            if (jaSalva) {
                linhasFavoritas = linhasFavoritas.filter(linha => linha.numero !== linhaEncontrada.numero);
                localStorage.setItem("linhasFavoritas", JSON.stringify(linhasFavoritas));
                alert("Linha removida dos favoritos!");
            } else {
                if (linhasFavoritas.length >= 10) {
                    alert("Você já tem 10 linhas favoritas. Remova uma antes de adicionar outra.");
                    return;
                }

                linhasFavoritas.push({ 
                    numero: linhaEncontrada.numero, 
                    nome: linhaEncontrada.nome,
                    origem: linhaEncontrada.origem,
                    destino: linhaEncontrada.destino,
                    tarifa_dinheiro: linhaEncontrada.tarifa_dinheiro,
                    tarifa_cartao: linhaEncontrada.tarifa_cartao,
                    operadora: linhaEncontrada.operadora
                });
                localStorage.setItem("linhasFavoritas", JSON.stringify(linhasFavoritas));
                alert("Linha adicionada aos favoritos!");
            }

            atualizarBotaoFavorito(linhaEncontrada.numero);
        }