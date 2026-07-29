const SUPABASE_URL = "https://onohxbsakdwfieiipqse.supabase.co";
const SUPABASE_KEY = "sb_publishable_h-v5IyPAwmL5yuOSHgBqzg_muZPd-yz";

let styloArray = [];
let marqueurs = [];
let carte;

function initCarte() {
carte = L.map('carte').setView([46.6, 2.5], 5.5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 attribution: '&copy; OpenStreetMap contributors',
 maxZoom: 19
}).addTo(carte);
}

async function chargerStylos() {
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
 afficherMarqueurs(styloArray);
} catch (error) {
 console.error(error);
}
}

function afficherMarqueurs(stylos) {
marqueurs.forEach(m => carte.removeLayer(m));
marqueurs = [];

const avecCoords = stylos.filter(s => s.lieu_lat && s.lieu_lng);

avecCoords.forEach(stylo => {
 const marker = L.marker([stylo.lieu_lat, stylo.lieu_lng]).addTo(carte);
 marker.bindPopup(`<strong>${stylo.nom || 'Sans nom'}</strong><br>${stylo.lieu_nom || ''}<br>${stylo.lieu_ville || ''}`);
 marker.on('click', () => {
 marker.openPopup();
 });
 marker.on('popupopen', () => {
 const popupEl = marker.getPopup().getElement();
 popupEl.style.cursor = "pointer";
 popupEl.addEventListener('click', () => ouvrirDetailVue(stylo));
 });
 marqueurs.push(marker);
});

if (avecCoords.length > 0) {
 const groupe = L.featureGroup(marqueurs);
 carte.fitBounds(groupe.getBounds().pad(0.2));
}
}

function appliquerFiltreCarte() {
const typeChoisi = document.getElementById("filtre-carte-type").value.toLowerCase();
let resultat = styloArray;
if (typeChoisi) {
 resultat = resultat.filter(s =>
 (s.categorie || []).some(c => c.toLowerCase().includes(typeChoisi))
 );
}
afficherMarqueurs(resultat);
}

document.getElementById("filtre-carte-type").addEventListener("change", appliquerFiltreCarte);

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

initCarte();
chargerStylos();