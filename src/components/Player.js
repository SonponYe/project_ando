import React, { useContext, useRef, useState, useEffect, useMemo } from 'react';
import ReactHowler from 'react-howler';
import {
  LuPlay, LuPause,
  LuHeart,
  LuChevronDown,
  LuSkipBack, LuSkipForward,
  LuRepeat, LuRepeat1, LuShuffle,
  LuListMusic, LuX,
} from 'react-icons/lu';
import { PlaybackContext } from '../context/PlaybackContext';
import { FavoritesContext } from '../context/FavoritesContext';
import TrackRow from './TrackRow';
import fallbackMark from '../images/ando-mark.png';

const fmt = (s) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const RING = 264;
const R    = 108;
const CIRC = 2 * Math.PI * R;
const WAVEFORM_BARS = 56;

// Aggregate Jamendo's raw peak array (often 600+ points) down to a fixed
// bar count, normalized to a 0–1 height fraction per bar.
const downsampleWaveform = (peaks, barCount = WAVEFORM_BARS) => {
  if (!peaks?.length) return [];
  const max = Math.max(...peaks) || 1;
  const chunkSize = peaks.length / barCount;
  const bars = [];
  for (let i = 0; i < barCount; i++) {
    const start = Math.floor(i * chunkSize);
    const end = Math.max(Math.floor((i + 1) * chunkSize), start + 1);
    const chunk = peaks.slice(start, end);
    const avg = chunk.reduce((a, b) => a + b, 0) / chunk.length;
    bars.push(avg / max);
  }
  return bars;
};

const modeConfig = {
  order:       { icon: <LuRepeat size={13} />,  label: 'In Order' },
  shuffle:     { icon: <LuShuffle size={13} />, label: 'Shuffle' },
  'repeat-one': { icon: <LuRepeat1 size={13} />, label: 'Repeat' },
};

const Player = () => {
  const {
    currentTrack, isPlaying, playTrack, pauseTrack,
    queue, currentIndex, nextTrack, prevTrack, canSkip,
    jumpToIndex, removeFromQueue,
    playbackMode, cyclePlaybackMode, advanceAfterEnd,
  } = useContext(PlaybackContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);

  const [expanded,  setExpanded]  = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [seek,      setSeek]      = useState(0);
  const [dur,       setDur]       = useState(0);
  const howlerRef = useRef(null);

  // keyboard navigation while the now-playing screen is open
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') nextTrack();
      else if (e.key === 'ArrowLeft') prevTrack();
      else if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded, nextTrack, prevTrack]);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      if (howlerRef.current) {
        const pos = howlerRef.current.seek();
        if (typeof pos === 'number') setSeek(pos);
      }
    }, 250);
    return () => clearInterval(id);
  }, [isPlaying]);

  useEffect(() => { setSeek(0); setDur(0); }, [currentTrack?.id]);

  const handleLoad = () => {
    if (howlerRef.current) setDur(howlerRef.current.duration() || 0);
  };
  const handleEnd = () => {
    const result = advanceAfterEnd();
    if (result === 'repeat') {
      setSeek(0);
      howlerRef.current?.seek(0);
      howlerRef.current?.play();
    } else if (!result) {
      // no queue to advance through (single track) — just stop
      pauseTrack();
      setSeek(0);
    }
  };

  const handleRingClick = (e) => {
    if (!dur || !howlerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const ang  = Math.atan2(e.clientY - cy, e.clientX - cx);
    const adj  = (ang + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI);
    const pos  = (adj / (2 * Math.PI)) * dur;
    howlerRef.current.seek(pos);
    setSeek(pos);
  };

  const handleWaveformClick = (e) => {
    if (!dur || !howlerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const pos = fraction * dur;
    howlerRef.current.seek(pos);
    setSeek(pos);
  };

  const waveformBars = useMemo(
    () => downsampleWaveform(currentTrack?.waveform),
    // waveform is fixed per track, keyed by id
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTrack?.id]
  );

  if (!currentTrack) return null;

  const favorited  = isFavorite(currentTrack.id);
  const progress   = dur > 0 ? Math.min(seek / dur, 1) : 0;
  const dashOffset = CIRC * (1 - progress);
  const albumImg   = currentTrack.album?.images?.[0]?.url;
  const artist     = currentTrack.artists?.map(a => a.name).join(', ');
  const dotAng     = -Math.PI / 2 + progress * 2 * Math.PI;
  const dotX       = RING / 2 + R * Math.cos(dotAng);
  const dotY       = RING / 2 + R * Math.sin(dotAng);

  return (
    <>
      {currentTrack.preview_url && (
        <ReactHowler
          ref={howlerRef}
          src={currentTrack.preview_url}
          playing={isPlaying}
          onLoad={handleLoad}
          onEnd={handleEnd}
          html5={true}
          volume={1.0}
        />
      )}

      {/* ── expanded now-playing ── */}
      {expanded && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'linear-gradient(160deg, #181818 0%, #0a0a0a 55%, #060606 100%)',
          display: 'flex', flexDirection: 'column', overflowY: 'auto',
        }}>
          <div style={{
            maxWidth: 400, margin: '0 auto', width: '100%',
            padding: '1.5rem 1.5rem 3rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>

            {/* header */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', width: '100%', marginBottom: '2rem',
            }}>
              <button
                onClick={() => setExpanded(false)}
                aria-label="Collapse"
                style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', padding: '6px 6px 6px 0' }}
              >
                <LuChevronDown size={20} />
              </button>
              <span style={{
                fontSize: '0.68rem', fontWeight: 600,
                letterSpacing: '1.4px', textTransform: 'uppercase', color: '#383838',
              }}>
                Now Playing
              </span>
              {canSkip ? (
                <button
                  onClick={() => setShowQueue(true)}
                  aria-label="View queue"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 5,
                    color: '#333', fontSize: '0.7rem', fontVariantNumeric: 'tabular-nums',
                    padding: '4px 2px',
                  }}
                >
                  {currentIndex + 1}/{queue.length}
                  <LuListMusic size={13} />
                </button>
              ) : (
                <span style={{ width: 32 }} />
              )}
            </div>

            {/* track name + artist */}
            <h2 style={{
              fontSize: 'clamp(1.2rem, 5vw, 1.55rem)',
              fontWeight: 800, color: '#efefef',
              letterSpacing: '-0.5px', textAlign: 'center',
              marginBottom: '0.3rem', lineHeight: 1.2,
            }}>
              {currentTrack.name}
            </h2>
            <p style={{ color: '#4a4a4a', fontSize: '0.88rem', textAlign: 'center', marginBottom: '2.25rem' }}>
              {artist}
            </p>

            {/* ring + art */}
            <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
              {albumImg && (
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${albumImg})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  filter: 'blur(40px) saturate(1.4) brightness(0.7)',
                  opacity: 0.35,
                  transform: 'scale(0.85)',
                  borderRadius: '50%',
                  zIndex: 0,
                }} />
              )}
            <svg
              width={RING} height={RING}
              viewBox={`0 0 ${RING} ${RING}`}
              onClick={handleRingClick}
              style={{ cursor: dur ? 'pointer' : 'default', maxWidth: '100%', position: 'relative', zIndex: 1 }}
              aria-label="Seek"
            >
              <defs>
                <clipPath id="np-art">
                  <circle cx={RING/2} cy={RING/2} r={R - 16} />
                </clipPath>
                <linearGradient id="progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e14b3f" />
                  <stop offset="100%" stopColor="#d21313" />
                </linearGradient>
              </defs>

              {/* track bg */}
              <circle cx={RING/2} cy={RING/2} r={R}
                fill="none" stroke="#1c1c1c" strokeWidth={2.5} />

              {/* progress */}
              <circle cx={RING/2} cy={RING/2} r={R}
                fill="none" stroke="url(#progress-grad)" strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${RING/2} ${RING/2})`}
              />

              {/* scrubber dot */}
              {dur > 0 && (
                <circle cx={dotX} cy={dotY} r={5.5} fill="#e14b3f" />
              )}

              {albumImg ? (
                <image
                  href={albumImg}
                  x={RING/2-(R-16)} y={RING/2-(R-16)}
                  width={(R-16)*2} height={(R-16)*2}
                  clipPath="url(#np-art)"
                  preserveAspectRatio="xMidYMid slice"
                />
              ) : (
                <>
                  <circle cx={RING/2} cy={RING/2} r={R-16} fill="#141414" />
                  <image
                    href={fallbackMark}
                    x={RING/2 - (R-16) * 0.32} y={RING/2 - (R-16) * 0.32}
                    width={(R-16) * 0.64} height={(R-16) * 0.64}
                    opacity={0.55}
                    preserveAspectRatio="xMidYMid meet"
                  />
                </>
              )}
            </svg>
            </div>

            {/* waveform seek (Jamendo tracks only — real peak data, not decorative) */}
            {waveformBars.length > 0 && (
              <div
                onClick={handleWaveformClick}
                role="slider"
                aria-label="Seek (waveform)"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                style={{
                  display: 'flex', alignItems: 'flex-end', gap: 2,
                  width: '100%', height: 44, marginBottom: '1.25rem', cursor: 'pointer',
                }}
              >
                {waveformBars.map((h, i) => {
                  const played = i / waveformBars.length <= progress;
                  return (
                    <div key={i} style={{
                      flex: 1,
                      height: `${12 + h * 88}%`,
                      borderRadius: 2,
                      background: played ? 'linear-gradient(180deg, #e14b3f, #d21313)' : '#232323',
                      transition: 'background 0.2s ease',
                    }} />
                  );
                })}
              </div>
            )}

            {/* timestamps */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              width: '100%', padding: '0 0.25rem', marginBottom: '1.25rem',
            }}>
              <span style={{ fontSize: '0.74rem', color: '#3a3a3a', fontVariantNumeric: 'tabular-nums' }}>{fmt(seek)}</span>
              <span style={{ fontSize: '0.74rem', color: '#3a3a3a', fontVariantNumeric: 'tabular-nums' }}>{fmt(dur)}</span>
            </div>

            {/* playback mode */}
            <button
              onClick={cyclePlaybackMode}
              aria-label={`Playback mode: ${modeConfig[playbackMode].label}. Click to change.`}
              className={playbackMode !== 'order' ? 'chip chip--active' : 'chip'}
              style={{ marginBottom: '1.25rem', gap: 6 }}
            >
              {modeConfig[playbackMode].icon}
              {modeConfig[playbackMode].label}
            </button>

            {/* controls */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '2.25rem', marginBottom: '2.5rem',
            }}>
              <button
                onClick={prevTrack}
                disabled={!canSkip}
                aria-label="Previous track"
                style={canSkip ? skipCtrl : ghostCtrl}
                onMouseEnter={e => { if (canSkip) e.currentTarget.style.color = '#efefef'; }}
                onMouseLeave={e => { if (canSkip) e.currentTarget.style.color = '#888'; }}
              >
                <LuSkipBack size={20} />
              </button>

              <button
                onClick={() => isPlaying ? pauseTrack() : playTrack(currentTrack)}
                disabled={!currentTrack.preview_url}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                style={playCtrl}
                onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#ececec'; e.currentTarget.style.color = '#111'; }}
              >
                {isPlaying
                  ? <LuPause size={22} />
                  : <LuPlay  size={22} style={{ marginLeft: 2 }} />
                }
              </button>

              <button
                onClick={nextTrack}
                disabled={!canSkip}
                aria-label="Next track"
                style={canSkip ? skipCtrl : ghostCtrl}
                onMouseEnter={e => { if (canSkip) e.currentTarget.style.color = '#efefef'; }}
                onMouseLeave={e => { if (canSkip) e.currentTarget.style.color = '#888'; }}
              >
                <LuSkipForward size={20} />
              </button>
            </div>

            {/* favorite */}
            <button
              onClick={() => toggleFavorite(currentTrack)}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={favorited}
              style={{
                background: 'none', border: 'none',
                color: favorited ? '#c0c0c0' : '#2a2a2a',
                cursor: 'pointer', padding: 10,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={e => { if (!favorited) e.currentTarget.style.color = '#505050'; }}
              onMouseLeave={e => { if (!favorited) e.currentTarget.style.color = '#2a2a2a'; }}
            >
              <LuHeart
                size={22}
                style={{ fill: favorited ? 'currentColor' : 'none', transition: 'fill 0.15s ease' }}
              />
            </button>
          </div>
        </div>
      )}

      {/* ── up next queue ── */}
      {showQueue && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10002,
          background: 'linear-gradient(160deg, #181818 0%, #0a0a0a 55%, #060606 100%)',
          overflowY: 'auto',
        }}>
          <div style={{ maxWidth: 460, margin: '0 auto', width: '100%', padding: '1.5rem 1.25rem 3rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem',
            }}>
              <span style={{
                fontSize: '0.68rem', fontWeight: 600,
                letterSpacing: '1.4px', textTransform: 'uppercase', color: '#383838',
              }}>
                Up Next
              </span>
              <button
                onClick={() => setShowQueue(false)}
                aria-label="Close queue"
                style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', padding: 4 }}
              >
                <LuX size={18} />
              </button>
            </div>

            {queue.map((_, offset) => {
              const realIdx = (currentIndex + offset) % queue.length;
              const track   = queue[realIdx];
              const isNowPlaying = realIdx === currentIndex;

              return (
                <React.Fragment key={`${track.id}-${realIdx}`}>
                  {offset === 0 && (
                    <p className="section-label" style={{ marginBottom: '0.5rem' }}>Now Playing</p>
                  )}
                  {offset === 1 && (
                    <p className="section-label" style={{ margin: '1rem 0 0.5rem' }}>Next Up</p>
                  )}
                  <TrackRow
                    track={track}
                    isCurrent={isNowPlaying}
                    isCurrentlyPlaying={isNowPlaying && isPlaying}
                    onPlay={() => { jumpToIndex(realIdx); setShowQueue(false); }}
                  >
                    {!isNowPlaying && (
                      <button
                        className="icon-btn"
                        onClick={(e) => { e.stopPropagation(); removeFromQueue(realIdx); }}
                        aria-label={`Remove ${track.name} from queue`}
                      >
                        <LuX size={13} />
                      </button>
                    )}
                  </TrackRow>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* ── mini bar ── */}
      {!expanded && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Open now playing"
          onClick={() => setExpanded(true)}
          onKeyDown={e => e.key === 'Enter' && setExpanded(true)}
          style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, height: 68,
            background: 'rgba(9,9,9,0.97)',
            borderTop: '1px solid #191919',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center',
            padding: '0 1.25rem', gap: '1rem',
            zIndex: 9999, cursor: 'pointer',
            overflow: 'hidden',
          }}
        >
          {/* live progress strip */}
          <div style={{
            position: 'absolute', top: 0, left: 0, height: 2,
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, #6b0f0f, #e14b3f)',
            boxShadow: '0 0 8px rgba(226, 35, 26, 0.5)',
            transition: isPlaying ? 'width 0.25s linear' : 'none',
          }} />

          {albumImg ? (
            <img src={albumImg} alt={currentTrack.name}
              style={{
                width: 42, height: 42, borderRadius: 8, objectFit: 'cover', flexShrink: 0,
                animation: isPlaying ? 'mini-art-pulse 2.4s ease-in-out infinite' : 'none',
              }} />
          ) : (
            <div style={{
              width: 42, height: 42, borderRadius: 8, background: '#1a1a1a', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <img src={fallbackMark} alt="" style={{ width: 20, height: 20, opacity: 0.5, objectFit: 'contain' }} />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '0.875rem', fontWeight: 600, color: '#efefef',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {currentTrack.name}
            </div>
            <div style={{
              fontSize: '0.76rem', color: '#555',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2,
            }}>
              {artist}
            </div>
          </div>

          {currentTrack.preview_url ? (
            <button
              onClick={e => { e.stopPropagation(); isPlaying ? pauseTrack() : playTrack(currentTrack); }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              style={{
                width: 38, height: 38, borderRadius: '50%',
                background: '#ececec', border: 'none', color: '#111',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0, padding: 0,
              }}
            >
              {isPlaying
                ? <LuPause size={14} />
                : <LuPlay  size={14} style={{ marginLeft: 1 }} />
              }
            </button>
          ) : (
            <span style={{ fontSize: '0.72rem', color: '#303030', flexShrink: 0 }}>No preview</span>
          )}
        </div>
      )}
    </>
  );
};

const playCtrl = {
  width: 64, height: 64, borderRadius: '50%',
  background: '#ececec', border: 'none', color: '#111',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', padding: 0, flexShrink: 0,
  boxShadow: '0 8px 28px rgba(210, 19, 19, 0.28), 0 8px 20px rgba(0,0,0,0.5)',
  transition: 'background 0.15s ease, color 0.15s ease',
};

const ghostCtrl = {
  background: 'none', border: 'none',
  color: '#282828', cursor: 'not-allowed',
  padding: 8, opacity: 0.5,
};

const skipCtrl = {
  background: 'none', border: 'none',
  color: '#888', cursor: 'pointer',
  padding: 8, transition: 'color 0.15s ease',
};

export default Player;
