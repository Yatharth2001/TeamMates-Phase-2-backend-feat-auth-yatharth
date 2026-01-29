import express from "express";
import { db } from "../../db/client";
import { formations, customFormations, tactics, setPlays, gamePlans } from "../../db/formations";
import { eq, and } from "drizzle-orm";

const router = express.Router();

// GET /api/formations/:sportId - Get all formations for a specific sport
router.get("/:sportId", async (req, res) => {
  try {
    const { sportId } = req.params;

    // Get default formations
    const defaultFormations = await db
      .select()
      .from(formations)
      .where(eq(formations.sport_id, sportId));

    // Get custom formations
    const customFormationsList = await db
      .select()
      .from(customFormations)
      .where(eq(customFormations.sport_id, sportId));

    res.status(200).json({
      success: true,
      formations: {
        default: defaultFormations.map(f => ({
          id: f.id.toString(),
          sport_id: f.sport_id,
          name: f.name,
          description: f.description,
          positions: f.positions,
          isDefault: true,
        })),
        custom: customFormationsList.map(f => ({
          id: f.id.toString(),
          sport_id: f.sport_id,
          name: f.name,
          description: f.description,
          positions: f.positions,
          isCustom: true,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching formations:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch formations",
    });
  }
});

// POST /api/formations/custom - Create a custom formation
router.post("/custom", async (req, res) => {
  try {
    const { sport_id, name, description, positions, user_id } = req.body;

    if (!sport_id || !name || !positions) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: sport_id, name, and positions are required",
      });
    }

    const [newFormation] = await db.insert(customFormations).values({
      sport_id,
      name,
      description: description || null,
      positions: JSON.stringify(positions),
      user_id: user_id || null,
    });

    const [createdFormation] = await db
      .select()
      .from(customFormations)
      .where(eq(customFormations.id, newFormation.insertId))
      .limit(1);

    res.status(201).json({
      success: true,
      message: "Custom formation created successfully",
      formation: {
        id: createdFormation.id.toString(),
        sport_id: createdFormation.sport_id,
        name: createdFormation.name,
        description: createdFormation.description,
        positions: createdFormation.positions,
        isCustom: true,
      },
    });
  } catch (error) {
    console.error("Error creating custom formation:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create custom formation",
    });
  }
});

// DELETE /api/formations/custom/:id - Delete a custom formation
router.delete("/custom/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db
      .select()
      .from(customFormations)
      .where(eq(customFormations.id, parseInt(id)))
      .limit(1);

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Custom formation not found",
      });
    }

    await db.delete(customFormations).where(eq(customFormations.id, parseInt(id)));

    res.status(200).json({
      success: true,
      message: "Custom formation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting custom formation:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete custom formation",
    });
  }
});

// GET /api/formations/tactics/:sportId - Get all tactics for a sport
router.get("/tactics/:sportId", async (req, res) => {
  try {
    const { sportId } = req.params;

    const tacticsList = await db
      .select()
      .from(tactics)
      .where(eq(tactics.sport_id, sportId));

    res.status(200).json({
      success: true,
      tactics: tacticsList.map(t => ({
        id: t.id,
        name: t.name,
        isTemplate: t.is_template === 1,
      })),
    });
  } catch (error) {
    console.error("Error fetching tactics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tactics",
    });
  }
});

// GET /api/formations/set-plays/:sportId - Get all set plays for a sport
router.get("/set-plays/:sportId", async (req, res) => {
  try {
    const { sportId } = req.params;

    const setPlaysList = await db
      .select()
      .from(setPlays)
      .where(eq(setPlays.sport_id, sportId));

    res.status(200).json({
      success: true,
      setPlays: setPlaysList.map(sp => ({
        id: sp.id,
        name: sp.name,
        isTemplate: sp.is_template === 1,
      })),
    });
  } catch (error) {
    console.error("Error fetching set plays:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch set plays",
    });
  }
});

// POST /api/formations/game-plan - Save a game plan
router.post("/game-plan", async (req, res) => {
  try {
    const { user_id, opponent, game_date, sport_id, formation_id, key_tactics, set_plays, notes } = req.body;

    if (!sport_id) {
      return res.status(400).json({
        success: false,
        error: "sport_id is required",
      });
    }

    const [newGamePlan] = await db.insert(gamePlans).values({
      user_id: user_id || null,
      opponent: opponent || null,
      game_date: game_date ? new Date(game_date) : null,
      sport_id,
      formation_id: formation_id || null,
      key_tactics: JSON.stringify(key_tactics || []),
      set_plays: JSON.stringify(set_plays || []),
      notes: notes || null,
    });

    const [createdGamePlan] = await db
      .select()
      .from(gamePlans)
      .where(eq(gamePlans.id, newGamePlan.insertId))
      .limit(1);

    res.status(201).json({
      success: true,
      message: "Game plan saved successfully",
      gamePlan: createdGamePlan,
    });
  } catch (error) {
    console.error("Error saving game plan:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save game plan",
    });
  }
});

// GET /api/formations/game-plans - Get all game plans
router.get("/game-plans", async (req, res) => {
  try {
    const gamePlansList = await db.select().from(gamePlans);

    res.status(200).json({
      success: true,
      gamePlans: gamePlansList,
    });
  } catch (error) {
    console.error("Error fetching game plans:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch game plans",
    });
  }
});

export default router;
