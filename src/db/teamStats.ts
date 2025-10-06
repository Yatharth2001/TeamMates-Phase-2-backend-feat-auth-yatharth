// db/schema/teamStats.js
import {
  mysqlTable, int, mysqlEnum, timestamp,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';
import { events } from './events';


export const teamStats = mysqlTable(
  'team_stats',
  {
    id: int('id').primaryKey().autoincrement(),
    gameId: int('game_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),

    homeScore: int('home_score').notNull().default(0),
    awayScore: int('away_score').notNull().default(0),
    outcome: mysqlEnum('outcome', ['win', 'loss', 'tie']), // nullable is OK; set if known

    shots: int('shots'),
    shotsOnGoal: int('shots_on_goal'),
    cornerKicks: int('corner_kicks'),
    fouls: int('fouls'),
    saves: int('saves'),
    // If you bring possession back in the UI, add: possession: int('possession')

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').onUpdateNow().defaultNow(),
  },
  (table) => ({
    // 1 row of team stats per game
    uniqGame: uniqueIndex('uniq_teamstats_game').on(table.gameId),
  })
);
