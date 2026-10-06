const express = require("express");
const router = express.Router();
const technology = require('../models/technologies');

router.get('/socials', async (req,res) =>{
  try{
    const socialsdata = await technology.findOne({}, "socials");
    res.json({result: true, socials:socialsdata.socials});
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
})
router.get('/languages', async (req,res) =>{
  try{
    const languagesData = await technology.findOne({}, "languages");
    res.json({result: true, languages:languagesData.languages});
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
})
module.exports = router;