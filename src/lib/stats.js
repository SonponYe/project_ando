// src/lib/stats.js
// Pure helpers that turn the raw play log (array of { id, name, artist,
// image, preview_url, ts }, newest first) into displayable listening stats.
// No React, no storage — just math over the log.

// Local-timezone day key, so "today" matches the user's clock and day
// stepping via setDate() stays correct across DST shifts.
const dayKey = (d) => d.toDateString();

const rankBy = (log, keyOf) => {
  const groups = new Map();
  for (const ev of log) {
    const key = keyOf(ev);
    if (!key) continue;
    const g = groups.get(key);
    if (g) g.count += 1;
    else groups.set(key, { event: ev, count: 1 }); // log is newest-first, so `event` keeps the freshest metadata
  }
  return [...groups.values()].sort((a, b) => b.count - a.count);
};

// Plays per day for the trailing `days` days, oldest first —
// [{ label: 'Mon', date: Date, count }]
export const playsByDay = (log, days = 7) => {
  const buckets = [];
  const byKey = new Map();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const bucket = {
      date: d,
      label: d.toLocaleDateString(undefined, { weekday: 'short' }),
      count: 0,
    };
    buckets.push(bucket);
    byKey.set(dayKey(d), bucket);
  }
  for (const ev of log) {
    const bucket = byKey.get(dayKey(new Date(ev.ts)));
    if (bucket) bucket.count += 1;
  }
  return buckets;
};

// Consecutive days with at least one play, ending today — or yesterday if
// today is still quiet, so an unbroken streak isn't shown as 0 before the
// user's first play of the day.
export const listeningStreak = (log) => {
  const played = new Set(log.map((ev) => dayKey(new Date(ev.ts))));
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (!played.has(dayKey(d))) d.setDate(d.getDate() - 1);
  let streak = 0;
  while (played.has(dayKey(d))) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
};

export const computeStats = (log, { topCount = 5, days = 7 } = {}) => {
  const daily = playsByDay(log, days);
  const weekStart = daily[0].date.getTime();
  return {
    totalPlays: log.length,
    playsThisWeek: log.filter((ev) => ev.ts >= weekStart).length,
    uniqueTracks: new Set(log.map((ev) => ev.id)).size,
    uniqueArtists: new Set(log.map((ev) => ev.artist)).size,
    topTracks: rankBy(log, (ev) => ev.id).slice(0, topCount),
    topArtists: rankBy(log, (ev) => ev.artist).slice(0, topCount),
    daily,
    streak: listeningStreak(log),
  };
};

// Rebuild a playable track object from a logged play event (the shape the
// player and TrackRow expect). Local-file tracks still need their blob URL
// rehydrated from IndexedDB by the caller.
export const eventToTrack = (ev) => ({
  id: ev.id,
  name: ev.name,
  artists: [{ name: ev.artist }],
  album: { name: '', images: ev.image ? [{ url: ev.image }] : [] },
  preview_url: ev.preview_url || null,
});
