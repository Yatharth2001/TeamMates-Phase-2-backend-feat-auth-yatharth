// routes/player-stats.get.js
import express from "express";
import { db } from "../../db/client.js";
import { playerStats } from "../../db/playerStats.js";
import { and, eq } from "drizzle-orm";

const router = express.Router();

// List all players' stats for a game
router.get("/player-stats/:gameId", async (req, res) => {
  try {
    const gameIdNum = Number(req.params.gameId);
    if (!gameIdNum) return res.status(400).json({ error: "Invalid gameId" });

    const rows = await db
      .select()
      .from(playerStats)
      .where(eq(playerStats.gameId, gameIdNum));

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch player stats" });
  }
});

// Fetch one player's stats for a game
router.get("/player-stats/:gameId/:playerId", async (req, res) => {
  try {
    const gameIdNum = Number(req.params.gameId);
    const { playerId } = req.params;
    if (!gameIdNum) return res.status(400).json({ error: "Invalid gameId" });

    const [row] = await db
      .select()
      .from(playerStats)
      .where(and(eq(playerStats.gameId, gameIdNum), eq(playerStats.playerId, playerId)))
      .limit(1);

    if (!row) return res.status(404).json({ error: "No stats for this player/game" });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch player stats" });
  }
});

export default router;
