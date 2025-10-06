// routes/player-stats.post.js
import express from "express";
import { db } from "../../db/client.js";
import { playerStats } from "../../db/playerStats.js";

import { and, eq } from "drizzle-orm";
import { events } from "../../db/events.js";

const router = express.Router();

const toInt = (v:any) => {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

// Upsert: one row per (gameId, playerId)
router.post("/player-stats/upsert", async (req, res) => {
  try {
    const {
      gameId,
      playerId,
      playerName,
      minutesPlayed,
      goals,
      assists,
      shots,
      tackles,
      interceptions,
      foulsCommitted,
      foulsReceived,
    } = req.body;

    const gameIdNum = Number(gameId);
    if (!gameIdNum)
      return res.status(400).json({ error: "gameId is required and must be a number" });
    if (!playerId)
      return res.status(400).json({ error: "playerId is required" });
    if (!playerName)
      return res.status(400).json({ error: "playerName is required" });

    // Ensure the event exists
    const [exists] = await db
      .select({ id: events.id })
      .from(events)
      .where(eq(events.id, gameIdNum))
      .limit(1);
    if (!exists) return res.status(404).json({ error: `Event ${gameIdNum} not found` });

    await db
      .insert(playerStats)
      .values({
        gameId: gameIdNum,
        playerId,
        playerName,
        minutesPlayed: toInt(minutesPlayed) ?? 0,
        goals: toInt(goals) ?? 0,
        assists: toInt(assists) ?? 0,
        shots: toInt(shots) ?? 0,
        tackles: toInt(tackles) ?? 0,
        interceptions: toInt(interceptions) ?? 0,
        foulsCommitted: toInt(foulsCommitted) ?? 0,
        foulsReceived: toInt(foulsReceived) ?? 0,
      })
      .onDuplicateKeyUpdate({
        set: {
          playerName,
          minutesPlayed: toInt(minutesPlayed) ?? 0,
          goals: toInt(goals) ?? 0,
          assists: toInt(assists) ?? 0,
          shots: toInt(shots) ?? 0,
          tackles: toInt(tackles) ?? 0,
          interceptions: toInt(interceptions) ?? 0,
          foulsCommitted: toInt(foulsCommitted) ?? 0,
          foulsReceived: toInt(foulsReceived) ?? 0,
          updatedAt: new Date(),
        },
      });

    const [row] = await db
      .select()
      .from(playerStats)
      .where(and(eq(playerStats.gameId, gameIdNum), eq(playerStats.playerId, playerId)))
      .limit(1);

    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upsert player stats" });
  }
});

export default router;
