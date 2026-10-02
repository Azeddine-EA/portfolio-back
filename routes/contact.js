const express = require("express");
const router = express.Router();
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    // Vérification des types
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return res.status(400).json({
      error: "Données invalides",
    });
  }

  // Nettoyage des espaces
const cleanName = name.trim();
const cleanEmail = email.trim();
const cleanMessage = message.trim();
// Vérification du nom
// Lettres, accents, espaces, apostrophes et tirets autorisés
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿÀ-ÿ' -]+$/;

if (!nameRegex.test(cleanName)) {
  return res.status(400).json({
    error: "Le nom contient des caractères invalides",
  });
}

// Vérification de l'email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(cleanEmail)) {
  return res.status(400).json({
    error: "L'adresse email est invalide",
  });
}
// Vérification du message
if (cleanMessage.length < 5) {
  return res.status(400).json({
    error: "Le message est trop court",
  });
}
if (cleanMessage.length > 2000) {
  return res.status(400).json({
    error: "Le message est trop long",
  });
}


// Envoi uniquement si tout est valide
const { data, error } = await resend.emails.send({
  from: "onboarding@resend.dev",
  to: "azeddine.eadev@gmail.com",
  subject: "Nouveau message depuis le Portfolio",
  html: `
    <h2>Nouveau message</h2>
    <p><strong>Nom :</strong> ${cleanName}</p>
    <p><strong>Email :</strong> ${cleanEmail}</p>
    <p><strong>Message :</strong></p>
    <p>${cleanMessage}</p>
  `,
});

    if (error) {
      return res.status(400).json({ error });
    }

    res.status(200).json({
      message: "Email envoyé avec succès",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur lors de l'envoi de l'email",
    });
  }
});

module.exports = router;