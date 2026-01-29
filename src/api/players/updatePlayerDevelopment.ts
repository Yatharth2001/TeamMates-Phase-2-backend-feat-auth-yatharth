import express from "express";
import { db } from "../../db/client";
import { playerDevelopment, playerSkillRatings, playerGoals } from "../../db/playerDevelopment";
import { players } from "../../db/Players";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router = express.Router();

// POST /api/player-development/create - Create or update player development data
router.post("/create", async (req, res) => {
  try {
    const {
      player_id,
      overall_rating,
      status,
      skillRatings,
    } = req.body;

    // Validation
    if (!player_id) {
      return res.status(400).json({
        success: false,
        error: "Player ID is required",
      });
    }

    // Check if player exists
    const [player] = await db
      .select()
      .from(players)
      .where(eq(players.id, player_id))
      .limit(1);

    if (!player) {
      return res.status(404).json({
        success: false,
        error: "Player not found",
      });
    }

    // Check if development record already exists
    const [existingDevelopment] = await db
      .select()
      .from(playerDevelopment)
      .where(eq(playerDevelopment.player_id, player_id))
      .limit(1);

    let developmentId;

    if (existingDevelopment) {
      // Update existing record
      await db
        .update(playerDevelopment)
        .set({
          overall_rating: overall_rating || existingDevelopment.overall_rating,
          status: status || existingDevelopment.status,
          last_evaluation: new Date(),
          updated_at: new Date(),
        })
        .where(eq(playerDevelopment.id, existingDevelopment.id));

      developmentId = existingDevelopment.id;
    } else {
      // Create new development record
      const [newDevelopment] = await db
        .insert(playerDevelopment)
        .values({
          player_id,
          overall_rating: overall_rating || 0,
          status: status || "stable",
          last_evaluation: new Date(),
        })
        .$returningId();

      developmentId = newDevelopment.id;
    }

    // Handle skill ratings
    if (skillRatings) {
      const [existingSkillRating] = await db
        .select()
        .from(playerSkillRatings)
        .where(eq(playerSkillRatings.player_development_id, developmentId))
        .limit(1);

      if (existingSkillRating) {
        // Update existing skill ratings
        await db
          .update(playerSkillRatings)
          .set({
            technical: skillRatings.technical ?? existingSkillRating.technical,
            physical: skillRatings.physical ?? existingSkillRating.physical,
            mental: skillRatings.mental ?? existingSkillRating.mental,
            tactical: skillRatings.tactical ?? existingSkillRating.tactical,
            updated_at: new Date(),
          })
          .where(eq(playerSkillRatings.id, existingSkillRating.id));
      } else {
        // Create new skill ratings
        await db.insert(playerSkillRatings).values({
          player_development_id: developmentId,
          technical: skillRatings.technical || 0,
          physical: skillRatings.physical || 0,
          mental: skillRatings.mental || 0,
          tactical: skillRatings.tactical || 0,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Player development data created/updated successfully",
      developmentId,
    });
  } catch (error) {
    console.error("Error creating/updating player development:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create/update player development data",
    });
  }
});

// POST /api/player-development/goal/create - Create a new goal for a player
router.post("/goal/create", async (req, res) => {
  try {
    const {
      player_id,
      title,
      description,
      target_date,
      category,
      progress,
    } = req.body;

    // Validation
    if (!player_id || !title || !target_date || !category) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Get or create player development record
    let [development] = await db
      .select()
      .from(playerDevelopment)
      .where(eq(playerDevelopment.player_id, player_id))
      .limit(1);

    if (!development) {
      // Create development record if it doesn't exist
      const [newDevelopment] = await db
        .insert(playerDevelopment)
        .values({
          player_id,
          overall_rating: 0,
          status: "stable",
        })
        .$returningId();

      development = { id: newDevelopment.id } as any;
    }

    // Create goal
    const [newGoal] = await db
      .insert(playerGoals)
      .values({
        player_development_id: development.id,
        title,
        description: description || "",
        target_date: new Date(target_date),
        category,
        progress: progress || 0,
        status: "active",
      })
      .$returningId();

    res.status(201).json({
      success: true,
      message: "Goal created successfully",
      goalId: newGoal.id,
    });
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create goal",
    });
  }
});

// PUT /api/player-development/goal/:goalId - Update a goal
router.put("/goal/:goalId", async (req, res) => {
  try {
    const { goalId } = req.params;
    const { title, description, target_date, progress, category, status } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (target_date !== undefined) updateData.target_date = new Date(target_date);
    if (progress !== undefined) updateData.progress = progress;
    if (category !== undefined) updateData.category = category;
    if (status !== undefined) updateData.status = status;
    updateData.updated_at = new Date();

    await db
      .update(playerGoals)
      .set(updateData)
      .where(eq(playerGoals.id, parseInt(goalId)));

    res.status(200).json({
      success: true,
      message: "Goal updated successfully",
    });
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update goal",
    });
  }
});

// DELETE /api/player-development/goal/:goalId - Delete a goal
router.delete("/goal/:goalId", async (req, res) => {
  try {
    const { goalId } = req.params;

    await db
      .delete(playerGoals)
      .where(eq(playerGoals.id, parseInt(goalId)));

    res.status(200).json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete goal",
    });
  }
});

export default router;
