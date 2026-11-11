// ==================== VARIABLES GLOBALES ====================

const container = document.getElementById("login"); // Section qui contient le formulaire
const form = document.getElementById("login-form");
const errorMsg = document.createElement("p"); // Paragraphe du message d'erreur, créé en JS
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Message d'erreur ajouté vide dès le chargement : sa place est réservée (min-height), la page ne bouge pas
errorMsg.classList.add("error");
container.appendChild(errorMsg);

// ==================== CONNEXION ====================

// ENVOIE L'E-MAIL ET LE MOT DE PASSE À L'API À LA SOUMISSION DU FORMULAIRE
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Empêche le rechargement de la page

  // Récupère les valeurs saisies (trim retire les espaces autour de l'e-mail)
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Retire le cadre rouge d'une éventuelle tentative précédente
  emailInput.classList.remove("input-error");
  passwordInput.classList.remove("input-error");

  try {
    // Envoie les identifiants au serveur en JSON
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Indique au serveur que le body est du JSON
      body: JSON.stringify({ email, password }),
    });

    // Identifiants incorrects (404 utilisateur inconnu, 401 mauvais mot de passe)
    if (!response.ok) {
      errorMsg.textContent = "Erreur dans l'identifiant ou le mot de passe";
      emailInput.classList.add("input-error");
      passwordInput.classList.add("input-error");
      return;
    }

    // Connexion réussie : stocke le token puis redirige vers l'accueil
    const data = await response.json();
    window.localStorage.setItem("token", data.token);
    window.location.href = "index.html";
  } catch (error) {
    // Problème réseau (serveur injoignable)
    errorMsg.textContent = "Impossible de contacter le serveur";
  }
});
