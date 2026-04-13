document.querySelectorAll(".card-expansivo").forEach(card => {
    const header = card.querySelector(".card-expansivo-btn");

    header.addEventListener("click", () => {
        card.classList.toggle("active");
    });
});