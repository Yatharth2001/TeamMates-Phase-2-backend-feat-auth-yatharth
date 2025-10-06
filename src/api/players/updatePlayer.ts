// src/api/players/editPlayer.ts
import express from "express";
import { db } from "../../db/client.js";
import { eq } from "drizzle-orm";
import { players } from "../../db/Players.js";

const router = express.Router();

// ✅ Utility function to safely extract error messages
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone_no, position, image } = req.body;

  try {
    await db
      .update(players)
      .set({ name, email, phone_no, position, image })
      .where(eq(players.id, Number(id)));

    res.json({ success: true, message: "Player updated" });
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;
