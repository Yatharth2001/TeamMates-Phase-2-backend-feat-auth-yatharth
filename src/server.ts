import { playerStats } from './db/playerStats';
import { events } from './db/events';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { toNodeHandler, fromNodeHeaders } from 'better-auth/node';
import { auth } from './auth.js';

import signupRouter from './api/auth/signup';
import loginRouter from './api/auth/login';


import eventsRouter from './api/events/events';
import createRecurringEventsRouter from './api/events/createRecurringEvents.js';
import getEvents from './api/events/getEvents.js';

// ✅ Player routes
import addPlayerRouter from './api/players/addPlayer';
import getPlayersRouter from './api/players/getPlayer';
import attendanceRouter from './api/players/attendance';
import editPlayerRouter from './api/players/updatePlayer.js';

// stats routes
import playerStatsRouter from './api/stats/player-stats'
import getPlayerStatsRouter from './api/stats/getPlayer-stats';
import teamStatsRouter from './api/stats/team-stats';
import getTeamStatsRouter from './api/stats/getTeam-stats';

const app = express();

// ✅ Ensure uploads folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ✅ Serve uploaded images statically
app.use("/uploads", express.static(uploadDir));

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
// ✅ Mount auth properly
app.use('/api/auth', toNodeHandler(auth));



// ✅ Auth APIs
app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);
// ✅ Events APIs
app.use('/api/events', eventsRouter);
app.use('/api/events', createRecurringEventsRouter);
app.use('/api/events', getEvents);

// ✅ Players APIs
app.use('/api/players', addPlayerRouter);
app.use('/api/players', getPlayersRouter);
app.use('/api/players', attendanceRouter);
app.use('/api/players', editPlayerRouter);

// ✅ Stats APIs
app.use('/api/stats', playerStatsRouter);
app.use('/api/stats', getPlayerStatsRouter);
app.use('/api/stats', teamStatsRouter);
app.use('/api/stats', getTeamStatsRouter);

app.get('/api/me', async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  res.json(session);
});

const port = 3005;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
