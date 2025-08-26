// Sistema de Gerenciamento de Cartões e Gastos
class CartaoGastos {
    constructor() {
        this.cartoes = JSON.parse(localStorage.getItem('cartoes')) || [];
        this.gastos = JSON.parse(localStorage.getItem('gastos')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.atualizarInterface();
    }

    setupEventListeners() {
        // Formulário de vinculação de cartão
        const form = document.querySelector('.payment-container form');
        if (form) {
            form.addEventListener('submit', (e) => this.vincularCartao(e));
        }

        // Botões de compra dos planos
        document.querySelectorAll('.buy-button').forEach(btn => {
            btn.addEventListener('click', (e) => this.processarCompra(e));
        });

        // Formatação automática dos campos
        this.setupFormatacaoCampos();
    }

    setupFormatacaoCampos() {
        // Formatação do número do cartão
        const cardNumber = document.getElementById('cardNumber');
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{4})/g, '$1 ').trim();
                e.target.value = value;
            });
        }

        // Formatação da data de validade
        const cardExpiry = document.getElementById('cardExpiry');
        if (cardExpiry) {
            cardExpiry.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }
    }

    vincularCartao(e) {
        e.preventDefault();
        
        const nome = document.getElementById('cardName').value.trim();
        const numero = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const validade = document.getElementById('cardExpiry').value.trim();
        const cvv = document.getElementById('cardCvv').value.trim();

        if (!this.validarCartao(nome, numero, validade, cvv)) {
            return;
        }

        const cartao = {
            id: Date.now(),
            nome,
            numero: this.mascararNumero(numero),
            validade,
            cvv,
            dataVinculacao: new Date().toISOString(),
            ativo: true
        };

        this.cartoes.push(cartao);
        this.salvarCartoes();
        this.limparFormulario();
        this.mostrarMensagem('Cartão vinculado com sucesso!', 'success');
        this.atualizarInterface();
    }

    validarCartao(nome, numero, validade, cvv) {
        if (!nome || nome.length < 3) {
            this.mostrarMensagem('Nome deve ter pelo menos 3 caracteres', 'error');
            return false;
        }

        if (!numero || numero.length !== 16) {
            this.mostrarMensagem('Número do cartão deve ter 16 dígitos', 'error');
            return false;
        }

        if (!this.validarLuhn(numero)) {
            this.mostrarMensagem('Número do cartão inválido', 'error');
            return false;
        }

        if (!validade || !/^\d{2}\/\d{2}$/.test(validade)) {
            this.mostrarMensagem('Data de validade deve estar no formato MM/AA', 'error');
            return false;
        }

        if (!cvv || cvv.length < 3 || cvv.length > 4) {
            this.mostrarMensagem('CVV deve ter 3 ou 4 dígitos', 'error');
            return false;
        }

        return true;
    }

    validarLuhn(numero) {
        let soma = 0;
        let par = false;
        
        for (let i = numero.length - 1; i >= 0; i--) {
            let digito = parseInt(numero[i]);
            
            if (par) {
                digito *= 2;
                if (digito > 9) digito -= 9;
            }
            
            soma += digito;
            par = !par;
        }
        
        return soma % 10 === 0;
    }

    mascararNumero(numero) {
        return numero.substring(0, 4) + ' **** **** ' + numero.substring(12);
    }

    processarCompra(e) {
        e.preventDefault();
        
        if (this.cartoes.length === 0) {
            this.mostrarMensagem('Você precisa vincular um cartão primeiro!', 'error');
            return;
        }

        const planoTitulo = e.target.closest('.card-inner').querySelector('.plan-title').textContent;
        const preco = this.gerarPrecoAleatorio();
        
        // Simular processamento de pagamento
        this.mostrarMensagem('Processando pagamento...', 'info');
        
        setTimeout(() => {
            const gasto = {
                id: Date.now(),
                cartaoId: this.cartoes[0].id,
                descricao: `Compra - ${planoTitulo}`,
                valor: preco,
                data: new Date().toISOString(),
                status: 'aprovado'
            };

            this.gastos.push(gasto);
            this.salvarGastos();
            this.mostrarMensagem(`Compra aprovada! Valor: R$ ${preco.toFixed(2)}`, 'success');
            this.atualizarInterface();
        }, 2000);
    }

    gerarPrecoAleatorio() {
        const precos = [29.90, 49.90, 79.90, 99.90, 149.90, 199.90];
        return precos[Math.floor(Math.random() * precos.length)];
    }

    limparFormulario() {
        document.getElementById('cardName').value = '';
        document.getElementById('cardNumber').value = '';
        document.getElementById('cardExpiry').value = '';
        document.getElementById('cardCvv').value = '';
    }

    mostrarMensagem(texto, tipo) {
        // Remover mensagens existentes
        const mensagensExistentes = document.querySelectorAll('.mensagem');
        mensagensExistentes.forEach(msg => msg.remove());

        const mensagem = document.createElement('div');
        mensagem.className = `mensagem mensagem-${tipo}`;
        mensagem.textContent = texto;
        
        // Estilos da mensagem
        mensagem.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        // Cores baseadas no tipo
        switch (tipo) {
            case 'success':
                mensagem.style.backgroundColor = '#00B67A';
                break;
            case 'error':
                mensagem.style.backgroundColor = '#e74c3c';
                break;
            case 'info':
                mensagem.style.backgroundColor = '#3498db';
                break;
        }

        document.body.appendChild(mensagem);

        // Remover após 5 segundos
        setTimeout(() => {
            mensagem.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => mensagem.remove(), 300);
        }, 5000);
    }

    atualizarInterface() {
        this.mostrarCartoesVinculados();
        this.mostrarHistoricoGastos();
    }

    mostrarCartoesVinculados() {
        let container = document.querySelector('.cartoes-vinculados');
        if (!container) {
            container = document.createElement('div');
            container.className = 'cartoes-vinculados';
            container.style.cssText = `
                max-width: 500px;
                margin: 20px auto;
                background: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            `;
            
            const paymentContainer = document.querySelector('.payment-container');
            paymentContainer.parentNode.insertBefore(container, paymentContainer.nextSibling);
        }

        if (this.cartoes.length === 0) {
            container.innerHTML = '<h3>Nenhum cartão vinculado</h3><p>Vincule um cartão para fazer compras.</p>';
            return;
        }

        let html = '<h3>Cartões Vinculados</h3>';
        this.cartoes.forEach(cartao => {
            html += `
                <div class="cartao-item" style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
                    <p><strong>Nome:</strong> ${cartao.nome}</p>
                    <p><strong>Número:</strong> ${cartao.numero}</p>
                    <p><strong>Validade:</strong> ${cartao.validade}</p>
                    <p><strong>Status:</strong> <span style="color: #00B67A;">Ativo</span></p>
                    <button onclick="cartaoGastos.removerCartao(${cartao.id})" style="background: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Remover</button>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    mostrarHistoricoGastos() {
        let container = document.querySelector('.historico-gastos');
        if (!container) {
            container = document.createElement('div');
            container.className = 'historico-gastos';
            container.style.cssText = `
                max-width: 500px;
                margin: 20px auto;
                background: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            `;
            
            const cartoesContainer = document.querySelector('.cartoes-vinculados');
            if (cartoesContainer) {
                cartoesContainer.parentNode.insertBefore(container, cartoesContainer.nextSibling);
            }
        }

        if (this.gastos.length === 0) {
            container.innerHTML = '<h3>Histórico de Gastos</h3><p>Nenhum gasto registrado ainda.</p>';
            return;
        }

        let html = '<h3>Histórico de Gastos</h3>';
        const gastosOrdenados = this.gastos.sort((a, b) => new Date(b.data) - new Date(a.data));
        
        gastosOrdenados.forEach(gasto => {
            const data = new Date(gasto.data).toLocaleDateString('pt-BR');
            const cartao = this.cartoes.find(c => c.id === gasto.cartaoId);
            html += `
                <div class="gasto-item" style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
                    <p><strong>Descrição:</strong> ${gasto.descricao}</p>
                    <p><strong>Valor:</strong> R$ ${gasto.valor.toFixed(2)}</p>
                    <p><strong>Data:</strong> ${data}</p>
                    <p><strong>Cartão:</strong> ${cartao ? cartao.numero : 'N/A'}</p>
                    <p><strong>Status:</strong> <span style="color: #00B67A;">${gasto.status}</span></p>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    removerCartao(cartaoId) {
        if (confirm('Tem certeza que deseja remover este cartão?')) {
            this.cartoes = this.cartoes.filter(c => c.id !== cartaoId);
            this.salvarCartoes();
            this.atualizarInterface();
            this.mostrarMensagem('Cartão removido com sucesso!', 'success');
        }
    }

    salvarCartoes() {
        localStorage.setItem('cartoes', JSON.stringify(this.cartoes));
    }

    salvarGastos() {
        localStorage.setItem('gastos', JSON.stringify(this.gastos));
    }
}

// Inicializar o sistema quando a página carregar
let cartaoGastos;
document.addEventListener('DOMContentLoaded', () => {
    cartaoGastos = new CartaoGastos();
});

// Adicionar estilos CSS para as animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .cartoes-vinculados, .historico-gastos {
        transition: all 0.3s ease;
    }
    
    .cartao-item, .gasto-item {
        transition: all 0.3s ease;
    }
    
    .cartao-item:hover, .gasto-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
`;
document.head.appendChild(style);
