document.querySelectorAll(".comando-card").forEach(card => {
    const header = card.querySelector(".comando-header");

    header.addEventListener("click", () => {
        card.classList.toggle("active");
    });
});