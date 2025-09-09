# Sistema de Cartões e Gastos - Projeto Willian

## Descrição
Este sistema permite vincular cartões de crédito/débito e registrar gastos quando os cartões são utilizados para compras. É uma implementação completa com validação de cartões, armazenamento local e interface responsiva.

## Funcionalidades

### 1. Vinculação de Cartões
- **Formulário completo**: Nome, número, validade e CVV
- **Validação automática**: Algoritmo de Luhn para verificar números de cartão
- **Formatação automática**: Número do cartão e data de validade
- **Mascaramento**: Número do cartão é mascarado para segurança

### 2. Processamento de Compras
- **Botões de compra**: Cada plano tem um botão funcional
- **Validação de cartão**: Verifica se há cartão vinculado antes da compra
- **Simulação de pagamento**: Processa pagamentos com delay realista
- **Preços aleatórios**: Gera preços variados para demonstração

### 3. Gestão de Gastos
- **Histórico completo**: Todas as transações são registradas
- **Detalhes da compra**: Descrição, valor, data e cartão utilizado
- **Status de aprovação**: Todas as transações são marcadas como aprovadas
- **Ordenação por data**: Gastos mais recentes aparecem primeiro

### 4. Interface do Usuário
- **Design responsivo**: Funciona em dispositivos móveis e desktop
- **Temas claro/escuro**: Suporte completo ao sistema de temas
- **Animações suaves**: Transições e efeitos visuais
- **Mensagens de feedback**: Notificações para sucesso, erro e informação

## Como Usar

### Passo 1: Vincular um Cartão
1. Preencha o formulário "Vincular Cartão" com:
   - **Nome no Cartão**: Seu nome completo
   - **Número do Cartão**: 16 dígitos (será formatado automaticamente)
   - **Validade**: Formato MM/AA (será formatado automaticamente)
   - **CVV**: 3 ou 4 dígitos
2. Clique em "Vincular Cartão"
3. O sistema validará os dados e salvará o cartão

### Passo 2: Fazer uma Compra
1. Escolha um plano no carrossel
2. Clique no botão "Comprar"
3. O sistema processará o pagamento automaticamente
4. Uma mensagem de confirmação será exibida
5. O gasto será registrado no histórico

### Passo 3: Gerenciar Cartões
- **Visualizar**: Todos os cartões vinculados são exibidos
- **Remover**: Clique em "Remover" para excluir um cartão
- **Status**: Cartões ativos são marcados claramente

### Passo 4: Acompanhar Gastos
- **Histórico completo**: Todas as transações são listadas
- **Detalhes**: Valor, data, descrição e cartão utilizado
- **Ordenação**: Gastos mais recentes aparecem primeiro

## Validações Implementadas

### Cartão de Crédito
- **Número**: Deve ter exatamente 16 dígitos
- **Algoritmo de Luhn**: Verifica se o número é válido
- **Nome**: Mínimo de 3 caracteres
- **Validade**: Formato MM/AA obrigatório
- **CVV**: 3 ou 4 dígitos obrigatórios

### Processamento de Pagamento
- **Cartão vinculado**: Deve haver pelo menos um cartão ativo
- **Simulação realista**: Delay de 2 segundos para processamento
- **Preços variados**: R$ 29,90 a R$ 199,90 para demonstração

## Armazenamento

### LocalStorage
- **Cartões**: `cartoes` - Array de cartões vinculados
- **Gastos**: `gastos` - Array de transações realizadas
- **Persistência**: Dados são mantidos entre sessões do navegador

### Estrutura dos Dados
```javascript
// Cartão
{
    id: timestamp,
    nome: "Nome do Titular",
    numero: "1234 **** **** 5678",
    validade: "12/25",
    cvv: "123",
    dataVinculacao: "2024-01-01T00:00:00.000Z",
    ativo: true
}

// Gasto
{
    id: timestamp,
    cartaoId: 1234567890,
    descricao: "Compra - Plano Premium",
    valor: 99.90,
    data: "2024-01-01T00:00:00.000Z",
    status: "aprovado"
}
```

## Arquivos do Sistema

### JavaScript
- `js/cartao-gastos.js` - Lógica principal do sistema

### CSS
- `CSS/cartao-gastos.css` - Estilos específicos do sistema

### HTML
- `teste-comprar.html` - Página principal com formulário e carrossel

## Tecnologias Utilizadas

- **HTML5**: Estrutura da página
- **CSS3**: Estilos e animações
- **JavaScript ES6+**: Lógica do sistema
- **LocalStorage**: Armazenamento local
- **Algoritmo de Luhn**: Validação de cartões

## Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge (versões modernas)
- **Dispositivos**: Desktop, tablet e mobile
- **Resolução**: Responsivo para todas as telas

## Segurança

- **Dados mascarados**: Números de cartão são parcialmente ocultos
- **Validação local**: Todas as validações são feitas no cliente
- **Sem transmissão**: Dados não são enviados para servidores externos
- **Armazenamento local**: Informações ficam apenas no navegador

## Personalização

### Cores
- **Primária**: #00B67A (verde)
- **Erro**: #e74c3c (vermelho)
- **Informação**: #3498db (azul)

### Preços dos Planos
- **Básico**: R$ 29,90
- **Padrão**: R$ 49,90
- **Avançado**: R$ 79,90
- **Premium**: R$ 99,90
- **Empresarial**: R$ 149,90
- **Plus**: R$ 199,90

## Suporte

Para dúvidas ou problemas:
1. Verifique se todos os arquivos estão na pasta correta
2. Confirme se o navegador suporta JavaScript ES6+
3. Verifique se o LocalStorage está habilitado
4. Teste em modo incógnito para verificar cache

## Futuras Melhorias

- [ ] Integração com APIs de pagamento reais
- [ ] Sistema de categorias para gastos
- [ ] Relatórios e gráficos de gastos
- [ ] Exportação de dados
- [ ] Múltiplas moedas
- [ ] Backup na nuvem
- [ ] Notificações push
- [ ] Modo offline






