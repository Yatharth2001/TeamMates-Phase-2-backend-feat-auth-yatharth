

import { Router } from "express";
import { db } from "../../db/client";

import { events } from "../../db/events";

const router = Router();

// GET all players
router.get("/get-events", async (req, res) => {
  try {
    const allEvents = await db.select().from(events);

    res.status(200).json({
      message: "Events fetched successfully",
      events: allEvents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
