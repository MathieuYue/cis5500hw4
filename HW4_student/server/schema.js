const { pgTable, varchar, integer, doublePrecision } = require('drizzle-orm/pg-core');

// Drizzle schema for the Swiftify database. It only describes the existing tables so Drizzle
// can build queries for us; it does not create or modify anything in the database.
// Generated with `npx drizzle-kit pull`, then edited so the JavaScript field names match the
// column names (album_id rather than albumId). That way the ORM routes return the same JSON as routes.js.
// Do not edit.
const albums = pgTable('albums', {
  album_id: varchar({ length: 22 }).notNull(),
  title: varchar({ length: 32 }),
  release_date: varchar({ length: 10 }),
  thumbnail_url: varchar({ length: 64 }),
});

const songs = pgTable('songs', {
  song_id: varchar({ length: 22 }).notNull(),
  album_id: varchar({ length: 22 }).references(() => albums.album_id),
  title: varchar({ length: 128 }),
  number: integer(),
  duration: integer(),
  plays: integer(),
  danceability: doublePrecision(),
  energy: doublePrecision(),
  valence: doublePrecision(),
  tempo: integer(),
  key_mode: varchar({ length: 8 }),
  explicit: integer(),
});

module.exports = { albums, songs };
