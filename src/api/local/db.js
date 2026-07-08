// src/api/local/db.js
// Thin IndexedDB wrapper storing imported local audio files (as Blobs) plus
// their metadata, so a user's imported library persists across reloads —
// unlike a plain object URL from a file picker, which dies with the page.
import { openDB } from 'idb';

const DB_NAME = 'ando-local-library';
const STORE = 'tracks';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE, { keyPath: 'id' });
  },
});

// record shape: { id, name, artists, album, blob, addedAt }

export const getAllLocalTracks = async () => {
  const db = await dbPromise;
  return db.getAll(STORE);
};

export const getLocalTrack = async (id) => {
  const db = await dbPromise;
  return db.get(STORE, id);
};

export const putLocalTrack = async (record) => {
  const db = await dbPromise;
  await db.put(STORE, record);
};

export const deleteLocalTrack = async (id) => {
  const db = await dbPromise;
  await db.delete(STORE, id);
};

// No ID3/embedded-metadata parsing (would need extra deps that don't play
// well with CRA's webpack 5 setup) — just a "Artist - Title.mp3" filename
// heuristic, falling back to the bare filename.
export const parseFilenameMetadata = (filename) => {
  const withoutExt = filename.replace(/\.[^/.]+$/, '');
  const parts = withoutExt.split(' - ');
  if (parts.length >= 2) {
    return { title: parts.slice(1).join(' - ').trim(), artist: parts[0].trim() };
  }
  return { title: withoutExt.trim(), artist: 'Unknown Artist' };
};

// Favorites/Playlists persist tracks (incl. local ones) to localStorage as
// plain JSON. A local track's preview_url is a blob: URL, which dies the
// moment the page unloads — so on every load we swap it for a fresh one
// backed by the still-persisted blob in IndexedDB. Returns null if the
// underlying file was removed from the local library since it was saved.
export const rehydrateLocalTrack = async (track) => {
  if (!track.id?.startsWith('local-')) return track;
  const record = await getLocalTrack(track.id);
  if (!record) return null;
  return { ...track, preview_url: URL.createObjectURL(record.blob) };
};

export const rehydrateLocalTracks = async (tracks) => {
  const resolved = await Promise.all(tracks.map(rehydrateLocalTrack));
  return resolved.filter(Boolean);
};
