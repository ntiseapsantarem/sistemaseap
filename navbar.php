<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Navbar SEAP</title>

<!-- Ícones -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}

body {
    background: #f4f4f4;
}

/* NAVBAR */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #0d1b2a;
    padding: 15px 30px;
    color: white;
}

/* LOGO */
.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
    font-weight: bold;
}

.logo img {
    border-radius: 50%;
}

/* MENU */
.nav-links {
    list-style: none;
    display: flex;
    gap: 25px;
}

.nav-links li a {
    text-decoration: none;
    color: white;
    font-size: 16px;
    position: relative;
    transition: 0.3s;
}

/* Linha animada */
.nav-links li a::after {
    content: "";
    width: 0%;
    height: 2px;
    background: #00b4d8;
    position: absolute;
    left: 0;
    bottom: -5px;
    transition: 0.3s;
}

.nav-links li a:hover::after {
    width: 100%;
}

/* ÍCONES */
.icons {
    display: flex;
    gap: 20px;
    font-size: 18px;
}

.icons i {
    cursor: pointer;
    transition: 0.3s;
}

.icons i:hover {
    color: #00b4d8;
}

/* BOTÃO MOBILE */
.menu-toggle {
    display: none;
    font-size: 22px;
    cursor: pointer;
}

/* RESPONSIVO */
@media (max-width: 768px) {

    .nav-links {
        position: absolute;
        top: 70px;
        left: 0;
        width: 100%;
        background: #0d1b2a;
        flex-direction: column;
        align-items: center;
        display: none;
    }

    .nav-links.active {
        display: flex;
    }

    .menu-toggle {
        display: block;
    }

    .icons {
        display: none;
    }
}
</style>
</head>

<body>

<header>
    <nav class="navbar">

        <!-- Logo -->
        <div class="logo">
            <img src="https://via.placeholder.com/40" alt="Logo">
            <span>SEAP</span>
        </div>

        <!-- Menu -->
        <ul class="nav-links" id="menu">
            <li><a href="#">Início</a></li>
            <li><a href="#">Comunicados</a></li>
            <li><a href="#">Escalas</a></li>
            <li><a href="#">Relatórios</a></li>
        </ul>

        <!-- Ícones -->
        <div class="icons">
            <i class="fas fa-search"></i>
            <i class="fas fa-bell"></i>
            <i class="fas fa-user"></i>
        </div>

        <!-- Botão mobile -->
        <div class="menu-toggle" id="menu-toggle">
            <i class="fas fa-bars"></i>
        </div>

    </nav>
</header>

<script>
const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
});
</script>

</body>
</html>