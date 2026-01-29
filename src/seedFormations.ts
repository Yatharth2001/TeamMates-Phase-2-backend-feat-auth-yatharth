import { db } from "./db/client";
import { formations, tactics, setPlays } from "./db/formations";

// Formation data for different sports
const sportsFormationsData = {
  hockey: {
    formations: [
      {
        sport_id: "hockey",
        name: "1-2-2",
        description: "Standard neutral zone trap formation",
        positions: [
          { id: "g", x: 50, y: 92, role: "Goalie" },
          { id: "ld", x: 30, y: 75, role: "Left Defense" },
          { id: "rd", x: 70, y: 75, role: "Right Defense" },
          { id: "lw", x: 25, y: 40, role: "Left Wing" },
          { id: "rw", x: 75, y: 40, role: "Right Wing" },
          { id: "c", x: 50, y: 25, role: "Center" }
        ]
      },
      {
        sport_id: "hockey",
        name: "2-1-2",
        description: "Aggressive forecheck formation",
        positions: [
          { id: "g", x: 50, y: 92, role: "Goalie" },
          { id: "ld", x: 30, y: 75, role: "Left Defense" },
          { id: "rd", x: 70, y: 75, role: "Right Defense" },
          { id: "c", x: 50, y: 50, role: "Center" },
          { id: "lw", x: 25, y: 25, role: "Left Wing" },
          { id: "rw", x: 75, y: 25, role: "Right Wing" }
        ]
      },
      {
        sport_id: "hockey",
        name: "1-3-1",
        description: "Box formation for power play defense",
        positions: [
          { id: "g", x: 50, y: 92, role: "Goalie" },
          { id: "ld", x: 50, y: 75, role: "Point" },
          { id: "lw", x: 25, y: 50, role: "Left Wing" },
          { id: "c", x: 50, y: 50, role: "Center" },
          { id: "rw", x: 75, y: 50, role: "Right Wing" },
          { id: "f", x: 50, y: 25, role: "High Forward" }
        ]
      }
    ],
    tactics: [
      "Forecheck Pressure",
      "Neutral Zone Trap",
      "Offensive Zone Cycling",
      "Dump and Chase",
      "Breakout Speed",
      "Defensive Box",
      "Power Play Umbrella",
      "Penalty Kill Aggressive"
    ],
    setPlays: [
      "Face-off - Offensive Zone",
      "Face-off - Defensive Zone",
      "Power Play - Umbrella",
      "Power Play - Overload",
      "Penalty Kill - Diamond",
      "Breakout - D to D",
      "Line Change Strategy",
      "Empty Net Pull"
    ]
  },
  soccer: {
    formations: [
      {
        sport_id: "soccer",
        name: "4-4-2",
        description: "Balanced formation with solid defense and attacking options",
        positions: [
          { id: "gk", x: 50, y: 95, role: "Goalkeeper" },
          { id: "lb", x: 20, y: 75, role: "Left Back" },
          { id: "cb1", x: 40, y: 80, role: "Center Back" },
          { id: "cb2", x: 60, y: 80, role: "Center Back" },
          { id: "rb", x: 80, y: 75, role: "Right Back" },
          { id: "lm", x: 20, y: 50, role: "Left Mid" },
          { id: "cm1", x: 40, y: 55, role: "Center Mid" },
          { id: "cm2", x: 60, y: 55, role: "Center Mid" },
          { id: "rm", x: 80, y: 50, role: "Right Mid" },
          { id: "st1", x: 40, y: 25, role: "Striker" },
          { id: "st2", x: 60, y: 25, role: "Striker" }
        ]
      },
      {
        sport_id: "soccer",
        name: "4-3-3",
        description: "Attacking formation with width and creativity",
        positions: [
          { id: "gk", x: 50, y: 95, role: "Goalkeeper" },
          { id: "lb", x: 20, y: 75, role: "Left Back" },
          { id: "cb1", x: 40, y: 80, role: "Center Back" },
          { id: "cb2", x: 60, y: 80, role: "Center Back" },
          { id: "rb", x: 80, y: 75, role: "Right Back" },
          { id: "cdm", x: 50, y: 60, role: "Def Mid" },
          { id: "cm1", x: 35, y: 50, role: "Center Mid" },
          { id: "cm2", x: 65, y: 50, role: "Center Mid" },
          { id: "lw", x: 20, y: 25, role: "Left Wing" },
          { id: "st", x: 50, y: 20, role: "Striker" },
          { id: "rw", x: 80, y: 25, role: "Right Wing" }
        ]
      },
      {
        sport_id: "soccer",
        name: "3-5-2",
        description: "Midfield dominant with attacking wing backs",
        positions: [
          { id: "gk", x: 50, y: 95, role: "Goalkeeper" },
          { id: "cb1", x: 30, y: 80, role: "Center Back" },
          { id: "cb2", x: 50, y: 85, role: "Center Back" },
          { id: "cb3", x: 70, y: 80, role: "Center Back" },
          { id: "lwb", x: 15, y: 55, role: "Left Wing Back" },
          { id: "cm1", x: 35, y: 55, role: "Center Mid" },
          { id: "cm2", x: 50, y: 50, role: "Center Mid" },
          { id: "cm3", x: 65, y: 55, role: "Center Mid" },
          { id: "rwb", x: 85, y: 55, role: "Right Wing Back" },
          { id: "st1", x: 40, y: 25, role: "Striker" },
          { id: "st2", x: 60, y: 25, role: "Striker" }
        ]
      }
    ],
    tactics: [
      "High Press from Front",
      "Counter-Attack Speed",
      "Possession Control",
      "Wing Play Focus",
      "Set Piece Advantage",
      "Defensive Shape",
      "Quick Transitions",
      "Overload Midfield"
    ],
    setPlays: [
      "Corner Kick - Near Post",
      "Corner Kick - Far Post",
      "Free Kick - Wall Pass",
      "Throw In - Long",
      "Goal Kick - Short",
      "Penalty - Placement",
      "Direct Free Kick",
      "Indirect Free Kick"
    ]
  },
  football: {
    formations: [
      {
        sport_id: "football",
        name: "I-Formation",
        description: "Traditional power running formation",
        positions: [
          { id: "qb", x: 50, y: 60, role: "Quarterback" },
          { id: "fb", x: 50, y: 70, role: "Fullback" },
          { id: "rb", x: 50, y: 80, role: "Running Back" },
          { id: "lt", x: 30, y: 55, role: "Left Tackle" },
          { id: "lg", x: 40, y: 55, role: "Left Guard" },
          { id: "c", x: 50, y: 55, role: "Center" },
          { id: "rg", x: 60, y: 55, role: "Right Guard" },
          { id: "rt", x: 70, y: 55, role: "Right Tackle" },
          { id: "te", x: 80, y: 55, role: "Tight End" },
          { id: "wr1", x: 15, y: 55, role: "Wide Receiver" },
          { id: "wr2", x: 90, y: 50, role: "Wide Receiver" }
        ]
      },
      {
        sport_id: "football",
        name: "Shotgun",
        description: "Passing-focused spread formation",
        positions: [
          { id: "qb", x: 50, y: 70, role: "Quarterback" },
          { id: "rb", x: 40, y: 70, role: "Running Back" },
          { id: "lt", x: 30, y: 55, role: "Left Tackle" },
          { id: "lg", x: 40, y: 55, role: "Left Guard" },
          { id: "c", x: 50, y: 55, role: "Center" },
          { id: "rg", x: 60, y: 55, role: "Right Guard" },
          { id: "rt", x: 70, y: 55, role: "Right Tackle" },
          { id: "te", x: 80, y: 55, role: "Tight End" },
          { id: "wr1", x: 10, y: 55, role: "Wide Receiver" },
          { id: "wr2", x: 90, y: 55, role: "Wide Receiver" },
          { id: "slot", x: 20, y: 50, role: "Slot Receiver" }
        ]
      }
    ],
    tactics: [
      "Run Heavy Offense",
      "Play Action Pass",
      "Spread Attack",
      "Zone Blocking",
      "Man Coverage",
      "Zone Coverage",
      "Blitz Package",
      "Two-Minute Drill"
    ],
    setPlays: [
      "Kickoff Return",
      "Punt Return",
      "Field Goal Block",
      "Hail Mary",
      "Onside Kick",
      "2-Point Conversion",
      "Fake Punt",
      "Goal Line Stand"
    ]
  },
  basketball: {
    formations: [
      {
        sport_id: "basketball",
        name: "1-3-1 Zone",
        description: "Trapping zone defense",
        positions: [
          { id: "pg", x: 50, y: 25, role: "Point Guard" },
          { id: "sf1", x: 25, y: 45, role: "Wing" },
          { id: "c", x: 50, y: 50, role: "Center" },
          { id: "sf2", x: 75, y: 45, role: "Wing" },
          { id: "pf", x: 50, y: 75, role: "Baseline" }
        ]
      },
      {
        sport_id: "basketball",
        name: "2-3 Zone",
        description: "Traditional zone defense",
        positions: [
          { id: "pg", x: 35, y: 30, role: "Guard" },
          { id: "sg", x: 65, y: 30, role: "Guard" },
          { id: "sf", x: 25, y: 55, role: "Forward" },
          { id: "c", x: 50, y: 65, role: "Center" },
          { id: "pf", x: 75, y: 55, role: "Forward" }
        ]
      }
    ],
    tactics: [
      "Pick and Roll",
      "Fast Break",
      "Zone Defense",
      "Man-to-Man",
      "Full Court Press",
      "Triangle Offense"
    ],
    setPlays: [
      "Inbound - Baseline",
      "Inbound - Sideline",
      "Free Throw - Rebound",
      "Last Second Shot"
    ]
  }
};

async function seedFormations() {
  console.log("Starting formations seed...");

  try {
    // Seed formations
    for (const [sportId, sportData] of Object.entries(sportsFormationsData)) {
      console.log(`Seeding ${sportId} formations...`);
      
      for (const formation of sportData.formations) {
        await db.insert(formations).values({
          sport_id: formation.sport_id,
          name: formation.name,
          description: formation.description,
          positions: JSON.stringify(formation.positions),
          is_default: 1,
        });
      }

      // Seed tactics
      console.log(`Seeding ${sportId} tactics...`);
      for (const tactic of sportData.tactics) {
        await db.insert(tactics).values({
          sport_id: sportId,
          name: tactic,
          is_template: 1,
        });
      }

      // Seed set plays
      console.log(`Seeding ${sportId} set plays...`);
      for (const setPlay of sportData.setPlays) {
        await db.insert(setPlays).values({
          sport_id: sportId,
          name: setPlay,
          is_template: 1,
        });
      }
    }

    console.log("✅ Formations seed completed successfully!");
  } catch (error) {
    console.error("Error seeding formations:", error);
    throw error;
  }
}

// Run the seed
seedFormations()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
