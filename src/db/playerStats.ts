import {
  mysqlTable, int, varchar, timestamp,
  uniqueIndex, index,
} from 'drizzle-orm/mysql-core';
import { events } from './events';

export const playerStats = mysqlTable(
  'player_stats',
  {
    id: int('id').primaryKey().autoincrement(),
    gameId: int('game_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),

    // Keeping flexible (string ids) because your UI passes "player1:John Smith"
    playerId: varchar('player_id', { length: 64 }).notNull(),
    playerName: varchar('player_name', { length: 255 }).notNull(),

    minutesPlayed: int('minutes_played').default(0),
    goals: int('goals').default(0),
    assists: int('assists').default(0),
    shots: int('shots').default(0),
    tackles: int('tackles').default(0),
    interceptions: int('interceptions').default(0),
    foulsCommitted: int('fouls_committed').default(0),
    foulsReceived: int('fouls_received').default(0),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').onUpdateNow().defaultNow(),
  },
  (table) => ({
    // One row per (game, player)
    uniqGamePlayer: uniqueIndex('uniq_playerstats_game_player').on(
      table.gameId,
      table.playerId
    ),
    idxGame: index('idx_playerstats_game').on(table.gameId),
  })
);
