// Senha de Acesso ao Sistema de Gestão
const SENHA_SISTEMA = "sistema123";

// Função para validar CPF (Aceita qualquer entrada com 11 números)
function isCpfValido() {
  const cpfInput = document.getElementById('cpf');
  if (!cpfInput) return false;
  
  // Extrai apenas os números da string digitada
  const cpfApenasNumeros = cpfInput.value.replace(/\D/g, '');
  return cpfApenasNumeros.length === 11;
}

// Função para validar E-mail (@ e .com)
function isEmailValido() {
  const emailInput = document.getElementById('email');
  if (!emailInput) return false;
  
  const email = emailInput.value.trim().toLowerCase();
  return email.includes('@') && email.includes('.com');
}

// Alternar exibição dos campos de pagamento (PIX ou Cartão)
function handlePaymentChange(metodo) {
  const cardFields = document.getElementById('card-fields');
  const pixFields = document.getElementById('pix-fields');
  const selectPagamento = document.getElementById('pagamento');

  // Se o utilizador desmarcar a opção, apenas oculta os campos extra
  if (!metodo) {
    if (cardFields) cardFields.classList.add('hidden');
    if (pixFields) pixFields.classList.add('hidden');
    setCardInputsRequired(false);
    return;
  }

  // 1. Bloqueia e limpa a seleção se o CPF não tiver exatamente 11 dígitos numéricos
  if (!isCpfValido()) {
    alert("cpf invalido");
    selectPagamento.value = ""; // Reseta o select
    if (cardFields) cardFields.classList.add('hidden');
    if (pixFields) pixFields.classList.add('hidden');
    setCardInputsRequired(false);
    document.getElementById('cpf').focus();
    return;
  }

  // 2. Bloqueia e limpa a seleção se o e-mail não tiver @ e .com
  if (!isEmailValido()) {
    alert("email invalido");
    selectPagamento.value = ""; // Reseta o select
    if (cardFields) cardFields.classList.add('hidden');
    if (pixFields) pixFields.classList.add('hidden');
    setCardInputsRequired(false);
    document.getElementById('email').focus();
    return;
  }

  // Oculta ambos por padrão
  if (cardFields) cardFields.classList.add('hidden');
  if (pixFields) pixFields.classList.add('hidden');
  setCardInputsRequired(false);

  // Exibe a opção escolhida se todos os dados estiverem válidos
  if (metodo === 'cartao_credito' || metodo === 'cartao_debito') {
    if (cardFields) cardFields.classList.remove('hidden');
    setCardInputsRequired(true);
  } else if (metodo === 'pix') {
    if (pixFields) pixFields.classList.remove('hidden');
  }
}

// Define obrigatoriedade dos campos de cartão conforme a escolha
function setCardInputsRequired(required) {
  const num = document.getElementById('card-number');
  const holder = document.getElementById('card-holder');
  const expiry = document.getElementById('card-expiry');
  const cvv = document.getElementById('card-cvv');

  if (num) num.required = required;
  if (holder) holder.required = required;
  if (expiry) expiry.required = required;
  if (cvv) cvv.required = required;
}

// Copiar chave Pix simulada
function copiarPix() {
  const pixInput = document.getElementById('pix-key');
  if (pixInput) {
    pixInput.select();
    pixInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(pixInput.value);
    alert("Chave Pix Copia e Cola copiada para a área de transferência!");
  }
}

// Submissão da Matrícula Online
function handleEnroll(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const metodo = document.getElementById('pagamento').value;

  // Revalidação no momento do envio do formulário
  if (!isCpfValido()) {
    alert("cpf invalido");
    document.getElementById('cpf').focus();
    return;
  }

  if (!isEmailValido()) {
    alert("email invalido");
    document.getElementById('email').focus();
    return;
  }

  // Processamento do Pagamento
  if (metodo === 'pix') {
    alert(`Matrícula pré-registrada para ${nome}!\nAguardando confirmação do pagamento via PIX.`);
  } else if (metodo === 'cartao_credito' || metodo === 'cartao_debito') {
    alert(`Matrícula efetuada com sucesso para ${nome}!\nO pagamento com cartão foi processado.`);
  } else {
    alert(`Matrícula efetuada com sucesso para ${nome}!\nAguardando pagamento no balcão.`);
  }

  // Reseta o formulário e oculta as formas de pagamento
  event.target.reset();
  handlePaymentChange('');
}

// Solicitar Acesso ao Sistema de Gestão
function solicitarAcessoSistema(event) {
  event.preventDefault();
  const sistemaSecao = document.getElementById('sistema');

  if (!sistemaSecao.classList.contains('system-hidden')) {
    sistemaSecao.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const senhaInserida = prompt("Acesso Restrito ao Sistema de Gestão.\nDigite a senha de acesso:");

  if (senhaInserida === SENHA_SISTEMA) {
    sistemaSecao.classList.remove('system-hidden');
    alert("Acesso concedido com sucesso!");
    sistemaSecao.scrollIntoView({ behavior: 'smooth' });
  } else if (senhaInserida !== null) {
    alert("Senha incorreta! Acesso negado.");
  }
}

// Bloquear Sistema (Logout)
function bloquearSistema() {
  const sistemaSecao = document.getElementById('sistema');
  sistemaSecao.classList.add('system-hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  alert("Sessão encerrada. O sistema de gestão foi bloqueado.");
}

// Cancelamento de Matrícula na Tabela
function cancelarMatricula(matricula, nome, rowId, statusId) {
  const confirmacao = confirm(`Tem certeza de que deseja cancelar a matrícula ${matricula} de ${nome}?`);
  if (confirmacao) {
    const statusElemento = document.getElementById(statusId);
    if (statusElemento) {
      statusElemento.textContent = "Cancelado";
      statusElemento.className = "status canceled";
    }
    alert(`Matrícula ${matricula} de ${nome} foi cancelada com sucesso.`);
  }
}

// Formulário de Cancelamento/Renovação
function handleCancelamentoForm(event) {
  event.preventDefault();
  const idInput = document.getElementById('cancel-input-id').value;
  const acao = document.getElementById('cancel-action').value;

  if (acao === "cancelar") {
    alert(`Solicitação de cancelamento para '${idInput}' processada com sucesso.`);
  } else if (acao === "renovar") {
    alert(`Matrícula '${idInput}' renovada com sucesso.`);
  } else {
    alert(`Plano alterado com sucesso para '${idInput}'.`);
  }
  event.target.reset();
}

// Mostrar/Ocultar Detalhes dos Planos
function toggleDetails(id) {
  const content = document.getElementById(id);
  if (content) {
    content.style.display = (content.style.display === "block") ? "none" : "block";
  }
}

// Troca de Tabs do Sistema de Gestão
function switchTab(tabName) {
  document.querySelectorAll('.sys-tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.sys-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  const selectedTab = document.getElementById(`tab-${tabName}`);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
  
  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.add('active');
  }
}

// Simulação de Níveis de Acesso (RBAC)
function changeRole(role) {
  const gerenteBtns = document.querySelectorAll('.perm-gerente');
  const matriculaBtns = document.querySelectorAll('.perm-matricula');
  const pagamentoBtns = document.querySelectorAll('.perm-pagamento');

  if (role === 'INSTRUTOR') {
    gerenteBtns.forEach(el => el.style.display = 'none');
    matriculaBtns.forEach(el => el.style.display = 'none');
    pagamentoBtns.forEach(el => el.style.display = 'none');
    switchTab('alunos');
  } else if (role === 'RECEPCIONISTA') {
    gerenteBtns.forEach(el => el.style.display = 'none');
    matriculaBtns.forEach(el => el.style.display = 'inline-block');
    pagamentoBtns.forEach(el => el.style.display = 'inline-block');
  } else {
    gerenteBtns.forEach(el => el.style.display = 'inline-block');
    matriculaBtns.forEach(el => el.style.display = 'inline-block');
    pagamentoBtns.forEach(el => el.style.display = 'inline-block');
  }
}
// Controle de dias da Agenda (limite de até 1 semana/7 dias à frente)
let offsetDiasAgenda = 0; // 0 = Hoje, até 6 = +6 dias (total 7 dias)

function formatarDataAgenda(offset) {
  const data = new Date();
  data.setDate(data.getDate() + offset);

  const diasSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

  const diaSemana = diasSemana[data.getDay()];
  const diaNum = String(data.getDate()).padStart(2, '0');
  const mes = meses[data.getMonth()];

  return `${diaSemana}, ${diaNum} DE ${mes}`;
}

function mudarDataAgenda(direcao) {
  const novoOffset = offsetDiasAgenda + direcao;

  if (novoOffset < 0) {
    alert("Não é possível agendar para datas passadas.");
    return;
  }

  if (novoOffset > 6) {
    alert("Agendamentos disponíveis apenas para até 1 semana (7 dias).");
    return;
  }

  offsetDiasAgenda = novoOffset;
  document.getElementById('display-data-agenda').textContent = formatarDataAgenda(offsetDiasAgenda);
}

// Inicializa a data atual no carregamento da página
document.addEventListener('DOMContentLoaded', () => {
  const elemData = document.getElementById('display-data-agenda');
  if (elemData) {
    elemData.textContent = formatarDataAgenda(0);
  }
});

// Agendar aula e enviar para o Sistema de Gestão
function agendarAula(nomeAula, horario) {
  const dataSelecionada = document.getElementById('display-data-agenda').textContent;

  const confirmacao = confirm(`Confirmar agendamento?\n\nAula: ${nomeAula}\nHorário: ${horario}\nData: ${dataSelecionada}`);
  
  if (confirmacao) {
    // 1. Tenta adicionar na tabela/lista de agendamentos do Sistema de Gestão (se existir a tabela de agendamentos)
    const tabelaAgendamentos = document.getElementById('tabela-agendamentos-body');
    
    if (tabelaAgendamentos) {
      const novaLinha = document.createElement('tr');
      const idAgendamento = 'AGD-' + Math.floor(1000 + Math.random() * 9000);
      
      novaLinha.innerHTML = `
        <td>${idAgendamento}</td>
        <td>Aluno Visitante / Web</td>
        <td>${nomeAula}</td>
        <td>${dataSelecionada} às ${horario}</td>
        <td><span class="status active">Confirmado</span></td>
      `;
      tabelaAgendamentos.appendChild(novaLinha);
    }

    alert(`Agendamento de ${nomeAula} (${horario} - ${dataSelecionada}) realizado com sucesso e enviado ao Sistema de Gestão!`);
  }
}