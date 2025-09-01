let currentSection = 1;
        const totalSections = 3;

        // Aplicar máscaras
        $(document).ready(function() {
            $('.cpf-mask').mask('000.000.000-00');
            $('.rg-mask').mask('00.000.000-0');
            $('.date-mask').mask('00/00/0000');
            $('.phone-mask').mask('(00) 00000-0000');
            $('.cep-mask').mask('00000-000');
            
            // Auto-completar endereço pelo CEP
            $('#cep').on('blur', function() {
                const cep = $(this).val().replace(/\D/g, '');
                
                if (cep.length === 8) {
                    // Mostrar indicador de carregamento
                    $(this).addClass('loading');
                    
                    // Buscar CEP na API ViaCEP
                    $.getJSON(`https://viacep.com.br/ws/${cep}/json/`, function(data) {
                        if (!data.erro) {
                            // Preencher campos automaticamente
                            $('#rua').val(data.logradouro).addClass('auto-filled');
                            $('#bairro').val(data.bairro).addClass('auto-filled');
                            $('#cidade').val(data.localidade).addClass('auto-filled');
                            $('#estado').val(data.uf).addClass('auto-filled');
                            
                            // Mostrar mensagem de sucesso
                            showMessage('Endereço preenchido automaticamente!', 'success');
                            
                            // Focar no campo número para facilitar o preenchimento
                            $('#numero').focus();
                        } else {
                            // Limpar campos se CEP não for encontrado
                            clearAddressFields();
                            showMessage('CEP não encontrado. Verifique e tente novamente.', 'error');
                        }
                    }).fail(function() {
                        // Limpar campos se houver erro na API
                        clearAddressFields();
                        showMessage('Erro ao buscar CEP. Verifique sua conexão.', 'error');
                    }).always(function() {
                        // Remover indicador de carregamento
                        $('#cep').removeClass('loading');
                    });
                } else if (cep.length > 0) {
                    // Se CEP não tiver 8 dígitos, limpar campos
                    clearAddressFields();
                    showMessage('CEP deve ter 8 dígitos.', 'error');
                }
            });
            
            // Função para limpar campos de endereço
            function clearAddressFields() {
                $('#rua').val('').removeClass('auto-filled');
                $('#bairro').val('').removeClass('auto-filled');
                $('#cidade').val('').removeClass('auto-filled');
                $('#estado').val('').removeClass('auto-filled');
            }
        });
        
        // Função para mostrar mensagens
        function showMessage(message, type) {
            // Remover mensagens anteriores
            $('.message').remove();
            
            const messageClass = type === 'success' ? 'message-success' : 'message-error';
            const messageHtml = `<div class="message ${messageClass}">${message}</div>`;
            
            // Inserir mensagem após o campo CEP
            $('#cep').parent().after(messageHtml);
            
            // Remover mensagem após 5 segundos
            setTimeout(function() {
                $('.message').fadeOut(500, function() {
                    $(this).remove();
                });
            }, 5000);
        }

        function nextSection() {
            if (validateCurrentSection()) {
                if (currentSection < totalSections) {
                    currentSection++;
                    updateProgressBar();
                    showSection(currentSection);
                }
            }
        }

        function prevSection() {
            if (currentSection > 1) {
                currentSection--;
                updateProgressBar();
                showSection(currentSection);
            }
        }

        function showSection(sectionNumber) {
            // Esconder todas as seções
            document.querySelectorAll('.form-section').forEach(section => {
                section.classList.remove('active');
            });

            // Mostrar seção atual
            document.getElementById(`section-${sectionNumber}`).classList.add('active');
        }

        function updateProgressBar() {
            document.querySelectorAll('.step').forEach((step, index) => {
                const stepNumber = index + 1;
                step.classList.remove('active', 'completed');
                
                if (stepNumber < currentSection) {
                    step.classList.add('completed');
                } else if (stepNumber === currentSection) {
                    step.classList.add('active');
                }
            });
        }

        function validateCurrentSection() {
            const currentSectionElement = document.getElementById(`section-${currentSection}`);
            const requiredFields = currentSectionElement.querySelectorAll('[required]');
            let isValid = true;

            // Limpar mensagens de erro anteriores
            currentSectionElement.querySelectorAll('.error-message').forEach(msg => {
                msg.style.display = 'none';
            });
            currentSectionElement.querySelectorAll('input, select').forEach(field => {
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

            return isValid;
        }

        // Validação do formulário completo
        document.getElementById('cadastroForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateCurrentSection()) {
                // Aqui você pode enviar os dados para o servidor
                alert('Cadastro realizado com sucesso!');
                console.log('Dados do formulário:', new FormData(this));
            }
        });

        // Validação em tempo real
        document.querySelectorAll('input, select').forEach(field => {
            field.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('input-error');
                    const errorMsg = this.parentNode.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.style.display = 'block';
                    }
                } else {
                    this.classList.remove('input-error');
                    const errorMsg = this.parentNode.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.style.display = 'none';
                    }
                }
            });
        });