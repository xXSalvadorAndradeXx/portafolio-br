const btn = document.getElementById("btnIdioma");
let idioma = localStorage.getItem("idioma") || "es";

function aplicarIdioma() {
    document.documentElement.lang = idioma;
    btn.textContent = idioma.toUpperCase();

    document.querySelectorAll("[data-es]").forEach(el => {
        el.innerHTML = el.getAttribute(`data-${idioma}`);
    });

    // Cambiar el href del CV
    const cvButton = document.querySelector(".btn-cv-download");
    if (cvButton) {
        cvButton.href = cvButton.getAttribute(`data-href-${idioma}`);
    }
}

aplicarIdioma();

btn.addEventListener("click", () => {
    idioma = idioma === "es" ? "en" : "es";
    localStorage.setItem("idioma", idioma);
    aplicarIdioma();
});