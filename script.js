// Remplace ces deux valeurs par les tiennes
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
      `;

      container.appendChild(card);
    });

  } catch (error) {
    container.innerHTML = "<p>Erreur de chargement. Vérifie ta connexion à Supabase.</p>";
    console.error(error);
  }
}

chargerCollection();