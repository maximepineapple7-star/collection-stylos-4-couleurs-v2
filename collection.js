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

 const toutMaCollection = [...possedes, ...negociation];
 afficherGraphiqueRarete(toutMaCollection);
 afficherGraphiqueAnnees(toutMaCollection);
 afficherPlusCher(toutMaCollection);
} catch (error) {
 console.error(error);
}
}

function afficherGraphiqueRarete(stylos) {
const ordre = ["Commun", "Peu commun", "Rare", "Très rare", "Exceptionnel"];
const comptes = {};
ordre.forEach(o => comptes[o] = 0);
stylos.forEach(s => { if (s.rarete_circulation && comptes.hasOwnProperty(s.rarete_circulation)) comptes[s.rarete_circulation]++; });
const max = Math.max(...Object.values(comptes), 1);
const container = document.getElementById("graphique-rarete");
container.innerHTML = ordre.map(o => `
 <div class="barre-stat-ligne">
 <span class="barre-stat-label">${o}</span>
 <div class="barre-stat-fond"><div class="barre-stat-remplissage ${classeRarete(o)}" style="width:${(comptes[o]/max*100)}%"></div></div>
 <span class="barre-stat-valeur">${comptes[o]}</span>
 </div>
`).join('');
}

function afficherGraphiqueAnnees(stylos) {
const comptes = {};
stylos.forEach(s => {
 if (s.date_acquisition) {
 comptes[s.date_acquisition] = (comptes[s.date_acquisition] || 0) + 1;
 }
});
const annees = Object.keys(comptes).sort();
const max = Math.max(...Object.values(comptes), 1);
const container = document.getElementById("graphique-annees");
if (annees.length === 0) {
 container.innerHTML = "<p>Aucune donnée.</p>";
 return;
}
container.innerHTML = annees.map(a => `
 <div class="barre-stat-ligne">
 <span class="barre-stat-label">${a}</span>
 <div class="barre-stat-fond"><div class="barre-stat-remplissage barre-stat-annee" style="width:${(comptes[a]/max*100)}%"></div></div>
 <span class="barre-stat-valeur">${comptes[a]}</span>
 </div>
`).join('');
}

function afficherPlusCher(stylos) {
const avecPrix = stylos.filter(s => s.prix !== null && s.prix !== undefined && s.prix !== "");
const container = document.getElementById("stat-plus-cher");
if (avecPrix.length === 0) {
 container.innerHTML = "<p>Aucun prix renseigné.</p>";
 return;
}
const plusCher = avecPrix.reduce((max, s) => (parseFloat(s.prix) > parseFloat(max.prix) ? s : max));
container.innerHTML = `<p><strong>${plusCher.nom || 'Sans nom'}</strong> — ${parseFloat(plusCher.prix).toFixed(2)} €</p>`;
}

async function toggleFavori(stylo, event) {
event.stopPropagation();
const nouveauFavori = !stylo.favori;
try {
 const response = await fetch(`${SUPABASE_URL}/rest/v1/stylos?id=eq.${stylo.id}`, {
 method: "PATCH",
 headers: {
 "apikey": SUPABASE_KEY,
 "Authorization": `Bearer ${SUPABASE_KEY}`,
 "Content-Type": "application/json",
 "Prefer": "return=minimal"
 },
 body: JSON.stringify({ favori: nouveauFavori })
 });
 if (response.ok) {
 chargerCollection();
 }
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
 <button class="btn-favori ${stylo.favori ? 'favori-actif' : ''}" title="Coup de cœur">★</button>
 <img src="${stylo.photo_url || ''}" alt="${stylo.nom || 'Stylo'}">
 <h3>${stylo.nom || 'Sans nom'}</h3>
 <p>${(stylo.categorie || []).join(', ')}</p>
 ${stylo.rarete_circulation ? `<span class="badge-rarete ${classeRarete(stylo.rarete_circulation)}">${stylo.rarete_circulation}</span>` : ''}
 `;
 card.querySelector(".btn-favori").addEventListener("click", (e) => toggleFavori(stylo, e));
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
 <p><strong>Prix payé :</strong> ${stylo.prix ? parseFloat(stylo.prix).toFixed(2) + ' €' : '-'}</p>
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