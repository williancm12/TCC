document.querySelector('.profile-picture').addEventListener('click', function() {
    alert("Clique para alterar a foto de perfil.");
});


// Função para abrir novas páginas
function openPage(pageUrl) {
    window.location.href = pageUrl;
}

// Tema 

document.addEventListener("DOMContentLoaded", function() {
    const themeToggleButton = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("theme") || "light";

    // Aplica o tema salvo ou o padrão ao carregar a página
    document.body.classList.add(savedTheme + "-theme");
    updateThemeClasses(savedTheme);

    // Alterna o tema ao clicar no botão
    themeToggleButton.addEventListener("click", function() {
        const currentTheme = document.body.classList.contains("light-theme") ? "light" : "dark";
        const newTheme = currentTheme === "light" ? "dark" : "light";

        // Atualiza o tema no body e nos elementos
        document.body.classList.remove(currentTheme + "-theme");
        document.body.classList.add(newTheme + "-theme");
        updateThemeClasses(newTheme);

        // Salva o novo tema no localStorage para persistir entre páginas
        localStorage.setItem("theme", newTheme);
    });

    function updateThemeClasses(theme) {
        document.querySelectorAll(".sidebar, .sidebar-buttons button, .main-content h1, .main-content h3, .main-content p").forEach(el => {
            el.classList.remove("light-theme", "dark-theme");
            el.classList.add(theme + "-theme");
        });
    }
});


       // Função para exibir a imagem de perfil temporária e salvar no localStorage
       function previewImage(event) {
        const reader = new FileReader();
        reader.onload = function(){
            const output = document.getElementById('profile-img');
            const imageData = reader.result;

            // Atualiza a imagem de perfil e salva no localStorage
            output.src = imageData;
            localStorage.setItem('profileImage', imageData);
        };
        reader.readAsDataURL(event.target.files[0]);
    }

    // Carregar a imagem de perfil salva no localStorage ao carregar a página
    window.onload = function() {
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            document.getElementById('profile-img').src = savedImage;
        }
    };