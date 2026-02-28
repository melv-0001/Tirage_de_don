// Tes infos Supabase
const SUPABASE_URL = 'https://tvqnamntcspmbggldziw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2cW5hbW50Y3NwbWJnZ2xkeml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NzE0NDAsImV4cCI6MjA4MzU0NzQ0MH0.zk4-Rilmh-Vj3lwWVyCGU7oLBcoTn3caoQJ_dFAWvQk';

// Utiliser le SDK global fourni par le CDN
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Normalisation pour clé unique
function normalize(text) {
  return text.toLowerCase().trim().replace(/\s+/g, "");
}

// Fonction globale
window.tirerCarte = async function() {
  const nomInput = document.getElementById("nom");
  const classeInput = document.getElementById("classe");
  const resultat = document.getElementById("resultat");
  const bouton = document.querySelector("button");

  const nom = normalize(nomInput.value);
  const classe = normalize(classeInput.value);

  if (!nom || !classe) { 
    alert("Remplissez tous les champs"); 
    return; 
  }

  const userKey = `user_${nom}_${classe}`;

  // 🔒 Vérifier si déjà tiré localement
  if (localStorage.getItem(userKey)) {
    resultat.textContent = "❌ Vous avez déjà tiré une carte";
    resultat.className = "mt-4 fs-5 text-danger fw-bold";
    bouton.disabled = true;
    return;
  }

  // 🎴 Tirage aléatoire
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
  const carte = cartes[Math.floor(Math.random() * cartes.length)];

  // 🔹 Affichage immédiat
  resultat.textContent = carte;
  resultat.className = "mt-4 fs-3 text-success fw-bold";

  // 🔹 Marquer comme déjà tiré localement
  localStorage.setItem(userKey, "true");
  bouton.disabled = true;

  // 🔹 Enregistrement dans Supabase
  try {
    const { data, error } = await supabaseClient
      .from("tirage")
      .insert([{ nom: nomInput.value.trim(), classe: classeInput.value.trim(), carte }]);

    if (error) {
      console.error("Erreur Supabase :", error);
      alert("Erreur lors de l'enregistrement côté Supabase ! (Vérifie RLS / table tirage)");
    } else {
      console.log("Tirage enregistré :", data);
    }
  } catch (err) {
    console.error("Erreur fetch :", err);
    alert("Impossible de contacter Supabase !");
  }
};
