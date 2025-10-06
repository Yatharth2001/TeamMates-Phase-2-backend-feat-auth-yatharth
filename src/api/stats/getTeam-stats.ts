// routes/team-stats.get.js
import express from "express";
import { db } from "../../db/client.js";
import { teamStats } from "../../db/teamStats.js";
import { eq } from "drizzle-orm";

const router = express.Router();

// Fetch team stats by gameId
router.get("/team-stats/:gameId", async (req, res) => {
  try {
    const gameIdNum = Number(req.params.gameId);
    if (!gameIdNum) return res.status(400).json({ error: "Invalid gameId" });

    const [row] = await db
      .select()
      .from(teamStats)
      .where(eq(teamStats.gameId, gameIdNum))
      .limit(1);

    if (!row) return res.status(404).json({ error: "No team stats found" });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch team stats" });
  }
});

export default router;
