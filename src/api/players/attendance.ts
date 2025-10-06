// src/api/players/attendance.ts
import express from "express";
import { db } from "../../db/client.js";
import { eq } from "drizzle-orm";
import { players } from "../../db/Players.js";

const router = express.Router();

// ✅ Utility function for safe error handling
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

router.patch("/:id/attendance", async (req, res) => {
  const { id } = req.params;
  const { attending, status } = req.body;

  try {
    await db
      .update(players)
      .set({ attending, status })
      .where(eq(players.id, Number(id)));

    res.json({ success: true, message: "Attendance updated" });
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;
