import { Router } from "express";
import { db } from "../../db/client";
import { players } from "../../db/Players";

const router = Router();

// GET all players
router.get("/get-players", async (req, res) => {
  try {
    const allPlayers = await db.select().from(players);

    res.status(200).json({
      message: "Players fetched successfully",
      players: allPlayers, // includes image now ✅
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
