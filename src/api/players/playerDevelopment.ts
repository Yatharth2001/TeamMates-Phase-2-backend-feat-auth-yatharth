import express from "express";
import { db } from "../../db/client";
import { playerDevelopment, playerSkillRatings, playerGoals } from "../../db/playerDevelopment";
import { players } from "../../db/Players";
import { eq } from "drizzle-orm";

const router = express.Router();

// GET /api/player-development/get-all - Get all players with their development data
router.get("/get-all", async (req, res) => {
  try {
    // Fetch all players
    const allPlayers = await db.select().from(players);

    // Fetch development data for each player
    const playersWithDevelopment = await Promise.all(
      allPlayers.map(async (player) => {
        // Get player development record
        const [development] = await db
          .select()
          .from(playerDevelopment)
          .where(eq(playerDevelopment.player_id, player.id))
          .limit(1);

        if (!development) {
          // Return player with default values if no development record exists
          return {
            id: player.id.toString(),
            name: player.name,
            position: player.position || "Not Set",
            age: 0, // Calculate from player data if DOB is available
            overallRating: 0,
            skillRatings: {
              technical: 0,
              physical: 0,
              mental: 0,
              tactical: 0,
            },
            goals: [],
            lastEvaluation: player.created_at.toISOString(),
            status: "stable",
          };
        }

        // Get skill ratings
        const [skillRating] = await db
          .select()
          .from(playerSkillRatings)
          .where(eq(playerSkillRatings.player_development_id, development.id))
          .limit(1);

        // Get goals
        const goals = await db
          .select()
          .from(playerGoals)
          .where(eq(playerGoals.player_development_id, development.id));

        // Format goals
        const formattedGoals = goals.map((goal) => ({
          id: goal.id.toString(),
          title: goal.title,
          description: goal.description || "",
          targetDate: goal.target_date.toISOString(),
          progress: goal.progress,
          category: goal.category as "technical" | "physical" | "mental" | "tactical",
          status: goal.status as "active" | "completed" | "overdue",
        }));

        return {
          id: player.id.toString(),
          name: player.name,
          position: player.position || "Not Set",
          age: 0, // Calculate from player data if DOB is available
          overallRating: development.overall_rating,
          skillRatings: {
            technical: skillRating?.technical || 0,
            physical: skillRating?.physical || 0,
            mental: skillRating?.mental || 0,
            tactical: skillRating?.tactical || 0,
          },
          goals: formattedGoals,
          lastEvaluation: development.last_evaluation.toISOString(),
          status: development.status as "improving" | "stable" | "needs-attention",
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Player development data fetched successfully",
      players: playersWithDevelopment,
    });
  } catch (error) {
    console.error("Error fetching player development data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch player development data",
    });
  }
});

// GET /api/player-development/:playerId - Get development data for a specific player
router.get("/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;

    // Get player
    const [player] = await db
      .select()
      .from(players)
      .where(eq(players.id, parseInt(playerId)))
      .limit(1);

    if (!player) {
      return res.status(404).json({
        success: false,
        error: "Player not found",
      });
    }

    // Get player development record
    const [development] = await db
      .select()
      .from(playerDevelopment)
      .where(eq(playerDevelopment.player_id, player.id))
      .limit(1);

    if (!development) {
      return res.status(404).json({
        success: false,
        error: "Player development data not found",
      });
    }

    // Get skill ratings
    const [skillRating] = await db
      .select()
      .from(playerSkillRatings)
      .where(eq(playerSkillRatings.player_development_id, development.id))
      .limit(1);

    // Get goals
    const goals = await db
      .select()
      .from(playerGoals)
      .where(eq(playerGoals.player_development_id, development.id));

    // Format response
    const response = {
      id: player.id.toString(),
      name: player.name,
      position: player.position || "Not Set",
      age: 0,
      overallRating: development.overall_rating,
      skillRatings: {
        technical: skillRating?.technical || 0,
        physical: skillRating?.physical || 0,
        mental: skillRating?.mental || 0,
        tactical: skillRating?.tactical || 0,
      },
      goals: goals.map((goal) => ({
        id: goal.id.toString(),
        title: goal.title,
        description: goal.description || "",
        targetDate: goal.target_date.toISOString(),
        progress: goal.progress,
        category: goal.category,
        status: goal.status,
      })),
      lastEvaluation: development.last_evaluation.toISOString(),
      status: development.status,
    };

    res.status(200).json({
      success: true,
      message: "Player development data fetched successfully",
      player: response,
    });
  } catch (error) {
    console.error("Error fetching player development data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch player development data",
    });
  }
});

// POST /api/player-development/goal/create - Create a new development goal
router.post("/goal/create", async (req, res) => {
  try {
    const { player_id, title, description, target_date, category, progress } = req.body;

    // Validate required fields
    if (!player_id || !title || !target_date || !category) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: player_id, title, target_date, and category are required",
      });
    }

    // Validate category
    const validCategories = ["technical", "physical", "mental", "tactical"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: "Invalid category. Must be one of: technical, physical, mental, tactical",
      });
    }

    // Get or create player development record
    let [development] = await db
      .select()
      .from(playerDevelopment)
      .where(eq(playerDevelopment.player_id, player_id))
      .limit(1);

    if (!development) {
      // Create player development record if it doesn't exist
      const [newDevelopment] = await db
        .insert(playerDevelopment)
        .values({
          player_id,
          overall_rating: 0,
          status: "stable",
        });

      [development] = await db
        .select()
        .from(playerDevelopment)
        .where(eq(playerDevelopment.player_id, player_id))
        .limit(1);
    }

    // Create the goal
    const [newGoal] = await db.insert(playerGoals).values({
      player_development_id: development.id,
      title,
      description: description || null,
      target_date: new Date(target_date),
      category,
      progress: progress || 0,
      status: "active",
    });

    // Fetch the created goal
    const [createdGoal] = await db
      .select()
      .from(playerGoals)
      .where(eq(playerGoals.id, newGoal.insertId))
      .limit(1);

    res.status(201).json({
      success: true,
      message: "Goal created successfully",
      goal: {
        id: createdGoal.id.toString(),
        title: createdGoal.title,
        description: createdGoal.description,
        targetDate: createdGoal.target_date.toISOString(),
        progress: createdGoal.progress,
        category: createdGoal.category,
        status: createdGoal.status,
      },
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

    // Check if goal exists
    const [existingGoal] = await db
      .select()
      .from(playerGoals)
      .where(eq(playerGoals.id, parseInt(goalId)))
      .limit(1);

    if (!existingGoal) {
      return res.status(404).json({
        success: false,
        error: "Goal not found",
      });
    }

    // Build update object
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (target_date !== undefined) updateData.target_date = new Date(target_date);
    if (progress !== undefined) updateData.progress = progress;
    if (category !== undefined) updateData.category = category;
    if (status !== undefined) updateData.status = status;

    // Update the goal
    await db
      .update(playerGoals)
      .set(updateData)
      .where(eq(playerGoals.id, parseInt(goalId)));

    // Fetch updated goal
    const [updatedGoal] = await db
      .select()
      .from(playerGoals)
      .where(eq(playerGoals.id, parseInt(goalId)))
      .limit(1);

    res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      goal: {
        id: updatedGoal.id.toString(),
        title: updatedGoal.title,
        description: updatedGoal.description,
        targetDate: updatedGoal.target_date.toISOString(),
        progress: updatedGoal.progress,
        category: updatedGoal.category,
        status: updatedGoal.status,
      },
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

    // Check if goal exists
    const [existingGoal] = await db
      .select()
      .from(playerGoals)
      .where(eq(playerGoals.id, parseInt(goalId)))
      .limit(1);

    if (!existingGoal) {
      return res.status(404).json({
        success: false,
        error: "Goal not found",
      });
    }

    // Delete the goal
    await db.delete(playerGoals).where(eq(playerGoals.id, parseInt(goalId)));

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
