const SUPABASE_URL = "https://onohxbsakdwfieiipqse.supabase.co";
const SUPABASE_KEY = "sb_publishable_h-v5IyPAwmL5yuOSHgBqzg_muZPd-yz";

async function chargerAccueil() {
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

 document.getElementById("compteur-total").textContent = stylos.length;
 document.getElementById("compteur-possedes").textContent = stylos.filter(s => s.statut === "possédé").length;
 document.getElementById("compteur-negociation").textContent = stylos.filter(s => s.statut === "en négociation").length;

 const avecPhoto = stylos.filter(s => s.photo_url);
 const melange = avecPhoto.sort(() => Math.random() - 0.5);
 const troisPhotos = melange.slice(0, 3);

 const containerPhotos = document.getElementById("accueil-photos");
 if (troisPhotos.length === 0) {
 containerPhotos.innerHTML = "";
 } else {
 containerPhotos.innerHTML = troisPhotos.map(s =>
 `<img src="${s.photo_url}" alt="${s.nom || 'Stylo'}">`
 ).join('');
 }
} catch (error) {
 console.error(error);
}
}

chargerAccueil();