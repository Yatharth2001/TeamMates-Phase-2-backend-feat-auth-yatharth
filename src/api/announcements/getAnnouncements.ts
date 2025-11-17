import { Router } from "express";

import { desc } from "drizzle-orm";
import { db } from "../../db/client";
import { announcements } from "../../db/announcements";

const router = Router();

router.get("/get-announcements", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);

    const rows = await db
      .select()
      .from(announcements)
      .orderBy(desc(announcements.createdAt))
      .limit(limit);

    return res.json({ announcements: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

export default router;
