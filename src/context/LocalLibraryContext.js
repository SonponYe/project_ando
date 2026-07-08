import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  getAllLocalTracks, putLocalTrack, deleteLocalTrack, parseFilenameMetadata,
} from '../api/local/db';

export const LocalLibraryContext = createContext();

const genId = () => `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const toPlayableTrack = (record) => ({
  id: record.id,
  name: record.name,
  artists: record.artists,
  album: record.album,
  preview_url: URL.createObjectURL(record.blob),
  downloadUrl: null, // it's already on this device — nothing to download
});

export const LocalLibraryProvider = ({ children }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const records = await getAllLocalTracks();
      setTracks(records.map(toPlayableTrack));
      setLoading(false);
    })();
  }, []);

  const importFiles = useCallback(async (fileList) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('audio/'));
    const added = [];
    for (const file of files) {
      const { title, artist } = parseFilenameMetadata(file.name);
      const record = {
        id: genId(),
        name: title,
        artists: [{ name: artist }],
        album: { name: '', images: [] },
        blob: file,
        addedAt: Date.now(),
      };
      await putLocalTrack(record);
      added.push(toPlayableTrack(record));
    }
    setTracks((prev) => [...prev, ...added]);
    return added;
  }, []);

  const removeTrack = useCallback(async (id) => {
    await deleteLocalTrack(id);
    setTracks((prev) => {
      const target = prev.find((t) => t.id === id);
      if (target?.preview_url) URL.revokeObjectURL(target.preview_url);
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  return (
    <LocalLibraryContext.Provider value={{ tracks, loading, importFiles, removeTrack }}>
      {children}
    </LocalLibraryContext.Provider>
  );
};
