// EXPANDIR CARD
document.querySelectorAll(".comando-card").forEach(card => {
    card.addEventListener("click", (e) => {

        // Evita conflito com botão copiar
        if (e.target.classList.contains("copy-btn")) return;

        card.classList.toggle("active");
    });
});