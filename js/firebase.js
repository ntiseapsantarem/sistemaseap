import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, set, push, remove, onValue, get } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDiG3e1jnxmEhrEPQa4eHfx9SamU0uOKec",
  authDomain: "sistemas-seap.firebaseapp.com",
  projectId: "sistemas-seap",
  storageBucket: "sistemas-seap.firebasestorage.app",
  messagingSenderId: "74108776838",
  appId: "1:74108776838:web:a726df977c46511a3cfc07",
  databaseURL: "https://sistemas-seap-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let equipe = [];
let escala = {};
const now = new Date();

window.addAny = addAny;
window.removerAny = removerAny;
window.addTech = addTech;
window.saveData = saveData;
window.carregarDados = carregarDados;

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

    const equipeRef = ref(db, "equipeTI");
    const novoTech = push(equipeRef);

    set(novoTech, {
        nome: nome,
        tel: tel
    });

    document.getElementById("t-name").value = "";
    document.getElementById("t-phone").value = "";
}

/* ================================
   CARREGAR DADOS
================================ */

function carregarDados() {

    const equipeRef = ref(db, "equipeTI");

    onValue(equipeRef, (snapshot) => {

        equipe = [];

        snapshot.forEach(child => {
            equipe.push({
                id: child.key,
                ...child.val()
            });
        });

        renderEquipe();
        gerarTabela();
    });

    const escalaRef = ref(db, "escalaTI");

    onValue(escalaRef, (snapshot) => {
        escala = snapshot.val() || {};
    });
}

/* ================================
   RENDER EQUIPE
================================ */

function renderEquipe() {

    const div = document.getElementById("tech-list");

    div.innerHTML = "";

    equipe.forEach(tech => {

        div.innerHTML += `
            <div class="tech-item">
                ${tech.nome} - ${tech.tel}
                <button class="btn-del" onclick="removerTech('${tech.id}')">X</button>
            </div>
        `;
    });
}

window.removerTech = function(id) {

    remove(ref(db, "equipeTI/" + id));
};

/* ================================
   GERAR TABELA
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

        html += `
        <td>
            <b class="day-number">${day}</b><br>

            <select id="tech-${day}" class="tech-name">
                <option value="">Selecionar</option>
                ${equipe.map(t => `<option value="${t.nome}">${t.nome}</option>`).join("")}
            </select>

            <br>

            <label class="weekend-text">
                <input type="checkbox" id="sobreaviso-${day}">
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

function saveData() {

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    let dados = {};

    for (let day = 1; day <= daysInMonth; day++) {

        const nome = document.getElementById(`tech-${day}`).value;
        const sobreaviso = document.getElementById(`sobreaviso-${day}`).checked;

        if (nome) {

            const key = `${now.getFullYear()}-${now.getMonth()}-${day}`;

            dados[key] = {
                nome: nome,
                sobreaviso: sobreaviso
            };
        }
    }

    set(ref(db, "escalaTI"), dados);

    alert("Escala salva com sucesso!");
}

/* ================================
   CARREGAR ESCALA NA TI.HTML
================================ */

window.carregarEscalaView = function() {

    const escalaRef = ref(db, "escalaTI");
    const equipeRef = ref(db, "equipeTI");

    onValue(equipeRef, (snap) => {

        equipe = [];

        snap.forEach(c => {
            equipe.push(c.val());
        });

        onValue(escalaRef, (s) => {

            escala = s.val() || {};

            renderView();
        });
    });
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

    const refAny = ref(db, "anydesk");
    const novo = push(refAny);

    set(novo, {
        nome: nome,
        id: id
    });

    document.getElementById("any-nome").value = "";
    document.getElementById("any-id").value = "";
}

const anyRef = ref(db, "anydesk");

onValue(anyRef, (snapshot) => {

    let lista = [];

    snapshot.forEach(child => {
        lista.push({
            key: child.key,
            ...child.val()
        });
    });

    renderAny(lista);
});

function renderAny(lista) {

    const div = document.getElementById("any-list");

    div.innerHTML = "";

    lista.forEach(item => {

        div.innerHTML += `
            <div class="card-geral" id="any-list" onclick="any(${item.id})">${item.nome}<br>${item.id}</div>
        `;
    });
}

function removerAny(id) {
    remove(ref(db, "anydesk/" + id));
}

<script type="module" src="../js/page.js"></script>


/* ================================
   RENDER VIEW
================================ */

window.renderView = function() {

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
            if (dado.sobreaviso) sobreaviso = "<br>SOBREAVISO";
        }

        html += `
        <td>
            <b class="day-number">${day}</b>
            <p class="tech-name">${nome}</p>
            <p class="weekend-text">${sobreaviso}</p>
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