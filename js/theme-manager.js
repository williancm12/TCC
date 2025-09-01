// Gerenciador de Temas Global
// Este arquivo deve ser incluído em todas as páginas para sincronizar o tema

document.addEventListener("DOMContentLoaded", function() {
    const savedTheme = localStorage.getItem("theme") || "light";
    
    // Aplica o tema salvo automaticamente
    applyTheme(savedTheme);
    
    // Escuta mudanças no localStorage para sincronizar o tema entre páginas
    window.addEventListener("storage", function(e) {
        if (e.key === "theme") {
            applyTheme(e.newValue || "light");
        }
    });
});

function applyTheme(theme) {
    // Remove classes de tema anteriores
    document.body.classList.remove("light-theme", "dark-theme");
    
    // Aplica o novo tema
    document.body.classList.add(theme + "-theme");
    
    // Aplica o tema em elementos específicos baseado na página atual
    const currentPage = window.location.pathname.split('/').pop() || window.location.href;
    const currentUrl = window.location.href;
    const currentTitle = document.title;
    
    console.log("Aplicando tema:", theme);
    console.log("Página atual:", currentPage);
    console.log("URL atual:", currentUrl);
    console.log("Título atual:", currentTitle);
    
    if (currentPage.includes('linha-onibus') || currentUrl.includes('linha-onibus')) {
        // Página de linha de ônibus
        console.log("Aplicando tema para linha-onibus");
        applyThemeToElements(theme, "#top-bar, #sidebar, .suggestions, .linha-info, .linha-info h4, .linha-info p, .linha-info strong, button, input");
    } else if (currentPage.includes('api-notificação') || currentPage.includes('api-notificacao') || currentUrl.includes('api-notificação') || currentUrl.includes('api-notificacao')) {
        // Página de notificações
        console.log("Aplicando tema para api-notificação");
        applyThemeToElements(theme, ".conversation-container, .controls, .card, .message, .timestamp, .control-btn");
    } else if (currentPage.includes('rosto') || currentUrl.includes('rosto') || currentTitle.includes('FacePay')) {
        // Página de rosto
        console.log("Aplicando tema para rosto");
        applyThemeToElements(theme, "h1, .container, input, button, p");
    } else if (currentPage.includes('teste-comprar') || currentUrl.includes('teste-comprar')) {
        // Página de teste de compra
        console.log("Aplicando tema para teste-comprar");
        applyThemeToElements(theme, "body, h1, .carousel-container, .plan-card, .card-inner, .payment-container, input, button, .arrow, .dot");
    } else if (currentPage.includes('inicio-mapa') || currentUrl.includes('inicio-mapa')) {
        // Página de mapa
        console.log("Aplicando tema para inicio-mapa");
        applyThemeToElements(theme, ".side-item, #sidebar, #getLocationBtn, #user, #logout_btn, main");
    } else if (currentPage.includes('linha-favorita') || currentUrl.includes('linha-favorita')) {
        // Página de linhas favoritas
        console.log("Aplicando tema para linha-favorita");
        applyThemeToElements(theme, "body, h2, table, th, td, button, #sidebar");
    } else if (currentPage.includes('Teste') || currentUrl.includes('Teste')) {
        // Página Teste.html
        console.log("Aplicando tema para Teste.html");
        applyThemeToElements(theme, "body, h2, table, th, td, button, #sidebar, #particles-js");
    }
}

function applyThemeToElements(theme, selector) {
    try {
        const elements = document.querySelectorAll(selector);
        console.log("Elementos encontrados para", selector, ":", elements.length);
        
        elements.forEach(el => {
            el.classList.remove("light-theme", "dark-theme");
            el.classList.add(theme + "-theme");
        });
    } catch (error) {
        console.log("Erro ao aplicar tema:", error);
    }
}
