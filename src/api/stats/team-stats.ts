// routes/team-stats.post.js
import express from "express";
import { db } from "../../db/client.js";
import { teamStats } from "../../db/teamStats";

import { eq } from "drizzle-orm";
import { events } from "../../db/events";

const router = express.Router();

const toInt = (v:any) => {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

// Upsert: one team-stats row per gameId
router.post("/team-stats/upsert", async (req, res) => {
  try {
    const {
      gameId,
      homeScore,
      awayScore,
      outcome,        // 'win' | 'loss' | 'tie'
      shots,
      shotsOnGoal,
      cornerKicks,
      fouls,
      saves,
    } = req.body;

    const gameIdNum = Number(gameId);
    if (!gameIdNum) {
      return res.status(400).json({ error: "gameId is required and must be a number" });
    }

    // Ensure the event exists
    const [exists] = await db
      .select({ id: events.id })
      .from(events)
      .where(eq(events.id, gameIdNum))
      .limit(1);
    if (!exists) return res.status(404).json({ error: `Event ${gameIdNum} not found` });

    await db
      .insert(teamStats)
      .values({
        gameId: gameIdNum,
        homeScore: toInt(homeScore) ?? 0,
        awayScore: toInt(awayScore) ?? 0,
        outcome: outcome ?? null,
        shots: toInt(shots),
        shotsOnGoal: toInt(shotsOnGoal),
        cornerKicks: toInt(cornerKicks),
        fouls: toInt(fouls),
        saves: toInt(saves),
      })
      .onDuplicateKeyUpdate({
        set: {
          homeScore: toInt(homeScore) ?? 0,
          awayScore: toInt(awayScore) ?? 0,
          outcome: outcome ?? null,
          shots: toInt(shots),
          shotsOnGoal: toInt(shotsOnGoal),
          cornerKicks: toInt(cornerKicks),
          fouls: toInt(fouls),
          saves: toInt(saves),
          updatedAt: new Date(),
        },
      });

    const [row] = await db
      .select()
      .from(teamStats)
      .where(eq(teamStats.gameId, gameIdNum))
      .limit(1);

    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upsert team stats" });
  }
});

export default router;
