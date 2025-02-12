document.addEventListener("DOMContentLoaded", () => {
  const addressForm = document.querySelector("#address-form");
  const cepInput = document.querySelector("#cep");
  const addressInput = document.querySelector("#address");
  const cityInput = document.querySelector("#city");
  const neighborhoodInput = document.querySelector("#neighborhood");
  const regionInput = document.querySelector("#region");
  const formInputs = document.querySelectorAll("[data-input]");
  const closeButton = document.querySelector("#close-message");

  cepInput.addEventListener("keypress", (e) => {
      const onlyNumbers = /[0-9]|\./;
      const key = String.fromCharCode(e.keyCode);

      if (!onlyNumbers.test(key)) {
          e.preventDefault();
          return;
      }
  });

  cepInput.addEventListener("keyup", (e) => {
      const inputValue = e.target.value;

      // CEP
      if (inputValue.length === 8) {
          getAddress(inputValue);
      }
  });

  const getAddress = async (cep) => {
      toggleLoader();

      const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.erro) {
          addressForm.reset();
          toggleLoader();
          toggleMessage("CEP inválido, tente novamente.");
          return;
      }

      addressInput.value = data.logradouro;
      cityInput.value = data.localidade;
      neighborhoodInput.value = data.bairro;
      regionInput.value = data.uf;

      toggleLoader();
  };

  const toggleDisabled = () => {
      formInputs.forEach(input => {
          if (input.hasAttribute("disabled")) {
              input.removeAttribute("disabled");
          } else {
              input.setAttribute("disabled", "disabled");
          }
      });
  };

  const toggleLoader = () => {
      const fadeElement = document.querySelector("#fade");
      const loaderElement = document.querySelector("#loader");

      if (fadeElement && loaderElement) {
          fadeElement.classList.toggle("hide");
          loaderElement.classList.toggle("hide");
      } else {
          console.error("Elementos de loader não encontrados.");
      }
  };

  const toggleMessage = (msg) => {
      const fadeElement = document.querySelector("#fade");
      const messageElement = document.querySelector("#message");
      const messageTextElement = document.querySelector("#message p");

      messageTextElement.innerText = msg;

      fadeElement.classList.toggle("hide");
      messageElement.classList.toggle("hide");
  };

  closeButton.addEventListener("click", () => toggleMessage());

  addressForm.addEventListener("submit", (e) => {
      e.preventDefault();

      toggleLoader();

      setTimeout(() => {
          toggleLoader();
          addressForm.reset();
          toggleDisabled();
      }, 1000);
  });
});
addressForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita o envio padrão do formulário

  toggleLoader(); // Mostra o carregador

  // Coleta os dados do formulário
  const formData = new FormData(addressForm);

  try {
      // Envia os dados para o PHP
      const response = await fetch(addressForm.action, {
          method: 'POST',
          body: formData
      });

      if (response.ok) {
          toggleLoader(); // Esconde o carregador
          toggleMessage("Endereço salvo com sucesso!");

          // Redireciona para a página de login após um breve atraso
          setTimeout(() => {
              window.location.href = '../login.html'; // Redireciona para a página de login
          }, 2000); // 2 segundos de atraso
      } else {
          toggleLoader(); // Esconde o carregador em caso de erro
          toggleMessage("Erro ao salvar o endereço.");
      }
  } catch (error) {
      console.error('Erro:', error);
      toggleLoader(); // Esconde o carregador em caso de erro
      toggleMessage("Erro ao realizar o cadastro! Tente novamente.");
  }
});

