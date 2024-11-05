document.getElementById('editBtn').addEventListener('click', function() {
    // Ativar campos para edição
    document.getElementById('name').disabled = false;
    document.getElementById('email').disabled = false;
    document.getElementById('password').disabled = false;
  
    // Habilitar botão de salvar
    document.getElementById('saveBtn').disabled = false;
  });
  
  document.getElementById('accountForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o comportamento padrão de envio do formulário
  
    // Simulação de salvamento dos dados
    alert('Informações salvas com sucesso!');
  
    // Desativar campos após salvamento
    document.getElementById('name').disabled = true;
    document.getElementById('email').disabled = true;
    document.getElementById('password').disabled = true;
  
    // Desabilitar botão de salvar
    document.getElementById('saveBtn').disabled = true;
  });
  