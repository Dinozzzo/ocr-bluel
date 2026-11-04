const form = document.getElementById("login-form");
const errorMsg = document.querySelector("#error");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

// RÉCUPÈRE LE MAIL ET MOT DE PASSE SAISIS
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Retire le cadre rouge d'une éventuelle tentative précédente
  emailInput.classList.remove("input-error");
  passwordInput.classList.remove("input-error");

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" } /* Sans ce header, le serveur ne sait pas comment lire ton body */,
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      errorMsg.textContent = "Erreur dans l'identifiant ou le mot de passe";
      emailInput.classList.add("input-error");
      passwordInput.classList.add("input-error");
      return;
    }

    const data = await response.json();
    window.localStorage.setItem("token", data.token);
    window.location.href = "index.html";
  } catch (error) {
    errorMsg.textContent = "Impossible de contacter le serveur";
  }
});
