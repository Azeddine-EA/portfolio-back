
const express = require("express");
const router = express.Router();
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Échappe les caractères spéciaux avant l'insertion dans le HTML
const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      message,
      budget,
      typeSite,
      typeForm,
    } = req.body;

    // 1. Vérification du type de formulaire
    if (!["contact", "devis"].includes(typeForm)) {
      return res.status(400).json({
        error: "Type de formulaire invalide",
      });
    }

    // 2. Vérification des champs communs
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        error: "Données invalides",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return res.status(400).json({
        error: "Nom, email et message sont obligatoires",
      });
    }

    // 3. Validation du nom
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

    if (
      cleanName.length > 50 ||
      !nameRegex.test(cleanName)
    ) {
      return res.status(400).json({
        error: "Le nom est invalide",
      });
    }

    // 4. Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      cleanEmail.length > 254 ||
      !emailRegex.test(cleanEmail)
    ) {
      return res.status(400).json({
        error: "L'adresse email est invalide",
      });
    }

    // 5. Validation du message
    if (
      cleanMessage.length < 5 ||
      cleanMessage.length > 2000
    ) {
      return res.status(400).json({
        error: "Le message doit contenir entre 5 et 2000 caractères",
      });
    }

    // 6. Validation des champs spécifiques au devis
    let cleanBudget = "";
    let cleanTypeSite = "";

    if (typeForm === "devis") {
      const budgetsAutorises = [
        "Moins de 500 €",
        "500 - 1 000 €",
        "1 000 - 2 500 €",
        "2 500 - 5 000 €",
        "5 000 € et plus",
      ];

      const typesAutorises = [
        "Vitrine",
        "E-commerce",
        "Portfolio",
        "Blog",
      ];

      if (
        typeof budget !== "string" ||
        typeof typeSite !== "string" ||
        !budgetsAutorises.includes(budget) ||
        !typesAutorises.includes(typeSite)
      ) {
        return res.status(400).json({
          error: "Budget ou type de site invalide",
        });
      }

      cleanBudget = budget;
      cleanTypeSite = typeSite;
    }

    // 7. Préparation du contenu HTML
    const safeName = escapeHtml(cleanName);
    const safeEmail = escapeHtml(cleanEmail);
    const safeMessage = escapeHtml(cleanMessage);
    const safeBudget = escapeHtml(cleanBudget || "Non renseigné");
    const safeTypeSite = escapeHtml(cleanTypeSite || "Non renseigné");

    const subject =
      typeForm === "devis"
        ? "Nouvelle demande de devis depuis le Portfolio"
        : "Nouveau message depuis le Portfolio";

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "azeddine.eadev@gmail.com",
      subject,
      html: `
        <h2>${typeForm === "devis" ? "Nouvelle demande de devis" : "Nouveau message"}</h2>
        <p><strong>Nom :</strong> ${safeName}</p>
        <p><strong>Email :</strong> ${safeEmail}</p>
        <p><strong>Budget :</strong> ${safeBudget}</p>
        <p><strong>Type de site :</strong> ${safeTypeSite}</p>
        <p><strong>Message :</strong></p>
        <p>${safeMessage.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Erreur Resend :", error);

      return res.status(500).json({
        error: "Impossible d'envoyer l'email",
      });
    }
    console.log("E-mail accepté par Resend :", data);

    return res.status(200).json({
      message: "Email envoyé avec succès",
      data,
    });
  } catch (error) {
    console.error("Erreur route contact :", error);

    return res.status(500).json({
      error: "Erreur lors de l'envoi de l'email",
    });
  }
});

module.exports = router;
