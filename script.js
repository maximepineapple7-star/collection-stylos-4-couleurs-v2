const SUPABASE_URL = "https://iriesfaehbjcmirrlazq.supabase.co";
const SUPABASE_KEY = "sb_publishable_4dMAcdX7_eAfnvqXv8C_6A_fpwnkb_l";

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
 const stylos = await response.json();
 if (stylos.length === 0) {
 container.innerHTML = "<p>Aucun stylo enregistré pour le moment.</p>";
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
 <p>${stylo.entreprise || ''}</p>
 <p>${stylo.categorie || ''}</p>
 <span class="badge ${statutClass}">${stylo.statut || ''}</span>
 <button class="btn-modifier">Modifier</button>
 `;
 card.querySelector(".btn-modifier").addEventListener("click", () => ouvrirModal(stylo));
 container.appendChild(card);
 });
} catch (error) {
 container.innerHTML = "<p>Erreur de chargement. Vérifie ta connexion à Supabase.</p>";
 console.error(error);
}
}

chargerCollection();

document.getElementById("form-stylo").addEventListener("submit", async function(e) {
e.preventDefault();
const messageEl = document.getElementById("message-form");
messageEl.textContent = "Ajout en cours...";
const fichierPhoto = document.getElementById("photo").files[0];
let photoUrl = "";
try {
 if (fichierPhoto) {
 const nomFichier = `${Date.now()}-${fichierPhoto.name}`;
 const uploadResponse = await fetch(
 `${SUPABASE_URL}/storage/v1/object/photo-stylos/${nomFichier}`,
 {
 method: "POST",
 headers: {
 "apikey": SUPABASE_KEY,
 "Authorization": `Bearer ${SUPABASE_KEY}`,
 "Content-Type": fichierPhoto.type
 },
 body: fichierPhoto
 }
 );
 if (!uploadResponse.ok) {
 throw new Error("Erreur lors de l'upload de la photo");
 }
 photoUrl = `${SUPABASE_URL}/storage/v1/object/public/photo-stylos/${nomFichier}`;
 }
 const nouveauStylo = {
 nom: document.getElementById("nom").value,
 entreprise: document.getElementById("entreprise").value,
 categorie: document.getElementById("categorie").value,
 rarete_circulation: document.getElementById("rarete_circulation").value,
 rarete_acquisition: document.getElementById("rarete_acquisition").value,
 source: document.getElementById("source").value,
 date_acquisition: document.getElementById("date_acquisition").value || null,
 statut: document.getElementById("statut").value,
 photo_url: photoUrl,
 notes: document.getElementById("notes").value
 };
 const response = await fetch(`${SUPABASE_URL}/rest/v1/stylos`, {
 method: "POST",
 headers: {
 "apikey": SUPABASE_KEY,
 "Authorization": `Bearer ${SUPABASE_KEY}`,
 "Content-Type": "application/json"
 },
 body: JSON.stringify(nouveauStylo)
 });
 if (response.ok) {
 messageEl.textContent = "Stylo ajouté avec succès !";
 document.getElementById("form-stylo").reset();
 chargerCollection();
 } else {
 messageEl.textContent = "Erreur lors de l'ajout.";
 console.error(await response.text());
 }
} catch (error) {
 messageEl.textContent = "Erreur lors de l'ajout.";
 console.error(error);
}
});

function ouvrirModal(stylo) {
document.getElementById("modif-id").value = stylo.id;
document.getElementById("modif-photo-actuelle").value = stylo.photo_url || "";
document.getElementById("modif-nom").value = stylo.nom || "";
document.getElementById("modif-entreprise").value = stylo.entreprise || "";
document.getElementById("modif-categorie").value = stylo.categorie || "";
document.getElementById("modif-rarete_circulation").value = stylo.rarete_circulation || "";
document.getElementById("modif-rarete_acquisition").value = stylo.rarete_acquisition || "";
document.getElementById("modif-source").value = stylo.source || "";
document.getElementById("modif-date_acquisition").value = stylo.date_acquisition || "";
document.getElementById("modif-statut").value = stylo.statut || "possédé";
document.getElementById("modif-photo").value = "";
document.getElementById("modif-notes").value = stylo.notes || "";
document.getElementById("message-modif").textContent = "";
document.getElementById("modal-detail").style.display = "flex";
}

function fermerModal() {
document.getElementById("modal-detail").style.display = "none";
}

document.getElementById("fermer-modal").addEventListener("click", fermerModal);

document.getElementById("modal-detail").addEventListener("click", (e) => {
if (e.target.id === "modal-detail") {
 fermerModal();
}
});

document.getElementById("form-modif-stylo").addEventListener("submit", async function(e) {
e.preventDefault();
const messageEl = document.getElementById("message-modif");
messageEl.textContent = "Enregistrement en cours...";
const id = document.getElementById("modif-id").value;
const fichierPhoto = document.getElementById("modif-photo").files[0];
let photoUrl = document.getElementById("modif-photo-actuelle").value;
try {
 if (fichierPhoto) {
 const nomFichier = `${Date.now()}-${fichierPhoto.name}`;
 const uploadResponse = await fetch(
 `${SUPABASE_URL}/storage/v1/object/photo-stylos/${nomFichier}`,
 {
 method: "POST",
 headers: {
 "apikey": SUPABASE_KEY,
 "Authorization": `Bearer ${SUPABASE_KEY}`,
 "Content-Type": fichierPhoto.type
 },
 body: fichierPhoto
 }
 );
 if (!uploadResponse.ok) {
 throw new Error("Erreur lors de l'upload de la photo");
 }
 photoUrl = `${SUPABASE_URL}/storage/v1/object/public/photo-stylos/${nomFichier}`;
 }
 const styloModifie = {
 nom: document.getElementById("modif-nom").value,
 entreprise: document.getElementById("modif-entreprise").value,
 categorie: document.getElementById("modif-categorie").value,
 rarete_circulation: document.getElementById("modif-rarete_circulation").value,
 rarete_acquisition: document.getElementById("modif-rarete_acquisition").value,
 source: document.getElementById("modif-source").value,
 date_acquisition: document.getElementById("modif-date_acquisition").value || null,
 statut: document.getElementById("modif-statut").value,
 photo_url: photoUrl,
 notes: document.getElementById("modif-notes").value
 };
 const response = await fetch(`${SUPABASE_URL}/rest/v1/stylos?id=eq.${id}`, {
 method: "PATCH",
 headers: {
 "apikey": SUPABASE_KEY,
 "Authorization": `Bearer ${SUPABASE_KEY}`,
 "Content-Type": "application/json",
 "Prefer": "return=minimal"
 },
 body: JSON.stringify(styloModifie)
 });
 if (response.ok) {
 messageEl.textContent = "Modifications enregistrées !";
 chargerCollection();
 setTimeout(fermerModal, 800);
 } else {
 messageEl.textContent = "Erreur lors de la modification.";
 console.error(await response.text());
 }
} catch (error) {
 messageEl.textContent = "Erreur lors de la modification.";
 console.error(error);
}
});

document.getElementById("btn-supprimer-stylo").addEventListener("click", async function() {
const id = document.getElementById("modif-id").value;
const nom = document.getElementById("modif-nom").value;
const confirmation = confirm(`Es-tu sûr de vouloir supprimer le stylo "${nom}" ? Cette action est irréversible.`);
if (!confirmation) {
 return;
}
const messageEl = document.getElementById("message-modif");
messageEl.textContent = "Suppression en cours...";
try {
 const response = await fetch(`${SUPABASE_URL}/rest/v1/stylos?id=eq.${id}`, {
 method: "DELETE",
 headers: {
 "apikey": SUPABASE_KEY,
 "Authorization": `Bearer ${SUPABASE_KEY}`,
 "Prefer": "return=minimal"
 }
 });
 if (response.ok) {
 messageEl.textContent = "Stylo supprimé !";
 chargerCollection();
 setTimeout(fermerModal, 500);
 } else {
 messageEl.textContent = "Erreur lors de la suppression.";
 console.error(await response.text());
 }
} catch (error) {
 messageEl.textContent = "Erreur lors de la suppression.";
 console.error(error);
}
});