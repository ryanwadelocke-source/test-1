import { useState, useEffect, useCallback, useRef } from 'react';
import { Music, Radio, RefreshCw, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Track {
  playing: boolean;
  id: string;
  name: string;
  uri: string;
  type: string;
  artists: string[];
  albumName?: string;
  albumArt: string | null;
  durationMs: number;
  progressMs: number;
}

type NowPlayingResult =
  | { playing: false; error?: string; configured?: false }
  | { playing: true; track: Track };

// Poll for new track data every 10 s; progress is interpolated locally
const POLL_INTERVAL_MS = 10_000;

function ProgressBar({ progressMs, durationMs }: { progressMs: number; durationMs: number }) {
  const pct = durationMs > 0 ? Math.min(100, (progressMs / durationMs) * 100) : 0;
  return (
    <div className="w-full h-1.5 rounded-full mt-2" style={{ background: '#7a9060' }}>
      <div
        className="h-1.5 rounded-full"
        style={{ width: `${pct}%`, background: '#1c2810', transition: 'width 0.95s linear' }}
      />
    </div>
  );
}

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function MarqueeText({ text, className }: { text: string; className?: string }) {
  const tooLong = text.length > 22;
  if (!tooLong) return <span className={className}>{text}</span>;
  return (
    <div className="overflow-hidden w-full">
      <div className="ticker-track">
        <span className={className}>{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span className={className}>{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      </div>
    </div>
  );
}

export default function MusicPage() {
  const [result, setResult] = useState<NowPlayingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  // Live progress interpolated every second from the last API snapshot
  const [liveProgressMs, setLiveProgressMs] = useState(0);
  // Ref holds the fetch timestamp and base progress so the tick interval
  // can read current values without needing them as dependencies
  const snapshotRef = useRef<{ fetchedAt: number; progressMs: number; playing: boolean } | null>(null);

  const fetchNowPlaying = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('spotify-now-playing');
      if (error) throw error;
      const r = data as NowPlayingResult;
      setResult(r);
      const now = Date.now();
      if (r.playing) {
        snapshotRef.current = { fetchedAt: now, progressMs: r.track.progressMs, playing: true };
        setLiveProgressMs(r.track.progressMs);
      } else {
        snapshotRef.current = { fetchedAt: now, progressMs: 0, playing: false };
        setLiveProgressMs(0);
      }
    } catch {
      setResult({ playing: false, error: 'FETCH_ERROR' } as NowPlayingResult & { error: string });
    } finally {
      setLoading(false);
      setLastFetched(new Date());
    }
  }, []);

  // Initial fetch + periodic re-fetch for track changes
  useEffect(() => {
    fetchNowPlaying();
    const id = setInterval(fetchNowPlaying, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchNowPlaying]);

  // Tick every second to advance progress locally
  useEffect(() => {
    const id = setInterval(() => {
      const snap = snapshotRef.current;
      if (!snap || !snap.playing) return;
      const elapsed = Date.now() - snap.fetchedAt;
      setLiveProgressMs(snap.progressMs + elapsed);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const track = result && result.playing ? result.track : null;
  const unconfigured = result && !result.playing && (result as { configured?: false }).configured === false;
  const fetchError = result && !result.playing && (result as { error?: string }).error === 'FETCH_ERROR';

  return (
    <div className="page-enter flex flex-col">
      <div className="lcd-title-bar px-3 py-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-2xl tracking-widest text-lcd-text-light">NOW PLAYING</div>
            <div className="font-mono text-xs opacity-70 mt-0.5" style={{ color: '#cdd9a4' }}>
              Live from the cafe floor
            </div>
          </div>
          <button
            onClick={() => { setLoading(true); fetchNowPlaying(); }}
            className="p-1.5 rounded transition-opacity hover:opacity-70"
            style={{ color: '#cdd9a4' }}
            aria-label="Refresh"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Live indicator strip */}
      <div className="lcd-section-header px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{
              background: track?.playing ? '#1c2810' : '#7a9060',
              boxShadow: track?.playing ? '0 0 0 2px #1c281060, 0 0 6px #1c2810' : 'none',
              animation: track?.playing ? 'blink 1.4s ease-in-out infinite' : 'none',
            }}
          />
          <span className="text-sm tracking-widest">
            {loading ? 'CONNECTING...' : track?.playing ? 'ON AIR' : 'OFF AIR'}
          </span>
        </div>
        {lastFetched && (
          <span className="font-mono" style={{ fontSize: '9px', opacity: 0.7 }}>
            {lastFetched.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 px-3 py-2 flex flex-col gap-2">

        {loading && !result && (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Radio size={28} className="text-lcd-border animate-pulse" />
            <span className="font-mono text-xs text-lcd-text-mid tracking-widest">TUNING IN...</span>
          </div>
        )}

        {unconfigured && (
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <Music size={28} className="text-lcd-border" />
            <p className="font-mono text-xs text-lcd-text leading-relaxed">
              SPOTIFY NOT CONFIGURED
            </p>
            <p className="font-mono text-lcd-text-mid leading-relaxed" style={{ fontSize: '10px' }}>
              Add SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REFRESH_TOKEN to your edge function secrets.
            </p>
          </div>
        )}

        {fetchError && (
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <Radio size={28} className="text-lcd-border" />
            <p className="font-mono text-xs text-lcd-text-mid tracking-widest">SIGNAL LOST</p>
            <button
              onClick={() => { setLoading(true); fetchNowPlaying(); }}
              className="font-mono text-xs text-lcd-text underline"
              style={{ fontSize: '10px' }}
            >
              RETRY
            </button>
          </div>
        )}

        {!loading && result && !result.playing && !unconfigured && !fetchError && (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div
              className="w-20 h-20 rounded flex items-center justify-center border-2 border-lcd-border"
              style={{ background: '#b8cc8c' }}
            >
              <Music size={32} className="text-lcd-text opacity-40" />
            </div>
            <p className="font-mono text-xs text-lcd-text-mid tracking-widest text-center">
              NOTHING PLAYING RIGHT NOW
            </p>
            <p className="font-mono text-center text-lcd-text-mid" style={{ fontSize: '10px' }}>
              Check back soon — we're always spinning something.
            </p>
          </div>
        )}

        {track && (
          <>
            {/* Album art */}
            <div className="flex flex-col gap-2">
              <div
                className="w-full rounded overflow-hidden border-2 border-lcd-border relative"
                style={{ background: '#b8cc8c', aspectRatio: '1 / 1' }}
              >
                {track.albumArt ? (
                  <>
                    <img
                      src={track.albumArt}
                      alt={track.albumName ?? track.name}
                      className="w-full h-full object-cover"
                      style={{ filter: 'sepia(20%) saturate(90%)' }}
                    />
                    {/* Scanline overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
                      }}
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music size={48} className="text-lcd-border" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-0.5">
                <div className="overflow-hidden">
                  <MarqueeText
                    text={track.name}
                    className="font-display text-base text-lcd-text tracking-wide leading-tight"
                  />
                </div>
                <div className="overflow-hidden">
                  <MarqueeText
                    text={track.artists.join(', ')}
                    className="font-mono text-xs text-lcd-text-mid"
                  />
                </div>
                {track.albumName && (
                  <div className="overflow-hidden">
                    <MarqueeText
                      text={track.albumName}
                      className="font-mono text-lcd-text-mid"
                      style={{ fontSize: '10px' } as React.CSSProperties}
                    />
                  </div>
                )}

                <ProgressBar progressMs={liveProgressMs} durationMs={track.durationMs} />
                <div className="flex justify-between font-mono" style={{ fontSize: '9px', color: '#3a5028' }}>
                  <span>{formatMs(liveProgressMs)}</span>
                  <span>{formatMs(track.durationMs)}</span>
                </div>
              </div>
            </div>


            {/* Open in Spotify */}
            <a
              href={`https://open.spotify.com/${track.type}/${track.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2 border-2 border-lcd-text rounded font-mono text-xs text-lcd-text tracking-widest transition-all hover:bg-lcd-text hover:text-lcd-bg active:scale-95"
              style={{ fontSize: '11px' }}
            >
              <ExternalLink size={12} />
              LISTEN ON SPOTIFY
            </a>
          </>
        )}
      </div>

      {/* Footer note */}
      <div className="px-3 py-2 border-t border-lcd-border text-center">
        <span className="font-mono text-lcd-text-mid" style={{ fontSize: '9px' }}>
          SYNCS EVERY 10 SECONDS · POWERED BY SPOTIFY
        </span>
      </div>
    </div>
  );
}
