// models.js
const mongoose = require("mongoose");

// Player Details Schema
const playerDetailsSchema = new mongoose.Schema({
  player: String,
  org: String,
  agents: [String],
  rounds_played: String,
  rating: String,
  average_combat_score: String,
  kill_deaths: String,
  kill_assists_survived_traded: String,
  average_damage_per_round: String,
  kills_per_round: String,
  assists_per_round: String,
  first_kills_per_round: String,
  first_deaths_per_round: String,
  headshot_percentage: String,
  clutch_success_percentage: String,
});

const statsSchema = new mongoose.Schema({
  status: Number,
  region: String,
  segments: [playerDetailsSchema],
});

const statsModel = mongoose.model("Stats", statsSchema);

module.exports = { statsModel };