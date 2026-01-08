// ----------------------
// Liste des cartes
// ----------------------
const cartes = [
  "5 Sachets d'Omo",
  "5 Sachets de Milo",
  "Brosse à dent + Dentifrice",
  "1 Paquet de sucre roux",
  "4 Sachets de lait en poudre",
  "5 Spaghettis",
  "1 Boite de petits pois",
  "1 L de Javel",
  "3 Sachet de vermicelles",
  "5 Kg de riz",
  "2 Boites de bonnet rouge",
  "2 Sachets de savon",
];

// ----------------------
// URL du Google Sheet Web App
// ----------------------
const GOOGLE_SHEET_URL = "https://script.google.com/macros/library/d/1lAEXLdBBKaU8EXjENC-Llaq40aKyPXN0ijdsRQfZxsrIp8qcZ2amI7xL/1"; 

// ----------------------
// Normalisation pour clé unique
// ----------------------
function normalize(text) {
  return text.toLowerCase().trim().replace(/\s+/g, "");
}

// ----------------------
// Envoi des tirages vers Google Sheets
// ----------------------
function envoyerTirageSheet(nom, classe, carte) {
  fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    body: JSON.stringify({
      nom: nom,
      classe: classe,
      carte: carte,
      date: new Date().toLocaleString()
    }),
  })
  .then(res => res.json())
  .then(data => console.log("Tirage envoyé :", data))
  .catch(err => console.error("Erreur envoi tirage :", err));
}

// ----------------------
// Fonction principale : tirer une carte
// ----------------------
function tirerCarte() {
  const nomInput = document.getElementById("nom");
  const classeInput = document.getElementById("classe");
  const resultat = document.getElementById("resultat");
  const bouton = document.querySelector("button");

  const nom = normalize(nomInput.value);
  const classe = normalize(classeInput.value);

  if (!nom || !classe) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  const userKey = `user_${nom}_${classe}`;

  // Vérification tirage unique
  if (localStorage.getItem(userKey)) {
    resultat.textContent = "❌ Vous avez déjà tiré une carte";
    resultat.className = "mt-4 fs-5 text-danger fw-bold";
    bouton.disabled = true;
    return;
  }

  // Tirage aléatoire
  const carte = cartes[Math.floor(Math.random() * cartes.length)];
  resultat.textContent = carte;
  resultat.className = "mt-4 fs-3 text-success fw-bold";

  // Marquer l'utilisateur comme ayant tiré
  localStorage.setItem(userKey, "true");

  // Envoi vers Google Sheets
  envoyerTirageSheet(nomInput.value.trim(), classeInput.value.trim(), carte);

  // Désactiver le bouton
  bouton.disabled = true;
}

// ----------------------
// vérifier au chargement si l'utilisateur a déjà tiré
// ----------------------
window.onload = () => {
  const nomInput = document.getElementById("nom");
  const classeInput = document.getElementById("classe");
  const resultat = document.getElementById("resultat");
  const bouton = document.querySelector("button");

  function verifierTirage() {
    const nom = normalize(nomInput.value);
    const classe = normalize(classeInput.value);
    const userKey = `user_${nom}_${classe}`;

    if (localStorage.getItem(userKey)) {
      resultat.textContent = "❌ Vous avez déjà tiré une carte";
      resultat.className = "mt-4 fs-5 text-danger fw-bold";
      bouton.disabled = true;
    } else {
      bouton.disabled = false;
    }
  }

  nomInput.addEventListener("input", verifierTirage);
  classeInput.addEventListener("input", verifierTirage);
};
