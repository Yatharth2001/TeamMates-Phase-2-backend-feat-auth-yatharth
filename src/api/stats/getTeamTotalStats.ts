import express from "express";
import { db } from "../../db/client.js";
import { teamStats } from "../../db/teamStats.js";
import { sql } from "drizzle-orm";

const router = express.Router();

// Fetch total team statistics
router.get("/team-stats/total", async (req, res) => {
  try {
    const [totalStats] = await db
      .select({
        totalGames: sql`COUNT(*)`.as("totalGames"),
        wins: sql`SUM(CASE WHEN outcome = 'win' THEN 1 ELSE 0 END)`.as("wins"),
        losses: sql`SUM(CASE WHEN outcome = 'loss' THEN 1 ELSE 0 END)`.as("losses"),
        ties: sql`SUM(CASE WHEN outcome = 'tie' THEN 1 ELSE 0 END)`.as("ties"),
        totalHomeScore: sql`SUM(home_score)`.as("totalHomeScore"),
        totalAwayScore: sql`SUM(away_score)`.as("totalAwayScore"),
      })
      .from(teamStats);

    res.json({
      ...totalStats,
      totalGames: Number(totalStats.totalGames),
      wins: Number(totalStats.wins),
      losses: Number(totalStats.losses),
      ties: Number(totalStats.ties),
      totalHomeScore: Number(totalStats.totalHomeScore),
      totalAwayScore: Number(totalStats.totalAwayScore),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch total team stats" });
  }
});

export default router;