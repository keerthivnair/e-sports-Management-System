const {statsModel} = require("./models/statsmodel")
const express = require("express")
const mongoose = require("mongoose")
const axios = require("axios"); 
const app = express()
const cors = require("cors");
app.use(cors());
app.use(express.json());
const router = express.Router();


// logic 

router.post("/recommend",async(req,res)=> {
    try {
        const {region,player} = req.body
        if(!region || !player) {
            return res.status(400).json({error:"Region or Player not specified"})
        }
        const regionDoc = await statsModel.findOne({region: region.toLowerCase()})
        if (!regionDoc || !regionDoc.segments.length) {
        return res.status(404).json({ error: "No players found in this region" });
    }
        const bestPlayer = regionDoc.segments[0]; 

        // const statsPlayer = await statsModel.findOne({player})
        
        // get current player
        const playerDoc = regionDoc.segments.find(p=>p.player === player)
        if (!playerDoc) {
        return res.status(404).json({ error: "Player not found in this region" });
    }

       // Compare stats
       const numericalStats = [
      "rating",
      "average_combat_score",
      "kill_deaths",
      "average_damage_per_round",
      "kills_per_round",
      "assists_per_round",
      "first_kills_per_round",
      "first_deaths_per_round",
      "headshot_percentage",
      "clutch_success_percentage"
       ]


       const differences = {}

       numericalStats.forEach(stat => {
        const best = parseFloat(bestPlayer[stat]) || 0
        const curr = parseFloat(playerDoc[stat])|| 0
        differences[stat] = best - curr // positive then player can improve
       })


       // Calculate level 
       const rating = Math.max(parseFloat(playerDoc.rating),0.01)
       const exp_rating =
       (parseFloat(bestPlayer.rating) || 0) /
       (parseFloat(bestPlayer.rounds_played) || 1) *
       (parseFloat(playerDoc.rounds_played) || 1);

       const level = ((rating / exp_rating) * 100).toFixed(2);

       const similarPlayers = regionDoc.segments.filter(p=>{
        const diff = Math.abs((parseFloat(p.rating) || 0) - rating);
        return diff <=0.1 && p.player !== player
       })
       // only improvements needed
       const weakStats = Object.keys(differences).filter(stat => differences[stat] > 0);
      

      const agentScores = {}

      similarPlayers.forEach(p => {
      weakStats.forEach(stat => {
      if ((parseFloat(p[stat]) || 0) >= (parseFloat(playerDoc[stat]) || 0)) {
      p.agents.forEach(agent => {
        agentScores[agent] = (agentScores[agent] || 0) + 1;
      });
    }
  });
});


       const recommendedAgents = Object.entries(agentScores)
       .sort((a,b) => b[1]-a[1])
       .map(e=>e[0])
      
       const curr_rating =(playerDoc.rating);
       const best_rating = bestPlayer.rating

      res.json({
      player: playerDoc.player,
      level,
      differences,
      curr_rating,
      best_rating,
      recommendedAgents,
      bestPlayer: bestPlayer.player
    });
    }catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
})


module.exports = router;
