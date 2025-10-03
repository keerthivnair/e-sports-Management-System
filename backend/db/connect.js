const mongoose = require("mongoose");


async function connectDb() {
    try {
        await mongoose.connect("mongodb+srv://user:user@cluster0.oqqeksu.mongodb.net/db")
        console.log("db created")
    }
    catch(error) {
        console.log(error)
    }
}


module.exports = connectDb;