import { Router } from "express";

import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { announcements } from "../../db/announcements";

const router = Router();

router.post("/add-announcement", async (req, res) => {
  try {
    const { title, content, recipients } = req.body ?? {};
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const insertedIds = await db
      .insert(announcements)
      .values({ title, content, recipients })
      .$returningId();

    const newId = insertedIds[0].id;

    const [row] = await db
      .select()
      .from(announcements)
      .where(eq(announcements.id, newId))
      .limit(1);

    return res.status(201).json({ message: "Announcement created", announcement: row });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create announcement" });
  }
});

export default router;
