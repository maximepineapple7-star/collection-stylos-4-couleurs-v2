const SUPABASE_URL = "https://onohxbsakdwfieiipqse.supabase.co";
const SUPABASE_KEY = "sb_publishable_h-v5IyPAwmL5yuOSHgBqzg_muZPd-yz";

let categoriesConnues = [];
let styloArray = [];

function createTagPicker(prefix) {
const tagsContainer = document.getElementById(`${prefix}-tags`);
const inputEl = document.getElementById(`${prefix}-input`);
const suggestionsEl = document.getElementById(`${prefix}-suggestions`);
let tags = [];

function render() {
 tagsContainer.innerHTML = tags.map(t => `<span class="tag-chip">${t}<button type="button" data-tag="${t}">&times;</button></span>`).join('');
 tagsContainer.querySelectorAll('button').forEach(btn => {
 btn.addEventListener('click', () => {
 tags = tags.filter(t => t !== btn.dataset.tag);
 render();
 });
 });
}

function ajouterTag(tag) {
 const tagPropre = tag.trim();
 if (tagPropre && !tags.includes(tagPropre)) {
 tags.push(tagPropre);
 if (!categoriesConnues.includes(tagPropre)) {
 categoriesConnues.push(tagPropre);
 }
 }
 inputEl.value = "";
 suggestionsEl.style.display = "none";
 suggestionsEl.innerHTML = "";
 render();
}

function afficherSuggestions() {
 const valeur = inputEl.value.trim().toLowerCase();
 suggestionsEl.innerHTML = "";
 if (valeur === "") {
 suggestionsEl.style.display = "none";
 return;
 }
 const dispo = categoriesConnues.filter(c => !tags.includes(c));
 const resultats = dispo.filter(c => c.toLowerCase().includes(valeur));
 resultats.forEach(c => {
 const item = document.createElement("div");
 item.className = "tag-suggestion-item";
 item.textContent = c;
 item.addEventListener("click", () => ajouterTag(c));
 suggestionsEl.appendChild(item);
 });
 const existeExactement = categoriesConnues.some(c => c.toLowerCase() === valeur);
 if (!existeExactement) {
 const itemCreer = document.createElement("div");
 itemCreer.className = "tag-suggestion-item tag-suggestion-creer";
 itemCreer.textContent = `+ Créer "${inputEl.value.trim()}"`;
 itemCreer.addEventListener("click", () => ajouterTag(inputEl.value));
 suggestionsEl.appendChild(itemCreer);
 }
 suggestionsEl.style.display = "block";
}

inputEl.addEventListener("input", afficherSuggestions);
inputEl.addEventListener("focus", afficherSuggestions);
inputEl.addEventListener("keydown", (e) => {
 if (e.key === "Enter") {
 e.preventDefault();
 if (inputEl.value.trim() !== "") {
 ajouterTag(inputEl.value);
 }
 }
});
document.addEventListener("click", (e) => {
 if (!inputEl.contains(e.target) && !suggestionsEl.contains(e.target)) {
 suggestionsEl.style.display = "none";
 }
});

render();

return {
 getTags: () => tags,
 setTags: (nouveauxTags) => { tags = [...(nouveauxTags || [])]; render(); }
};
}

const tagPickerAjout = createTagPicker("categorie");
const tagPickerModif = createTagPicker("modif-categorie");

function setupSourceField(selectId, inputId) {
const selectEl = document.getElementById(selectId);
const inputEl = document.getElementById(inputId);
selectEl.addEventListener("change", () => {
 if (selectEl.value === "__nouveau__") {
 inputEl.style.display = "block";
 inputEl.focus();
 } else {
 inputEl.style.display = "none";
 inputEl.value = "";
 }
});
}
setupSourceField("source", "source-nouveau");
setupSourceField("modif-source", "modif-source-nouveau");

function getSourceValue(selectId, inputId) {
const selectEl = document.getElementById(selectId);
const inputEl = document.getElementById(inputId);
if (selectEl.value === "__nouveau__") {
 return inputEl.value.trim();
}
return selectEl.value;
}

function setSourceValue(selectId, inputId, valeur) {
const selectEl = document.getElementById(selectId);
const inputEl = document.getElementById(inputId);
const optionsConnues = Array.from(selectEl.options).map(o => o.value);
if (valeur && !optionsConnues.includes(valeur)) {
 selectEl.value = "__nouveau__";
 inputEl.style.display = "block";
 inputEl.value = valeur;
} else {
 selectEl.value = valeur || "";
 inputEl.style.display = "none";
 inputEl.value = "";
}
}

const infosRarete = {
circulation: {
 titre: "Échelle de rareté de circulation",
 html: `<table>
 <tr><th>Statut</th><th>Nombre d'exemplaires connus</th></tr>
 <tr><td>Commun</td><td>&gt; 5000</td></tr>
 <tr><td>Peu commun</td><td>1000 - 5000</td></tr>
 <tr><td>Rare</td><td>300 - 1000</td></tr>
 <tr><td>Très rare</td><td>50 - 300</td></tr>
 <tr><td>Exceptionnel</td><td>&le; 50</td></tr>
 </table>`
},
acquisition: {
 titre: "Échelle de rareté d'acquisition",
 html: `<table>
 <tr><th>Statut</th><th>Fréquence sur le marché</th><th>Difficulté</th></tr>
 <tr><td>Commun</td><td>Plusieurs fois/semaine</td><td>Très facile</td></tr>
 <tr><td>Peu commun</td><td>Plusieurs fois/mois</td><td>Facile, un peu de veille</td></tr>
 <tr><td>Rare</td><td>Quelques fois/trimestre</td><td>Recherche régulière, concurrence modérée</td></tr>
 <tr><td>Très rare</td><td>1 à quelques fois/an</td><td>Recherche longue, réseau spécialisé</td></tr>
 <tr><td>Exceptionnel</td><td>Tous les 2-3 ans ou moins</td><td>Accès très difficile, cercle restreint</td></tr>
 </table>`
}
};

function ouvrirModalRarete(type) {
document.getElementById("rarete-info-titre").textContent = infosRarete[type].titre;
document.getElementById("rarete-info-contenu").innerHTML = infosRarete[type].html;
document.getElementById("modal-rarete-info").style.display = "flex";
}

document.querySelectorAll(".btn-astero").forEach(btn => {
btn.addEventListener("click", () => ouvrirModalRarete(btn.dataset.type));
});

document.getElementById("fermer-modal-rarete").addEventListener("click", () => {
document.getElementById("modal-rarete-info").style.display = "none";
});

document.getElementById("modal-rarete-info").addEventListener("click", (e) => {
if (e.target.id === "modal-rarete-info") {
 document.getElementById("modal-rarete-info").style.display = "none";
}
});

function valeurRarete(txt) {
const echelle = { "Commun": 1, "Peu commun": 2, "Rare": 3, "Très rare": 4, "Exceptionnel": 5 };
return echelle[txt] || 0;
}

function trierStylos(stylos, critere) {
const copie = [...stylos];
if (critere === "acquisition") {
 copie.sort((a, b) => valeurRarete(b.rarete_acquisition) - valeurRarete(a.rarete_acquisition));
} else if (critere === "circulation") {
 copie.sort((a, b) => valeurRarete(b.rarete_circulation) - valeurRarete(a.rarete_circulation));
} else if (critere === "moyenne") {
 const moyenne = (s) => (valeurRarete(s.rarete_acquisition) + valeurRarete(s.rarete_circulation)) / 2;
 copie.sort((a, b) => moyenne(b) - moyenne(a));
} else {
 copie.sort((a, b) => (a.nom || "").localeCompare(b.nom || ""));
}
return copie;
}

function afficherStylos(stylos) {
const container = document.getElementById("collection");
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
 <p>${(stylo.categorie || []).join(', ')}</p>
 <span class="badge ${statutClass}">${stylo.statut || ''}</span>
 <button class="btn-modifier">Modifier</button>
 `;
 card.querySelector(".btn-modifier").addEventListener("click", () => ouvrirModal(stylo));
 container.appendChild(card);
});
}

function trierEtAfficher() {
const critere = document.getElementById("tri-select").value;
const trie = trierStylos(styloArray, critere);
afficherStylos(trie);
}

document.getElementById("tri-select").addEventListener("change", trierEtAfficher);

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
 styloArray = stylos;

 const toutesCategories = new Set();
 stylos.forEach(s => (s.categorie || []).forEach(c => toutesCategories.add(c)));
 categoriesConnues = Array.from(toutesCategories).sort();

 trierEtAfficher();
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
 categorie: tagPickerAjout.getTags(),
 rarete_circulation: document.getElementById("rarete_circulation").value,
 rarete_acquisition: document.getElementById("rarete_acquisition").value,
 source: getSourceValue("source", "source-nouveau"),
 date_acquisition: document.getElementById("date_acquisition").value || null,
 statut: document.getElementById("statut").value,
 lieu_ville: document.getElementById("lieu_ville").value,
 lieu_nom: document.getElementById("lieu_nom").value,
 lieu_lat: document.getElementById("lieu_lat").value ? parseFloat(document.getElementById("lieu_lat").value) : null,
 lieu_lng: document.getElementById("lieu_lng").value ? parseFloat(document.getElementById("lieu_lng").value) : null,
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
 tagPickerAjout.setTags([]);
 document.getElementById("source-nouveau").style.display = "none";
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
tagPickerModif.setTags(stylo.categorie || []);
document.getElementById("modif-rarete_circulation").value = stylo.rarete_circulation || "";
document.getElementById("modif-rarete_acquisition").value = stylo.rarete_acquisition || "";
setSourceValue("modif-source", "modif-source-nouveau", stylo.source || "");
document.getElementById("modif-date_acquisition").value = stylo.date_acquisition || "";
document.getElementById("modif-statut").value = stylo.statut || "possédé";
document.getElementById("modif-lieu_ville").value = stylo.lieu_ville || "";
document.getElementById("modif-lieu_nom").value = stylo.lieu_nom || "";
document.getElementById("modif-lieu_lat").value = stylo.lieu_lat ?? "";
document.getElementById("modif-lieu_lng").value = stylo.lieu_lng ?? "";
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
 categorie: tagPickerModif.getTags(),
 rarete_circulation: document.getElementById("modif-rarete_circulation").value,
 rarete_acquisition: document.getElementById("modif-rarete_acquisition").value,
 source: getSourceValue("modif-source", "modif-source-nouveau"),
 date_acquisition: document.getElementById("modif-date_acquisition").value || null,
 statut: document.getElementById("modif-statut").value,
 lieu_ville: document.getElementById("modif-lieu_ville").value,
 lieu_nom: document.getElementById("modif-lieu_nom").value,
 lieu_lat: document.getElementById("modif-lieu_lat").value ? parseFloat(document.getElementById("modif-lieu_lat").value) : null,
 lieu_lng: document.getElementById("modif-lieu_lng").value ? parseFloat(document.getElementById("modif-lieu_lng").value) : null,
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