const express = require("express")
const mongoose = require("mongoose")
const axios = require("axios");
const app = express()


async function connectDb() {
    try {
        await mongoose.connect("mongodb+srv://user:user@cluster0.oqqeksu.mongodb.net/db")
        console.log("db created")
    }
    catch(error) {
        console.log(error)
    }
}


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
});


const rankingsSchema = new mongoose.Schema({
    "status": Number,
    "data": [teamSchema]
})

const rankingsModel = new mongoose.model("Rankings",rankingsSchema)


async function insertDataFromApi() {
    try {
        const res = await axios.get("https://vlrggapi.vercel.app/rankings?region=eu")
        const apiData = res.data
        const count = await rankingsModel.countDocuments();

        if(count == 0) {
          const newDoc = await rankingsModel.create(apiData)
          console.log("Inserted:", newDoc); 
        }
        else{
            console.log("Data already exists, skipping insert.");
        }
    }
    catch(err) {
        console.log(err)
    }
}

app.listen(3000,() => {
    console.log("server started")
    connectDb().then(()=> {
        insertDataFromApi()
    })
})


 
