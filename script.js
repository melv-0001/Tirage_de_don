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

// Normalisation pour clé unique
function normalize(text) {
  return text.toLowerCase().trim().replace(/\s+/g, "");
}

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

  // 🔒 Vérifier si déjà tiré
  if (localStorage.getItem(userKey)) {
    resultat.textContent = "❌ Vous avez déjà tiré une carte";
    resultat.className = "mt-4 fs-5 text-danger fw-bold";
    bouton.disabled = true;
    return;
  }

  // 🎴 Tirage
  const carte = cartes[Math.floor(Math.random() * cartes.length)];
  resultat.textContent = carte;
  resultat.className = "mt-4 fs-3 text-success fw-bold";

  // 💾 Enregistrement admin
  const tirages = JSON.parse(localStorage.getItem("tirages")) || [];
  tirages.push({
    nom: nomInput.value.trim(),
    classe: classeInput.value.trim(),
    carte,
    date: new Date().toLocaleString()
  });
  localStorage.setItem("tirages", JSON.stringify(tirages));

  // 🔐 Marquer comme déjà tiré
  localStorage.setItem(userKey, "true");

  // ⛔ Désactiver le bouton
  bouton.disabled = true;
}
