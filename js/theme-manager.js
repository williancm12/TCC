(function() {
    const THEME_KEY = "theme";
    const THEME_CLASSES = ["light-theme", "dark-theme"];
    const THEME_SELECTORS = [
        ".sidebar",
        ".sidebar-buttons button",
        ".main-content h1",
        ".main-content h2",
        ".main-content h3",
        ".main-content p",
        "input",
        ".config-option",
        "header",
        ".filter-btn",
        ".severity-btn",
        "#notifications-container .notification-card",
        "#notification-count",
        "#name-input",
        "#save-name-btn",
        "#loading",
        "#no-results",
        "#filter-bar",
        ".bg-white.border-b",
        "#sidebar",
        "#sidebar_content",
        "#top-bar",
        ".linha-info",
        ".favorito-btn",
        "#sidebar-bottom",
        ".map-container",
        "nav",
        "main",
        ".card-inner",
        ".plan-title",
        ".plan-description",
        ".plan-price",
        ".buy-button",
        ".payment-container",
        ".payment-container input",
        ".payment-button",
        ".dot"
    ];

    document.addEventListener("click", function(event) {
        const profilePicture = event.target.closest(".profile-picture");
        if (profilePicture) {
            alert("Clique para alterar a foto de perfil.");
        }
    });

    function cleanThemeClasses(element) {
        THEME_CLASSES.forEach(cls => element.classList.remove(cls));
    }

    function applyThemeToElement(element, theme) {
        cleanThemeClasses(element);
        element.classList.add(`${theme}-theme`);
    }

    function applyTheme(theme) {
        if (!document.body) return;

        applyThemeToElement(document.body, theme);

        THEME_SELECTORS.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                applyThemeToElement(el, theme);
            });
        });

        window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
    }

    function toggleTheme() {
        const currentTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
        const newTheme = currentTheme === "light" ? "dark" : "light";
        localStorage.setItem(THEME_KEY, newTheme);
        applyTheme(newTheme);
    }

    function initThemeManager() {
        const savedTheme = localStorage.getItem(THEME_KEY) || "light";
        applyTheme(savedTheme);

        const themeToggleButton = document.getElementById("theme-toggle");
        if (themeToggleButton) {
            themeToggleButton.addEventListener("click", toggleTheme);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initThemeManager);
    } else {
        initThemeManager();
    }

    window.ThemeManager = {
        applyTheme(theme) {
            localStorage.setItem(THEME_KEY, theme);
            applyTheme(theme);
        },
        getTheme() {
            return localStorage.getItem(THEME_KEY) || "light";
        }
    };
})();