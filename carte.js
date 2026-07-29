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

function distanceKm(lat1, lng1, lat2, lng2) {
const R = 6371;
const dLat = (lat2 - lat1) * Math.PI / 180;
const dLng = (lng2 - lng1) * Math.PI / 180;
const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
 Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
 Math.sin(dLng/2) * Math.sin(dLng/2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
return R * c;
}

async function rechercherVille() {
const requete = document.getElementById("recherche-ville").value.trim();
if (requete === "") {
 afficherMarqueurs(styloArray);
 carte.setView([46.6, 2.5], 5.5);
 return;
}
try {
 const reponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(requete)}&limit=1`);
 const resultats = await reponse.json();
 if (resultats.length === 0) {
 alert("Ville introuvable.");
 return;
 }
 const villeLat = parseFloat(resultats[0].lat);
 const villeLng = parseFloat(resultats[0].lon);

 const stylosCorrespondants = styloArray.filter(s => {
 if (s.lieu_ville && s.lieu_ville.toLowerCase().includes(requete.toLowerCase())) {
 return true;
 }
 if (s.lieu_lat && s.lieu_lng) {
 return distanceKm(villeLat, villeLng, s.lieu_lat, s.lieu_lng) <= 40;
 }
 return false;
 });

 afficherMarqueurs(stylosCorrespondants);
 if (stylosCorrespondants.length === 0) {
 carte.setView([villeLat, villeLng], 11);
 }
} catch (error) {
 console.error(error);
 alert("Erreur lors de la recherche de la ville.");
}
}

document.getElementById("btn-recherche-ville").addEventListener("click", rechercherVille);
document.getElementById("recherche-ville").addEventListener("keydown", (e) => {
if (e.key === "Enter") {
 e.preventDefault();
 rechercherVille();
}
});

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

initCarte();
chargerStylos();