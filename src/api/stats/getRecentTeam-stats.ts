// routes/getRecentTeam-stats.ts
import express from "express";
import { db } from "../../db/client.js";
import { teamStats } from "../../db/teamStats.js";
import { events } from "../../db/events.js";
import { eq, lte, desc } from "drizzle-orm";

const router = express.Router();

// Fetch all recent (past) team game statistics
router.get("/team-stats/recent", async (req, res) => {
  try {
    const today = new Date(); // Get today's date

    // Fetch all team stats for games that have already occurred
    const recentStats = await db
      .select({
        // Team stats fields
        id: teamStats.id,
        gameId: teamStats.gameId,
        homeScore: teamStats.homeScore,
        awayScore: teamStats.awayScore,
        outcome: teamStats.outcome,
        shots: teamStats.shots,
        shotsOnGoal: teamStats.shotsOnGoal,
        cornerKicks: teamStats.cornerKicks,
        fouls: teamStats.fouls,
        saves: teamStats.saves,
        createdAt: teamStats.createdAt,
        updatedAt: teamStats.updatedAt,
        // Event fields
        eventTitle: events.title,
        eventDate: events.date,
        eventType: events.type,
        opponent: events.opponent,
        gameType: events.gameType,
        location: events.location,
      })
      .from(teamStats)
      .innerJoin(events, eq(teamStats.gameId, events.id))
      .where(lte(events.date, today)) // Only past events (date <= today)
      .orderBy(desc(events.date)); // Most recent first

    res.json(recentStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recent team stats" });
  }
});

export default router;
