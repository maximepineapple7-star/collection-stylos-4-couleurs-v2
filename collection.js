const SUPABASE_URL = "https://onohxbsakdwfieiipqse.supabase.co";
const SUPABASE_KEY = "sb_publishable_h-v5IyPAwmL5yuOSHgBqzg_muZPd-yz";

function classeRarete(valeur) {
const correspondance = {
 "Commun": "rarete-commun",
 "Peu commun": "rarete-peu-commun",
 "Rare": "rarete-rare",
 "Très rare": "rarete-tres-rare",
 "Exceptionnel": "rarete-exceptionnel"
};
return correspondance[valeur] || "";
}

async function chargerCollection() {
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
 const stylos = await response.json();
 const possedes = stylos.filter(s => s.statut === "possédé");
 const negociation = stylos.filter(s => s.statut === "en négociation");
 afficherStylos(possedes, "collection-possedes");
 afficherStylos(negociation, "collection-negociation");
} catch (error) {
 console.error(error);
}
}

function afficherStylos(stylos, containerId) {
const container = document.getElementById(containerId);
if (stylos.length === 0) {
 container.innerHTML = "<p>Aucun stylo dans cette section.</p>";
 return;
}
container.innerHTML = "";
const grille = document.createElement("div");
grille.id = "collection";
stylos.forEach(stylo => {
 const card = document.createElement("div");
 card.className = "stylo-card";
 card.innerHTML = `
 <img src="${stylo.photo_url || ''}" alt="${stylo.nom || 'Stylo'}">
 <h3>${stylo.nom || 'Sans nom'}</h3>
 <p>${(stylo.categorie || []).join(', ')}</p>
 ${stylo.rarete_circulation ? `<span class="badge-rarete ${classeRarete(stylo.rarete_circulation)}">${stylo.rarete_circulation}</span>` : ''}
 `;
 card.addEventListener("click", () => ouvrirDetailVue(stylo));
 grille.appendChild(card);
});
container.appendChild(grille);
}

function ouvrirDetailVue(stylo) {
const contenu = document.getElementById("detail-vue-contenu");
contenu.innerHTML = `
 ${stylo.photo_url ? `<img src="${stylo.photo_url}" alt="${stylo.nom || ''}">` : ''}
 <h2>${stylo.nom || 'Sans nom'}</h2>
 <p><strong>Catégorie :</strong> ${(stylo.categorie || []).join(', ') || '-'}</p>
 <p><strong>Rareté de circulation :</strong> ${stylo.rarete_circulation || '-'}</p>
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

chargerCollection();