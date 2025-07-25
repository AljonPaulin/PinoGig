import express from "express";
import "dotenv/config.js";
import auth from "./src/api/auth.js";
import gig from "./src/api/gig.js";

const app = express();
app.use(express.json());

app.use("/api/gig", gig);

const PORT = process.env.PORT;

app.listen(PORT, () => { console.log(`Now listening to ${PORT}`)});