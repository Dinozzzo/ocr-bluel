// RÉCUPÈRE LE TOKEN STOCKÉ À LA CONNEXION (null si l'utilisateur n'est pas connecté)
const token = localStorage.getItem("token");
console.log(token);

// UTILISATEUR CONNECTÉ : PASSE LE LIEN "login" EN "logout"
if (token !== null) {
  const navLogin = document.getElementById("nav-login");
  navLogin.textContent = "logout";

  // Au clic : supprime le token pour se déconnecter, puis recharge l'accueil
  navLogin.addEventListener("click", (event) => {
    // Empêche le lien de suivre son href (login.html)
    event.preventDefault();
    return (localStorage.removeItem("token"), (window.location.href = "index.html"));
  });
}
