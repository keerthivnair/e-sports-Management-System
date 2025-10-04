const express = require("express")
const User = require("./user_det")
const router = express.Router()


router.post("/register",async(req,res)=> {
    try {
        const {name,email} = req.body;
        if(!name||!email) {
            return res.status(400).json({error:"Name and Email are required"})
        }

        let user = await User.findOne({email});
        if(user) {
      return res.json({ message: "User already exists", user });
    }

    user = new User({name,email})
    await user.save()
    res.json({ message: "User registered successfully", user });
    } catch(err) {
        console.error("Error in /register:", err);
        res.status(500).json({ error: "Server error" });
    }
})


router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("Error in /login:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
    