# Player Development Setup

## Database Schema

This implementation adds three new tables for player development tracking:

### Tables Created:

1. **player_development** - Main development record for each player
   - player_id (foreign key to players table)
   - overall_rating (0-100)
   - last_evaluation (timestamp)
   - status (improving/stable/needs-attention)

2. **player_skill_ratings** - Skill breakdown for each player
   - player_development_id (foreign key)
   - technical (0-100)
   - physical (0-100)
   - mental (0-100)
   - tactical (0-100)

3. **player_goals** - Individual development goals
   - player_development_id (foreign key)
   - title
   - description
   - target_date
   - progress (0-100)
   - category (technical/physical/mental/tactical)
   - status (active/completed/overdue)

## Setup Instructions

### 1. Generate Migration Files

```bash
cd TeamMates-Phase-2-backend-feat-auth-yatharth
npx drizzle-kit generate
```

### 2. Apply Migrations to Database

```bash
npx drizzle-kit push
```

### 3. Start Backend Server

```bash
npm run dev
```

### 4. Start Frontend

```bash
cd ../TeamMates-Phase-2-frontend-feat-routes-yatharth
npm run dev
```

## API Endpoints

### Get All Players with Development Data
```
GET /api/player-development/get-all
```

### Get Single Player Development Data
```
GET /api/player-development/:playerId
```

### Create/Update Player Development
```
POST /api/player-development/create
Body: {
  player_id: number,
  overall_rating?: number,
  status?: "improving" | "stable" | "needs-attention",
  skillRatings?: {
    technical?: number,
    physical?: number,
    mental?: number,
    tactical?: number
  }
}
```

### Create Player Goal
```
POST /api/player-development/goal/create
Body: {
  player_id: number,
  title: string,
  description?: string,
  target_date: string,
  category: "technical" | "physical" | "mental" | "tactical",
  progress?: number
}
```

### Update Player Goal
```
PUT /api/player-development/goal/:goalId
Body: {
  title?: string,
  description?: string,
  target_date?: string,
  progress?: number,
  category?: string,
  status?: "active" | "completed" | "overdue"
}
```

### Delete Player Goal
```
DELETE /api/player-development/goal/:goalId
```

## Frontend Integration

The `/player-development` page now:
- Fetches real player data from the API
- Displays player development information
- Shows skill ratings and progress
- Lists active goals and their progress
- Includes "View Details" and "Evaluate" buttons for each player
- Has loading and error states

## Features

- **Team Overview**: View all players with their ratings, status, and goals
- **Individual Progress**: Detailed view of a selected player's development
- **Development Goals**: Manage and track player goals by category
- **Filters**: Search by name and filter by position
- **Real-time Data**: All data is fetched from the database

## Testing

1. Make sure you have players in your database (use the existing player management features)
2. Navigate to `/player-development` page
3. The page will show all players with default development data (0 ratings initially)
4. Use the "Evaluate" button to create/update player development data
5. Use "Add Goal" to create new development goals for players

## Notes

- Players without development records will show default values (0 ratings, stable status)
- Development records are automatically created when setting goals or evaluations
- All timestamps are stored in UTC and converted to local time for display
