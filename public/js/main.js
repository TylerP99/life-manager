const navSection = document.querySelector(".nav-section");

const navButton = document.querySelector(".open-nav");

navButton.addEventListener("click", toggle_nav);

function toggle_nav(e) {
    e.preventDefault();

    navButton.classList.toggle("open");
    navSection.classList.toggle("nav-open");
}