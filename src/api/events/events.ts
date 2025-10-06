// routes/events.js
import express from "express";


import { db } from "../../db/client";
import { events} from "../../db/events.js";
import { eq } from "drizzle-orm";

const router = express.Router();

router.post("/add-event", async (req, res) => {
  try {
    const {
      type,
      title,
      date,
      startTime,
      endTime,
      opponent,
      gameType,
      arrivalTime,
      uniform,
      dressCode,
      focusAreas,
      location,
      address,
      description,
      notifyTeam,
    } = req.body;

    const insertedIds = await db
  .insert(events)
  .values({
    type,
    title,
    date,
    startTime,
    endTime,
    opponent,
    gameType,
    arrivalTime,
    uniform,
    dressCode,
    focusAreas,
    location,
    address,
    description,
    notifyTeam,
  })
  .$returningId();

const newId = insertedIds[0].id; // 👈 extract the number

const [newEvent] = await db
  .select()
  .from(events)
  .where(eq(events.id, newId)); // ✅ works now


    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

export default router;
