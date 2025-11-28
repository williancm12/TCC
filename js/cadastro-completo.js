let currentSection = 1;
const totalSections = 3;

// Função para inicializar
function initializeForm() {

    $('.cpf-mask').mask('000.000.000-00');
    $('.rg-mask').mask('00.000.000-0');
    $('.date-mask').mask('00/00/0000');
    $('.phone-mask').mask('(00) 00000-0000');
    $('.cep-mask').mask('00000-000');

    updateProgress();
    showSection(1);
}

$(document).ready(function () {
    initializeForm();

    $('#cep').on('blur', function () {
        const cep = $(this).val().replace(/\D/g, '');

        if (cep.length === 8) {
            $(this).addClass('loading');

            $.getJSON(`https://viacep.com.br/ws/${cep}/json/`, function (data) {
                if (!data.erro) {
                    $('#rua').val(data.logradouro).addClass('auto-filled');
                    $('#bairro').val(data.bairro).addClass('auto-filled');
                    $('#cidade').val(data.localidade).addClass('auto-filled');
                    $('#estado').val(data.uf).addClass('auto-filled');

                    showMessage('Endereço preenchido automaticamente!', 'success');
                } else {
                    clearAddressFields();
                    showMessage('CEP não encontrado. Verifique e tente novamente.', 'error');
                }
            }).fail(function () {
                clearAddressFields();
                showMessage('Erro ao buscar CEP. Verifique sua conexão.', 'error');
            }).always(function () {
                $('#cep').removeClass('loading');
            });
        } else if (cep.length > 0) {
            clearAddressFields();
            showMessage('CEP deve ter 8 dígitos.', 'error');
        }
    });

    function clearAddressFields() {
        $('#rua').val('').removeClass('auto-filled');
        $('#bairro').val('').removeClass('auto-filled');
        $('#cidade').val('').removeClass('auto-filled');
        $('#estado').val('').removeClass('auto-filled');
    }
});

function showMessage(message, type) {
    $('.message').remove();

    const messageClass = type === 'success' ? 'message-success' : 'message-error';
    const messageHtml = `<div class="message ${messageClass}">${message}</div>`;

    $('.form-section.active').prepend(messageHtml);

    setTimeout(function () {
        $('.message').fadeOut(500, function () {
            $(this).remove();
        });
    }, 5000);
}

function showSection(sectionNumber) {
    if (sectionNumber < 1 || sectionNumber > totalSections) return;

    const currentSectionElement = document.querySelector(`[data-section="${currentSection}"]`);
    const nextSectionElement = document.querySelector(`[data-section="${sectionNumber}"]`);

    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active', 'entering', 'exiting', 'prev');
    });

    if (currentSection !== sectionNumber && currentSectionElement) {
        currentSectionElement.classList.add('exiting', 'prev');
    }

    currentSection = sectionNumber;

    setTimeout(() => {
        if (nextSectionElement) {
            nextSectionElement.classList.add('active', 'entering');
        }
    }, currentSection !== sectionNumber ? 250 : 0);

    updateProgress();
}

function nextSection() {
    if (currentSection < totalSections) {

        if (validateCurrentSection()) {
            showSection(currentSection + 1);
            return true;
        }
    }
    return false;
}

function prevSection() {
    if (currentSection > 1) {
        showSection(currentSection - 1);
    }
}

function updateProgress() {
    const progress = (currentSection / totalSections) * 100;
    document.getElementById('progressBarFill').style.width = progress + '%';
    document.getElementById('currentSectionNumber').textContent = currentSection;
}

function validateCurrentSection() {
    const currentSectionElement = document.querySelector(`[data-section="${currentSection}"]`);
    if (!currentSectionElement) return false;

    const requiredFields = currentSectionElement.querySelectorAll('[required]');
    let isValid = true;

    currentSectionElement.querySelectorAll('.error-message').forEach(msg => {
        msg.style.display = 'none';
    });
    currentSectionElement.querySelectorAll('.field-input').forEach(field => {
        field.classList.remove('input-error');
    });

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('input-error');
            const errorMsg = field.parentNode.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.style.display = 'block';
            }
        }
    });

    if (!isValid) {
        const firstError = currentSectionElement.querySelector('.input-error');
        if (firstError) {
            firstError.focus();
        }
        showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
    }

    return isValid;
}

document.addEventListener('DOMContentLoaded', function () {

    const btnContinuar = document.getElementById('btnContinuar');
    if (btnContinuar) {
        btnContinuar.addEventListener('click', function () {
            nextSection();
        });
    }

    const btnVoltarBancario = document.getElementById('btnVoltarBancario');
    if (btnVoltarBancario) {
        btnVoltarBancario.addEventListener('click', function () {
            prevSection();
        });
    }

    const btnContinuarBancario = document.getElementById('btnContinuarBancario');
    if (btnContinuarBancario) {
        btnContinuarBancario.addEventListener('click', function () {
            nextSection();
        });
    }

    const btnVoltarEndereco = document.getElementById('btnVoltarEndereco');
    if (btnVoltarEndereco) {
        btnVoltarEndereco.addEventListener('click', function () {
            prevSection();
        });
    }

    const btnFinalizar = document.getElementById('btnFinalizar');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', function () {
            submitForm();
        });
    }

    document.querySelectorAll('.field-input[required]').forEach(field => {
        field.addEventListener('blur', function () {
            if (this.value.trim()) {
                this.classList.remove('input-error');
                const errorMsg = this.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.style.display = 'none';
                }
            } else {
                this.classList.add('input-error');
                const errorMsg = this.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.style.display = 'block';
                }
            }
        });
    });

    const btnContinuarRosto = document.getElementById('btnContinuarRosto');
    if (btnContinuarRosto) {
        btnContinuarRosto.addEventListener('click', function () {
            hideInstructionsAndRedirect();
        });
    }
});

function validateAllFields() {
    let isValid = true;

    const section1 = document.querySelector('[data-section="1"]');
    if (section1) {
        const requiredFields1 = section1.querySelectorAll('[required]');
        requiredFields1.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('input-error');
                const errorMsg = field.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.style.display = 'block';
                }
            }
        });
    }

    const section2 = document.querySelector('[data-section="2"]');
    if (section2) {
        const requiredFields2 = section2.querySelectorAll('[required]');
        requiredFields2.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('input-error');
                const errorMsg = field.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.style.display = 'block';
                }
            }
        });
    }

    const section3 = document.querySelector('[data-section="3"]');
    if (section3) {
        const requiredFields3 = section3.querySelectorAll('[required]');
        requiredFields3.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('input-error');
                const errorMsg = field.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.style.display = 'block';
                }
            }
        });
    }

    return isValid;
}

async function submitForm() {
    if (!validateAllFields()) {

        const section1 = document.querySelector('[data-section="1"]');
        const section2 = document.querySelector('[data-section="2"]');
        const section3 = document.querySelector('[data-section="3"]');

        let errorSection = 1;
        if (section1) {
            const errors1 = section1.querySelectorAll('.input-error');
            if (errors1.length > 0) {
                errorSection = 1;
            }
        }
        if (section2 && errorSection === 1) {
            const errors2 = section2.querySelectorAll('.input-error');
            if (errors2.length > 0) {
                errorSection = 2;
            }
        }
        if (section3 && errorSection <= 2) {
            const errors3 = section3.querySelectorAll('.input-error');
            if (errors3.length > 0) {
                errorSection = 3;
            }
        }

        showSection(errorSection);
        const errorSectionElement = document.querySelector(`[data-section="${errorSection}"]`);
        if (errorSectionElement) {
            const firstError = errorSectionElement.querySelector('.input-error');
            if (firstError) {
                firstError.focus();
            }
        }

        showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }

    const formatDataToIso = (date) => {
        const [day, month, year] = date.split('/');
        const dateObj = new Date(`${year}-${month}-${day}`);
        return dateObj.toISOString();
    }

    const removeMask = (value) => {
        return value.replace(/\D/g, '');
    }

    const formData = {
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value,
        nome: document.getElementById("nome").value,
        telefone: removeMask(document.getElementById("telefone").value),
        celular: removeMask(document.getElementById("celular").value),
        rg: removeMask(document.getElementById("rg").value),
        dataNascimento: formatDataToIso(document.getElementById("dataNasc").value),
        cpf: removeMask(document.getElementById("cpf").value),
        deficiencia: document.getElementById("deficiencia").value, // OK (existe no db)
        nomeBanco: document.getElementById("nomeBanco").value,
        agencia: document.getElementById("agencia").value,
        numeroConta: document.getElementById("numeroConta").value,
        tipoConta: document.getElementById("tipoConta").value,
        cep: removeMask(document.getElementById("cep").value),
        numero: parseInt(document.getElementById("numero").value),
        rua: document.getElementById("rua").value,
        complemento: document.getElementById("complemento").value,
        bairro: document.getElementById("bairro").value,
        cidade: document.getElementById("cidade").value,
        estado: document.getElementById("estado").value,
        pais: document.getElementById("pais").value
    };

    console.log("Enviando dados:", formData);

    const API_URL = "https://localhost:7006/api/Login/Register";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Erro ao cadastrar:", error);
            return;
        }

        setTimeout(() => {
            showInstructionsScreen();
        }, 1500);

    } catch (error) {
        console.error("Erro na requisição:", error);
    }
}

async function buscarUsuarios() {
    const token = localStorage.getItem("authToken");
    const API_URL = "https://localhost:7006/api/Usuario";

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            }
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Erro ao buscar usuários:", error);
            return;
        }

        const usuarios = await response.json();
        console.log("Usuários encontrados:", usuarios);
    } catch (error) {
        console.error("Erro na requisição GET:", error);
    }
}