const toast = document.getElementById("toast")

function showToast(message) {
  if (!toast) return

  toast.textContent = message
  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}

function toggleMenu() {
  const menu = document.querySelector(".menu")
  if (!menu) return

  menu.classList.toggle("active")
}

function fecharMenu() {
  const menu = document.querySelector(".menu")
  if (!menu) return

  menu.classList.remove("active")
}

function fazerCadastro(event) {
  event.preventDefault()

  const usuario = {
    nome: document.getElementById("cadNome")?.value,
    email: document.getElementById("cadEmail")?.value,
    telefone: document.getElementById("cadTelefone")?.value,
    senha: document.getElementById("cadSenha")?.value
  }

  localStorage.setItem("wavepointUsuario", JSON.stringify(usuario))
  localStorage.setItem("wavepointLogado", "true")

  window.location.href = "oficial.html"
}

function fazerLogin(event) {
  event.preventDefault()

  const email = document.getElementById("loginEmail")?.value
  const senha = document.getElementById("loginSenha")?.value
  const usuarioSalvo = JSON.parse(localStorage.getItem("wavepointUsuario"))

  if (!usuarioSalvo) {
    showToast("Nenhuma conta encontrada. Faça o cadastro primeiro.")
    return
  }

  if (email === usuarioSalvo.email && senha === usuarioSalvo.senha) {
    localStorage.setItem("wavepointLogado", "true")
    window.location.href = "oficial.html"
  } else {
    showToast("E-mail ou senha incorretos.")
  }
}

function sair() {
  localStorage.setItem("wavepointLogado", "false")
  window.location.href = "home.html"
}

function enviarPreReserva(event) {
  event.preventDefault()
  window.location.href = "cadastro.html"
}

function reservar(servico) {
  const campoServico = document.getElementById("resServico")

  if (campoServico) {
    campoServico.value = servico
  }

  window.location.href = "#reservasOficial"
  fecharMenu()
  showToast(`${servico} selecionado para reserva.`)
}

function enviarReservaOficial(event) {
  event.preventDefault()

  const reserva = {
    nome: document.getElementById("resNome")?.value,
    telefone: document.getElementById("resTelefone")?.value,
    servico: document.getElementById("resServico")?.value,
    data: document.getElementById("resData")?.value,
    horario: document.getElementById("resHorario")?.value,
    entrega: document.getElementById("resEntrega")?.value,
    observacao: document.getElementById("resObs")?.value
  }

  const reservas = JSON.parse(localStorage.getItem("wavepointReservas")) || []
  reservas.unshift(reserva)

  localStorage.setItem("wavepointReservas", JSON.stringify(reservas))

  event.target.reset()
  preencherUsuarioNaReserva()
  carregarReservas()
  showToast("Reserva confirmada com sucesso!")
}

function preencherUsuarioNaReserva() {
  const usuario = JSON.parse(localStorage.getItem("wavepointUsuario"))
  const mensagemUsuario = document.getElementById("mensagemUsuario")
  const resNome = document.getElementById("resNome")
  const resTelefone = document.getElementById("resTelefone")

  if (!usuario) return

  if (mensagemUsuario) {
    mensagemUsuario.textContent = `Olá, ${usuario.nome}! Bem-vindo ao sistema oficial da WavePoint. Aqui você pode reservar equipamentos, agendar aulas e consultar informações completas.`
  }

  if (resNome) resNome.value = usuario.nome
  if (resTelefone) resTelefone.value = usuario.telefone
}

function carregarReservas() {
  const lista = document.getElementById("listaReservas")
  if (!lista) return

  const reservas = JSON.parse(localStorage.getItem("wavepointReservas")) || []

  if (reservas.length === 0) {
    lista.innerHTML = `
      <div class="reserva-item">
        <div>
          <strong>Nenhuma reserva ainda</strong>
          <span>Faça sua primeira reserva pelo formulário acima.</span>
        </div>
      </div>
    `
    return
  }

  lista.innerHTML = reservas.map((reserva, index) => `
    <div class="reserva-item">
      <div>
        <strong>${reserva.servico}</strong>
        <span>${formatarData(reserva.data)} às ${reserva.horario} - ${reserva.entrega}</span>
        <br />
        <span>${reserva.nome} - ${reserva.telefone}</span>
      </div>

      <button 
        class="btn-outline" 
        style="color: var(--azul-escuro); border-color: #c9dce5;" 
        onclick="abrirModalReserva(${index})"
      >
        Ver status
      </button>
    </div>
  `).join("")
}

function abrirModalReserva(index) {
  const reservas = JSON.parse(localStorage.getItem("wavepointReservas")) || []
  const r = reservas[index]
  if (!r) return

  const obs = r.observacao ? r.observacao : "Nenhuma observação informada."

  const modal = document.createElement("div")
  modal.className = "modal-overlay"
  modal.id = "modalReserva"
  modal.innerHTML = `
    <div class="modal-box">
      <button class="modal-close" onclick="fecharModal()">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <h2>RESERVA</h2>
      <div class="modal-servico">${r.servico}</div>

      <div class="modal-info-grid">
        <div class="modal-info-item">
          <span>Cliente</span>
          <strong>${r.nome}</strong>
        </div>
        <div class="modal-info-item">
          <span>WhatsApp</span>
          <strong>${r.telefone}</strong>
        </div>
        <div class="modal-info-item">
          <span>Data</span>
          <strong>${formatarData(r.data)}</strong>
        </div>
        <div class="modal-info-item">
          <span>Horário</span>
          <strong>${r.horario}</strong>
        </div>
        <div class="modal-info-item">
          <span>Entrega</span>
          <strong>${r.entrega}</strong>
        </div>
      </div>

      <div class="modal-obs">
        <span>Observações</span>
        <p>${obs}</p>
      </div>

      <div class="modal-status">Em análise pelo atendimento</div>
    </div>
  `

  modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal()
  })

  document.body.appendChild(modal)
}

function fecharModal() {
  const modal = document.getElementById("modalReserva")
  if (modal) modal.remove()
}

function formatarData(data) {
  if (!data) return "Data não informada"

  const partes = data.split("-")
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

document.addEventListener("click", (event) => {
  const navbar = document.querySelector(".navbar")

  if (navbar && !navbar.contains(event.target)) {
    fecharMenu()
  }
})

document.querySelectorAll(".menu a").forEach((link) => {
  link.addEventListener("click", fecharMenu)
})

window.addEventListener("load", () => {
  preencherUsuarioNaReserva()
  carregarReservas()
})