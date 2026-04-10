import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, set, push, remove, onValue } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "sistemas-seap.firebaseapp.com",
  databaseURL: "https://sistemas-seap-default-rtdb.firebaseio.com",
  projectId: "sistemas-seap",
  storageBucket: "sistemas-seap.firebasestorage.app",
  messagingSenderId: "74108776838",
  appId: "1:74108776838:web:a726df977c46511a3cfc07"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let equipe = [];
let escala = {};
const now = new Date();

/* ================================
   EXPOR FUNÇÕES
================================ */
window.addTech = addTech;
window.removerTech = removerTech;
window.saveData = saveData;
window.carregarDados = carregarDados;
window.carregarEscalaView = carregarEscalaView;
window.addAny = addAny;
window.removerAny = removerAny;

/* ================================
   ADICIONAR TECNICO
================================ */
function addTech() {
    const nome = document.getElementById("t-name").value;
    const tel = document.getElementById("t-phone").value;

    if (!nome || !tel) {
        alert("Preencha nome e telefone");
        return;
    }

    const novo = push(ref(db, "equipeTI"));

    set(novo, { nome, tel });

    document.getElementById("t-name").value = "";
    document.getElementById("t-phone").value = "";
}

/* ================================
   REMOVER TECNICO
================================ */
function removerTech(id) {
    remove(ref(db, "equipeTI/" + id));
}

/* ================================
   CARREGAR DADOS (PAINEL)
================================ */
function carregarDados() {

    onValue(ref(db, "equipeTI"), (snap) => {
        equipe = [];

        snap.forEach(c => {
            equipe.push({
                id: c.key,
                ...c.val()
            });
        });

        renderEquipe();
        gerarTabela();
    });

    onValue(ref(db, "escalaTI"), (snap) => {
        escala = snap.val() || {};
        gerarTabela(); // 🔥 atualiza tabela com dados salvos
    });
}

/* ================================
   RENDER EQUIPE
================================ */
function renderEquipe() {

    const div = document.getElementById("tech-list");
    if (!div) return;

    div.innerHTML = "";

    equipe.forEach(t => {
        div.innerHTML += `
            <div class="tech-item">
                ${t.nome} - ${t.tel}
                <button class="btn-del" onclick="removerTech('${t.id}')">X</button>
            </div>
        `;
    });
}

/* ================================
   GERAR TABELA (COM DADOS)
================================ */
function gerarTabela() {

    const tbody = document.getElementById("editor-body");
    if (!tbody) return;

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    let html = "<tr>";

    for (let i = 0; i < firstDay; i++) html += "<td></td>";

    for (let day = 1; day <= daysInMonth; day++) {

        const weekDay = (day + firstDay - 1) % 7;
        if (weekDay === 0 && day > 1) html += "</tr><tr>";

        const key = `${now.getFullYear()}-${now.getMonth()}-${day}`;
        const dado = escala[key] || {};

        html += `
        <td>
            <b>${day}</b><br>

            <select id="tech-${day}">
                <option value="">Selecionar</option>
                ${equipe.map(t => `
                    <option value="${t.nome}" ${dado.nome === t.nome ? "selected" : ""}>
                        ${t.nome}
                    </option>
                `).join("")}
            </select>

            <br>

            <label>
                <input type="checkbox" id="sobreaviso-${day}" ${dado.sobreaviso ? "checked" : ""}>
                SOBREAVISO
            </label>
        </td>
        `;
    }

    tbody.innerHTML = html + "</tr>";
}

/* ================================
   SALVAR ESCALA
================================ */
async function saveData() {

    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    let dados = {};

    for (let day = 1; day <= daysInMonth; day++) {

        const nome = document.getElementById(`tech-${day}`).value;
        const sobreaviso = document.getElementById(`sobreaviso-${day}`).checked;

        if (nome) {
            const key = `${now.getFullYear()}-${now.getMonth()}-${day}`;

            dados[key] = { nome, sobreaviso };
        }
    }

    await set(ref(db, "escalaTI"), dados);

    alert("Escala salva com sucesso!");
}

/* ================================
   VISUALIZAÇÃO (TI.HTML)
================================ */
function carregarEscalaView() {

    onValue(ref(db, "equipeTI"), (snap) => {
        equipe = [];
        snap.forEach(c => equipe.push(c.val()));

        onValue(ref(db, "escalaTI"), (s) => {
            escala = s.val() || {};
            renderView();
        });
    });
}

/* ================================
   RENDER VIEW
================================ */
window.renderView = function () {

    const tbody = document.getElementById("calendar-body");
    if (!tbody) return;

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    let html = "<tr>";

    for (let i = 0; i < firstDay; i++) html += "<td></td>";

    for (let day = 1; day <= daysInMonth; day++) {

        const weekDay = (day + firstDay - 1) % 7;
        if (weekDay === 0 && day > 1) html += "</tr><tr>";

        const key = `${now.getFullYear()}-${now.getMonth()}-${day}`;
        const dado = escala[key];

        let nome = "";
        let sobreaviso = "";

        if (dado) {
            nome = dado.nome;
            if (dado.sobreaviso) sobreaviso = "SOBREAVISO";
        }

        html += `
        <td>
            <b>${day}</b>
            <p>${nome}</p>
            <p>${sobreaviso}</p>
        </td>
        `;

        if (day === now.getDate()) {
            document.getElementById("current-duty").innerText = nome || "Nenhum";

            const tech = equipe.find(t => t.nome === nome);
            document.getElementById("current-phone").innerText =
                tech ? ` - Tel: ${tech.tel}` : "";
        }
    }

    tbody.innerHTML = html + "</tr>";
};

/* ================================
   ANYDESK
================================ */
function addAny() {

    const nome = document.getElementById("any-nome").value;
    const id = document.getElementById("any-id").value;

    if (!nome || !id) {
        alert("Preencha nome e ID");
        return;
    }

    const novo = push(ref(db, "anydesk"));

    set(novo, { nome, id });

    document.getElementById("any-nome").value = "";
    document.getElementById("any-id").value = "";
}

onValue(ref(db, "anydesk"), (snap) => {

    const div = document.getElementById("any-list");
    if (!div) return;

    div.innerHTML = "";

    snap.forEach(c => {
        const item = c.val();
        const key = c.key;

        div.innerHTML += `
            <div class="card-geral" data-nome="${item.nome}" data-id="${item.id}">
                
                <div onclick="window.location.href='anydesk:${item.id}'">
                    <button class="btn-del" onclick="confirmarRemocao('${key}', event)">×</button>
                    ${item.nome}<br>${item.id}
                </div>

            </div>
        `;
    });
});

window.confirmarRemocao = function(id, event) {
    event.stopPropagation(); // evita abrir o anydesk ao clicar no X

    const confirmar = confirm("Tem certeza que deseja excluir este acesso?");

    if (confirmar) {
        removerAny(id);
    }
}

function removerAny(id) {
    remove(ref(db, "anydesk/" + id));
}

window.filtrarAnyDesk = function () {

    const termo = document.getElementById("search-any").value.toLowerCase();
    const cards = document.querySelectorAll(".card-geral");

    cards.forEach(card => {
        const nome = card.getAttribute("data-nome").toLowerCase();
        const id = card.getAttribute("data-id").toLowerCase();

        if (nome.includes(termo) || id.includes(termo)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
};