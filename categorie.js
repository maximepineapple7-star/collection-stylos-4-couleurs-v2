const SUPABASE_URL = "https://onohxbsakdwfieiipqse.supabase.co";
const SUPABASE_KEY = "sb_publishable_h-v5IyPAwmL5yuOSHgBqzg_muZPd-yz";

let styloArray = [];
let statutsActifs = [];

async function chargerCollection() {
const container = document.getElementById("collection");
try {
 const response = await fetch(
 `${SUPABASE_URL}/rest/v1/stylos?select=*`,
 {
 headers: {
 "apikey": SUPABASE_KEY,
 "Authorization": `Bearer ${SUPABASE_KEY}`
 }
 }
 );
 styloArray = await response.json();
 appliquerFiltres();
} catch (error) {
 container.innerHTML = "<p>Erreur de chargement. Vérifie ta connexion à Supabase.</p>";
 console.error(error);
}
}

function appliquerFiltres() {
const typeChoisi = document.getElementById("filtre-type").value.toLowerCase();
let resultat = styloArray;

if (typeChoisi) {
 resultat = resultat.filter(s =>
 (s.categorie || []).some(c => c.toLowerCase().includes(typeChoisi))
 );
}

if (statutsActifs.length > 0) {
 resultat = resultat.filter(s => statutsActifs.includes(s.statut));
}

afficherStylos(resultat);
}

function afficherStylos(stylos) {
const container = document.getElementById("collection");
if (stylos.length === 0) {
 container.innerHTML = "<p>Aucun stylo ne correspond à ce filtre.</p>";
 return;
}
container.innerHTML = "";
stylos.forEach(stylo => {
 const card = document.createElement("div");
 card.className = "stylo-card";
 const statutClass = stylo.statut === "possédé" ? "possede"
 : stylo.statut === "en négociation" ? "negociation"
 : "recherche";
 card.innerHTML = `
 <img src="${stylo.photo_url || ''}" alt="${stylo.nom || 'Stylo'}">
 <h3>${stylo.nom || 'Sans nom'}</h3>
 <p>${(stylo.categorie || []).join(', ')}</p>
 <span class="badge ${statutClass}">${stylo.statut || ''}</span>
 `;
 card.addEventListener("click", () => ouvrirDetailVue(stylo));
 container.appendChild(card);
});
}

function ouvrirDetailVue(stylo) {
const contenu = document.getElementById("detail-vue-contenu");
contenu.innerHTML = `
 ${stylo.photo_url ? `<img src="${stylo.photo_url}" alt="${stylo.nom || ''}">` : ''}
 <h2>${stylo.nom || 'Sans nom'}</h2>
 <p><strong>Catégorie :</strong> ${(stylo.categorie || []).join(', ') || '-'}</p>
 <p><strong>Rareté de circulation :</strong> ${stylo.rarete_circulation || '-'}</p>
 <p><strong>Rareté d'acquisition :</strong> ${stylo.rarete_acquisition || '-'}</p>
 <p><strong>Source :</strong> ${stylo.source || '-'}</p>
 <p><strong>Année d'acquisition :</strong> ${stylo.date_acquisition || '-'}</p>
 <p><strong>Statut :</strong> ${stylo.statut || '-'}</p>
 <p><strong>Ville :</strong> ${stylo.lieu_ville || '-'}</p>
 <p><strong>Lieu :</strong> ${stylo.lieu_nom || '-'}</p>
 <p><strong>Notes :</strong> ${stylo.notes || '-'}</p>
`;
document.getElementById("modal-voir-detail").style.display = "flex";
}

document.getElementById("fermer-modal-detail-vue").addEventListener("click", () => {
document.getElementById("modal-voir-detail").style.display = "none";
});

document.getElementById("modal-voir-detail").addEventListener("click", (e) => {
if (e.target.id === "modal-voir-detail") {
 document.getElementById("modal-voir-detail").style.display = "none";
}
});

document.getElementById("filtre-type").addEventListener("change", appliquerFiltres);

document.querySelectorAll(".chip-statut").forEach(btn => {
btn.addEventListener("click", () => {
 const statut = btn.dataset.statut;
 const classeCouleur = statut === "possédé" ? "possede" : statut === "en négociation" ? "negociation" : "recherche";
 if (statutsActifs.includes(statut)) {
 statutsActifs = statutsActifs.filter(s => s !== statut);
 btn.classList.remove("actif", classeCouleur);
 } else {
 statutsActifs.push(statut);
 btn.classList.add("actif", classeCouleur);
 }
 appliquerFiltres();
});
});

chargerCollection();