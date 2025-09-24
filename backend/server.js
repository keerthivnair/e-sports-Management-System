const express = require("express")
const mongoose = require("mongoose")
const axios = require("axios"); 
const app = express()
const cors = require("cors");
app.use(cors());
app.use(express.json());
const recommendationRoutes = require("./recommendations");


app.use("/", recommendationRoutes); 

const shortNames = [
    { key: "na", name: "North America", flag: "🇺🇸" },
    { key: "eu", name: "Europe", flag: "🇪🇺" },
    { key: "ap", name: "Asia-Pacific", flag: "🌏" },
    { key: "la-s", name: "LA-S", flag: "🇧🇷" },
    { key: "la-n", name: "LA-N", flag: "🇲🇽" },
    { key: "oce", name: "Oceania", flag: "🇦🇺" },
    { key: "kr", name: "Korea", flag: "🇰🇷" },
    { key: "mn", name: "MENA", flag: "🌍" },
    { key: "gc", name: "GC", flag: "⚡" },
    { key: "br", name: "Brazil", flag: "🇧🇷" },
    { key: "cn", name: "China", flag: "🇨🇳" },
    { key: "jp", name: "Japan", flag: "🇯🇵" },
    { key: "col", name: "Collegiate", flag: "🎓" }
  ];

// db connection

async function connectDb() {
    try {
        await mongoose.connect("mongodb+srv://user:user@cluster0.oqqeksu.mongodb.net/db")
        console.log("db created")
    }
    catch(error) {
        console.log(error)
    }
}

// stats

const playerDetailsSchema = new mongoose.Schema({
        "player": String,
        "org": String,
        "agents": [String],
        "rounds_played": String,
        "rating": String,
        "average_combat_score": String,
        "kill_deaths": String,
        "kill_assists_survived_traded": String,
        "average_damage_per_round": String,
        "kills_per_round": String,
        "assists_per_round": String,
        "first_kills_per_round": String,
        "first_deaths_per_round": String,
        "headshot_percentage": String,
        "clutch_success_percentage": String
})

const statsSchema = new mongoose.Schema({
    "status":Number,
    "region":String,
    "segments":[playerDetailsSchema]
})

const statsModel = new mongoose.model("Stats",statsSchema)

//rankings

const teamSchema = new mongoose.Schema({
  rank: String,
  team: String,
  country: String,
  last_played: String,
  last_played_team: String,
  last_played_team_logo: String,
  record: String,
  earnings: String,
  logo: String
})

const rankingsSchema = new mongoose.Schema({
    "status": Number,
    "region":String,
    "data": [teamSchema]
})

const rankingsModel = new mongoose.model("Rankings",rankingsSchema)

// Events
const eventSchema = new mongoose.Schema({
  title: String,
  thumb: String,
  prize: String,
  region: String,
  dates: String,
  status: String, // upcoming or completed
});
const eventsModel = mongoose.model("Events", eventSchema);

// Event Matches
const eventMatchSchema = new mongoose.Schema({
  tournament_name: String,
  match_event: String,
  event_name: String,
  series_name: String,
  match_series: String,
  round_info: String,
  team1: String,
  team2: String,
  team1_logo: String,
  team2_logo: String,
  flag1: String,
  flag2: String,
  score1: String,
  score2: String,
  time_until_match: String,
  time_completed: String,
  status: String, // upcoming or completed
});

const eventMatchesModel = mongoose.model("EventMatches", eventMatchSchema);


// functions to fetch from api - vlr.gg


async function insertDataFromApi_rankings() {
    try {
        for(const data of shortNames){
            let count = await rankingsModel.countDocuments();
            if(count>=13){
                console.log("table already populated from api")
                return 
            }
            const res = await axios.get(`https://vlrggapi.vercel.app/rankings?region=${data.key}`)
            const apiData = res.data
            apiData.region = data.key
            const newDoc = await rankingsModel.create(apiData)
            console.log("Inserted:", newDoc); 
        }     
    }
    catch(err) {
        console.log(err)
    }
}
async function insertDataFromApi_stats() {
    try {
        for(const data of shortNames){
            let count = await statsModel.countDocuments();
            if(count>=13){
                console.log("table already populated from api")
                return 
            }
            const res = await axios.get(`https://vlrggapi.vercel.app/stats?region=${data.key}&timespan=all`)
            const apiData = res.data.data
            apiData.region = data.key
            const newDoc = await statsModel.create(apiData)
            console.log("Inserted:", newDoc); 
        }     
    }
    catch(err) {
        console.log(err)
    }
}

async function insertDataFromApi_events() {
  try {
    for (const status of ["completed", "upcoming"]) {
      let page = 1;
      while (true) {
        const res = await axios.get(
          `https://vlrggapi.vercel.app/events?q=${status}&page=${page}`
        );

        const events = res.data?.data?.segments || [];

        if (events.length === 0) {
          console.log(`No more ${status} events after page ${page - 1}`);
          break; // stop fetching when API has no more data
        }

        const docs = events.map((e) => ({ ...e, status }));
        await eventsModel.insertMany(docs, { ordered: false }).catch(() => {});

        console.log(
          `Inserted ${events.length} ${status} events from page ${page}`
        );

        page++;
      }
    }
  } catch (error) {
    console.error("Error inserting events:", error);
  }
}


async function insertDataFromApi_eventMatches() {
  try {
    let count = await eventMatchesModel.countDocuments();
    if (count > 0) return console.log("event matches already populated");

    for (const status of ["results", "upcoming"]) {
      const res = await axios.get(`https://vlrggapi.vercel.app/match?q=${status}`);
      const matches = res.data?.data?.segments || [];
      const docs = matches.map((m) => ({
        ...m,
        status: status === "results" ? "completed" : "upcoming",
      }));
      await eventMatchesModel.insertMany(docs);
    }
    console.log("Event matches inserted");
  } catch (err) {
    console.log(err);
  }
}

// frontend connection - localhost/endpoints

app.post("/rankings",async(req,res)=> {
    try {
        const {region}=req.body
        if(!region) {
            return res.status(400).json({error:"Region not specified"})
        }

        const rankings = await rankingsModel.findOne({"region":region})

        if(!rankings) {
            return res.status(404).json({error:"No rankings available for the data"})
        }
        res.json(rankings.data)
    }
    catch (err) {
        console.error("Error fetching rankings:", err);
        res.status(500).json({ error: "Server error" });
    }
})

// Events
app.get("/events/:status", async (req, res) => {
  try {
    const { status } = req.params; // upcoming or completed
    const events = await eventsModel.find({ status });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Matches by event
app.get("/matches/:status/:eventTitle", async (req, res) => {
  try {
    const { status, eventTitle } = req.params;
    const normalize = (str) => (str ? str.toLowerCase().replace(/[^a-z0-9]/g, "") : "");
    const normalizedId = normalize(eventTitle);

    const matches = await eventMatchesModel.find({ status });
    const filtered = matches.filter((match) => {
      const eventName =
        match.tournament_name ||
        match.match_event ||
        match.event_name ||
        match.series_name ||
        "";
      return normalize(eventName).includes(normalizedId);
    });
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});



app.listen(3000,() => {
    console.log("server started")
    connectDb().then(()=> {
        insertDataFromApi_rankings()
        insertDataFromApi_stats()
        insertDataFromApi_events();
        insertDataFromApi_eventMatches();
    })
})

module.exports = { statsModel};


 
