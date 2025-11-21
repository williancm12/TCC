console.log('api-notificação.js carregado - versão 2.0');

let allNotifications = [];
let currentCategoryFilter = 'all';
let currentSeverityFilter = 'all';

async function fetchWeatherData() {
  try {
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-25.4284&longitude=-49.2733&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&timezone=America%2FSao_Paulo');
    
    if (!response.ok) {
      throw new Error('Erro na resposta da API');
    }
    
    const data = await response.json();
    
    if (!data || !data.current) {
      throw new Error('Dados inválidos da API');
    }

    const notifications = [];
    const current = data.current;
    const temp = current.temperature_2m;
    const rain = current.rain || 0;
    const windSpeed = current.wind_speed_10m;

    if (temp < 15) {
      notifications.push({
        id: `weather-temp-${Date.now()}`,
        title: '🥶 Temperatura Baixa',
        description: `Temperatura de ${temp}°C. Sensação ${current.apparent_temperature}°C.`,
        location: 'Curitiba - Centro',
        category: 'weather',
        severity: temp < 10 ? 'high' : 'medium',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      });
    }

    if (rain > 0) {
      notifications.push({
        id: `weather-rain-${Date.now()}`,
        title: '🌧️ Chuva Detectada',
        description: `Chuva de ${rain}mm em Curitiba.`,
        location: 'Curitiba - Geral',
        category: 'weather',
        severity: rain > 5 ? 'high' : 'medium',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      });
    }

    if (windSpeed > 30) {
      notifications.push({
        id: `weather-wind-${Date.now()}`,
        title: '💨 Vento Forte',
        description: `Ventos de ${windSpeed} km/h.`,
        location: 'Curitiba - Geral',
        category: 'weather',
        severity: windSpeed > 50 ? 'high' : 'medium',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      });
    }

    notifications.push({
      id: `weather-general-${Date.now()}`,
      title: '☁️ Condições Atuais',
      description: `${Math.round(temp)}°C, umidade ${current.relative_humidity_2m}%, vento ${Math.round(windSpeed)} km/h`,
      location: 'Curitiba',
      category: 'weather',
      severity: 'low',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    });

    return notifications;

  } catch (error) {
    console.error('Erro ao buscar clima:', error);
    return [];
  }
}

function generateTrafficData() {
  const notifications = [];
  const streets = [
    'Av. Cândido de Abreu', 'Rua XV de Novembro',
    'Av. Marechal Floriano', 'Av. Sete de Setembro',
    'Rua da Glória', 'Av. República Argentina'
  ];

  const incidents = [
    { title: '🚗 Acidente na via', type: 'incident', severity: 'high' },
    { title: '🚧 Obra na pista', type: 'roadwork', severity: 'medium' },
    { title: '🚦 Congestionamento', type: 'traffic', severity: 'medium' },
    { title: '⚠️ Bloqueio parcial', type: 'incident', severity: 'high' }
  ];

  const numIncidents = Math.floor(Math.random() * 3) + 2;

  for (let i = 0; i < numIncidents; i++) {
    const incident = incidents[Math.floor(Math.random() * incidents.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];

    notifications.push({
      id: `traffic-${Date.now()}-${i}`,
      title: incident.title,
      description: `Reportado na ${street}. Evite a região.`,
      location: street,
      category: incident.type,
      severity: incident.severity,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    });
  }

  return notifications;
}

async function loadNotifications() {
  const loadingEl = document.getElementById('loading');
  const container = document.getElementById('notifications-container');
  
  if (!loadingEl || !container) {
    console.warn('Elementos do DOM não encontrados ainda');
    return;
  }
  
  loadingEl.classList.remove('hidden');
  container.innerHTML = '';

  try {
    const weatherData = await fetchWeatherData();
    const trafficData = generateTrafficData();

    allNotifications = [...weatherData, ...trafficData];

    loadingEl.classList.add('hidden');
    renderNotifications();
  } catch (error) {
    console.error('Erro ao carregar notificações:', error);
    if (loadingEl) loadingEl.classList.add('hidden');
  }
}

function renderNotifications() {
  const container = document.getElementById('notifications-container');
  const noResults = document.getElementById('no-results');
  const countEl = document.getElementById('notification-count');

  if (!container) {
    console.warn('Container de notificações não encontrado');
    return;
  }

  const filtered = allNotifications.filter(notif => {
    const matchCategory = currentCategoryFilter === 'all' || notif.category === currentCategoryFilter;
    const matchSeverity = currentSeverityFilter === 'all' || notif.severity === currentSeverityFilter;
    return matchCategory && matchSeverity;
  });

  if (filtered.length === 0) {
    container.innerHTML = '';
    if (noResults) noResults.classList.remove('hidden');
    if (countEl) countEl.textContent = '0 alertas';
    return;
  }

  if (noResults) noResults.classList.add('hidden');
  if (countEl) countEl.textContent = `${filtered.length} alertas`;

  const currentTheme = document.body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme';
  
  container.innerHTML = filtered.map(notif => {
    const colors = {
      high: 'bg-red-50 text-red-700 border-red-200',
      medium: 'bg-orange-50 text-orange-700 border-orange-200',
      low: 'bg-blue-50 text-blue-700 border-blue-200'
    };

    return `
      <div class="notification-card bg-white rounded-lg shadow-sm border p-4 ${currentTheme}">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="font-semibold">${notif.title}</h3>
            <p class="text-sm text-gray-600">${notif.description}</p>
            <p class="text-xs text-gray-500 mt-2">${notif.location} • ${notif.time}</p>
          </div>
          <span class="px-2 py-1 text-xs rounded border ${colors[notif.severity]}">
            ${notif.severity === 'high' ? 'ALTA' : notif.severity === 'medium' ? 'MÉDIA' : 'BAIXA'}
          </span>
        </div>
      </div>
    `;
  }).join('');
}

function filterByCategory(category, el) {
  currentCategoryFilter = category;

  document.querySelectorAll('.filter-btn').forEach(btn =>
    btn.classList.remove('filter-active', 'bg-purple-600', 'text-white')
  );

  el.classList.add('filter-active');
  renderNotifications();
}

function filterBySeverity(severity, el) {
  currentSeverityFilter = severity;

  document.querySelectorAll('.severity-btn').forEach(btn =>
    btn.classList.remove('severity-active', 'bg-purple-600', 'text-white')
  );

  el.classList.add('severity-active');
  renderNotifications();
}

function refreshData() {
  loadNotifications();
}

(function() {
  function init() {
    try {
      const loadingEl = document.getElementById('loading');
      const container = document.getElementById('notifications-container');
      
      if (!loadingEl || !container) {
        console.warn('Aguardando elementos do DOM...');
        setTimeout(init, 100);
        return;
      }
      
      loadNotifications();
      setInterval(loadNotifications, 5 * 60 * 1000); 
    } catch (error) {
      console.error('Erro na inicialização:', error);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

document.addEventListener("DOMContentLoaded", function () {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);

    function applyTheme(theme) {
        document.body.classList.remove("light-theme", "dark-theme");
        document.body.classList.add(theme + "-theme");

        document.querySelectorAll(
            "header, .filter-btn, .severity-btn, #notifications-container .notification-card, .main-content h1, .main-content h3, .main-content p, #notification-count, #name-input, #save-name-btn, #loading, #no-results, #filter-bar"
        ).forEach(el => {
            el.classList.remove("light-theme", "dark-theme");
            el.classList.add(theme + "-theme");
        });

        const header = document.querySelector("header");
        if (header) {
            header.classList.remove("light-theme", "dark-theme");
            header.classList.add(theme + "-theme");
        }

        const filterBar = document.getElementById("filter-bar");
        if (filterBar) {
            filterBar.classList.remove("light-theme", "dark-theme");
            filterBar.classList.add(theme + "-theme");
        }
        
        document.querySelectorAll(".bg-white.border-b").forEach(bar => {
            if (bar.id !== "filter-bar" && bar !== header) {
                bar.classList.remove("light-theme", "dark-theme");
                bar.classList.add(theme + "-theme");
            }
        });

        document.querySelectorAll(".filter-btn, .severity-btn").forEach(btn => {
            btn.classList.remove("light-theme", "dark-theme");
            btn.classList.add(theme + "-theme");
        });

        if (typeof renderNotifications === 'function') {
            renderNotifications();
        }
    }
});