// routes/events.js
import express from "express";
import { db } from "../../db/client.js";
import { events } from "../../db/events.js";
import { eq } from "drizzle-orm";
import dayjs from "dayjs"; // install: npm i dayjs

const router = express.Router();

/**
 * Create Recurring Events
 * body: {
 *   type, title, location, startDate, endDate, startTime, endTime,
 *   repeat: "daily" | "weekly" | "biweekly" | "monthly",
 *   daysOfWeek: ["Mon", "Wed", "Fri"], // optional for weekly/biweekly
 *   other optional event fields
 * }
 */
router.post("/add-recurring-events", async (req, res) => {
  try {
    const {
      type,
      title,
      location,
      address,
      description,
      notifyTeam = true,
      startDate,
      endDate,
      startTime,
      endTime,
      repeat,
      daysOfWeek = [], // array of ["Mon", "Tue", ...]
      opponent,
      gameType,
      arrivalTime,
      uniform,
      dressCode,
      focusAreas,
    } = req.body;

    if (!startDate || !endDate || !repeat) {
      return res.status(400).json({ error: "startDate, endDate and repeat are required" });
    }

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    let current = start;
    const eventsToInsert = [];

    // Map JS days: Sun=0 ... Sat=6
    const dayMap = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };

    while (current.isBefore(end) || current.isSame(end, "day")) {
      let shouldAdd = false;

      switch (repeat) {
        case "daily":
          shouldAdd = true;
          break;
        case "weekly":
          if (daysOfWeek.includes(current.format("ddd"))) shouldAdd = true;
          break;
        case "biweekly":
          if (daysOfWeek.includes(current.format("ddd")) && current.diff(start, "week") % 2 === 0) {
            shouldAdd = true;
          }
          break;
        case "monthly":
          if (current.date() === start.date()) shouldAdd = true;
          break;
      }

      if (shouldAdd) {
        eventsToInsert.push({
          type,
          title,
          date: current.toDate(), // Convert to JS Date object
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
        });
      }

      // Move date
      current = current.add(1, "day");
    }

    if (eventsToInsert.length === 0) {
      return res.status(400).json({ error: "No events generated with given criteria" });
    }

    // Insert all generated events
    const inserted = await db.insert(events).values(eventsToInsert);

    res.status(201).json({ message: "Recurring events created", count: eventsToInsert.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create recurring events" });
  }
});

export default router;
