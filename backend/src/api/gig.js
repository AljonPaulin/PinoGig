import express from "express";
import { deleteGig, getAllGig, getSingleGig, postGig, updateGig } from "../routes/gigs.js";

const router = express.Router();

router.get("/all", getAllGig);
router.get("/:id", getSingleGig);
router.post("/", postGig);
router.patch("/edit/:id", updateGig);
router.delete("/delete/:id", deleteGig);

export default router;