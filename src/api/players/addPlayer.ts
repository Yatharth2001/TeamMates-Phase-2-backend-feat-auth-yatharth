import multer from "multer";
import { Router } from "express";
import { db } from "../../db/client";
import { players } from "../../db/Players";
import { eq } from "drizzle-orm";

const router = Router();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // folder to save images
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/add-player", upload.single("image"), async (req, res) => {
  try {
    const { name, email, phone_no, position } = req.body;
    // const image = req.file ? `/uploads/${req.file.filename}` : null;
    const image = req.file ? `/uploads/${req.file.filename}` : null;


    if (!name || !email) return res.status(400).json({ error: "Name and Email are required" });

    const existing = await db.select().from(players).where(eq(players.email, email));
    if (existing.length > 0) return res.status(400).json({ error: "Player already exists" });

    const newPlayer = await db.insert(players).values({
      name,
      email,
      phone_no,
      position,
      image,
    });

    res.status(201).json({ message: "Player added successfully", player: newPlayer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
