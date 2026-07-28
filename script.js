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
document.getElementById("form-stylo").addEventListener("submit", async function(e) {
  e.preventDefault();

  const messageEl = document.getElementById("message-form");
  messageEl.textContent = "Ajout en cours...";

  const nouveauStylo = {
    nom: document.getElementById("nom").value,
    entreprise: document.getElementById("entreprise").value,
    categorie: document.getElementById("categorie").value,
    rarete_circulation: document.getElementById("rarete_circulation").value,
    rarete_acquisition: document.getElementById("rarete_acquisition").value,
    source: document.getElementById("source").value,
    date_acquisition: document.getElementById("date_acquisition").value || null,
    statut: document.getElementById("statut").value,
    notes: document.getElementById("notes").value
  };

  try {
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
      chargerCollection(); // recharge la liste pour afficher le nouveau stylo
    } else {
      messageEl.textContent = "Erreur lors de l'ajout.";
      console.error(await response.text());
    }
  } catch (error) {
    messageEl.textContent = "Erreur lors de l'ajout.";
    console.error(error);
  }
});