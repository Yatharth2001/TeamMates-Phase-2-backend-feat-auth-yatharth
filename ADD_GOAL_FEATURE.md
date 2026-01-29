# Add Goal Feature Implementation

## Overview
This implementation adds a complete "Add Development Goal" feature to the Player Development page, allowing coaches to create development goals for players.

## Backend Implementation

### Database Schema (Already Existing)
The database schema in `src/db/playerDevelopment.ts` includes:
- `playerGoals` table with fields:
  - `id`: Auto-increment primary key
  - `player_development_id`: Foreign key to player_development
  - `title`: Goal title (required)
  - `description`: Goal description (optional)
  - `target_date`: Target completion date (required)
  - `progress`: Progress percentage (0-100)
  - `category`: technical | physical | mental | tactical (required)
  - `status`: active | completed | overdue

### API Endpoints
Added to `src/api/players/playerDevelopment.ts`:

#### 1. Create Goal
- **Endpoint**: `POST /api/player-development/goal/create`
- **Body**:
  ```json
  {
    "player_id": 1,
    "title": "Improve First Touch",
    "description": "Focus on ball control drills",
    "target_date": "2025-03-01",
    "category": "technical",
    "progress": 0
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Goal created successfully",
    "goal": { ... }
  }
  ```

#### 2. Update Goal
- **Endpoint**: `PUT /api/player-development/goal/:goalId`
- **Body**: Partial update (any field from the goal)
- **Response**: Updated goal data

#### 3. Delete Goal
- **Endpoint**: `DELETE /api/player-development/goal/:goalId`
- **Response**: Success confirmation

### Features
- Automatically creates player development record if it doesn't exist
- Validates required fields (player_id, title, target_date, category)
- Validates category values
- Proper error handling and status codes

## Frontend Implementation

### New Component: AddGoalDialog
**Location**: `src/components/AddGoalDialog.tsx`

**Features**:
- Modal dialog for adding goals
- Player dropdown (populated from database)
- Goal title input (required)
- Description textarea (optional)
- Category dropdown (Technical, Physical, Mental, Tactical) (required)
- Target date picker (required)
- Form validation
- Loading states
- Toast notifications for success/error
- Can be preselected with a specific player

**Props**:
```typescript
{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  preselectedPlayerId?: number;
}
```

### Integration in PlayerDevelopment Page
**Location**: `src/pages/PlayerDevelopment.tsx`

**Changes**:
1. Added `AddGoalDialog` import
2. Added state management:
   - `addGoalModalOpen`: Controls dialog visibility
   - `selectedPlayerForGoal`: Optional player pre-selection
3. Connected "Add Goal" button in header
4. Connected "New Goal" button in Development Goals tab
5. Refreshes player list after goal creation

### Service Functions
**Location**: `src/services/Player.ts`

Added `getAllPlayers()` function to fetch all players for the dropdown.

## Usage

### Backend Setup
1. The database schema already exists
2. The API routes are automatically mounted via the existing router
3. No migration needed (tables already exist)

### Frontend Usage
1. Navigate to Player Development page
2. Click "Add Goal" button in header OR "New Goal" in the Goals tab
3. Fill in the form:
   - Select a player
   - Enter goal title
   - (Optional) Add description
   - Select category
   - Set target date
4. Click "Add Goal" to create

### Testing

#### Test Backend API
```bash
# Start backend server
cd TeamMates-Phase-2-backend-feat-auth-yatharth
npm run dev

# Test create goal endpoint
curl -X POST http://localhost:3005/api/player-development/goal/create \
  -H "Content-Type: application/json" \
  -d '{
    "player_id": 1,
    "title": "Improve First Touch",
    "description": "Focus on ball control",
    "target_date": "2025-03-01",
    "category": "technical"
  }'
```

#### Test Frontend
```bash
# Start frontend server
cd TeamMates-Phase-2-frontend-feat-routes-yatharth
npm run dev

# Navigate to: http://localhost:8080/player-development
# Click "Add Goal" button
# Fill and submit form
```

## Error Handling
- Missing required fields: 400 Bad Request
- Invalid category: 400 Bad Request
- Player not found: Automatically creates development record
- Goal not found (update/delete): 404 Not Found
- Server errors: 500 Internal Server Error
- Frontend displays toast notifications for all errors

## Future Enhancements
- Goal progress tracking UI
- Goal editing from the dialog
- Bulk goal creation
- Goal templates
- Goal notifications/reminders
- Goal analytics dashboard
