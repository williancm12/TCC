(() => {
    function initUserInfo() {
        const savedName = localStorage.getItem("userName");
        const savedImage = localStorage.getItem("profileImage");

        const userNameDisplay = document.getElementById("user-name");
        const nameInput = document.getElementById("name-input");
        const profileImage = document.getElementById("profile-img");

        if (savedName) {
            if (userNameDisplay) userNameDisplay.innerText = savedName;
            if (nameInput) nameInput.value = savedName;
        }

        if (savedImage && profileImage) {
            profileImage.src = savedImage;
        }
    }

    function ensureInit() {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initUserInfo, { once: true });
        } else {
            initUserInfo();
        }
    }

    ensureInit();

    window.openPage = function(pageUrl) {
        window.location.href = pageUrl;
    };

    window.previewImage = function(event) {
        if (!event || !event.target || !event.target.files || !event.target.files[0]) {
            return;
        }

        const reader = new FileReader();
        reader.onload = function() {
            const output = document.getElementById("profile-img");
            if (!output) return;

            const imageData = reader.result;
            output.src = imageData;
            localStorage.setItem("profileImage", imageData);
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    window.saveName = function() {
        const nameInput = document.getElementById("name-input");
        const userNameDisplay = document.getElementById("user-name");

        if (!nameInput) return;

        const name = nameInput.value.trim();
        if (!name) {
            alert("Digite um nome valido.");
            return;
        }

        localStorage.setItem("userName", name);
        if (userNameDisplay) {
            userNameDisplay.innerText = name;
        }
        alert("Nome salvo com sucesso!");
    };
})();
