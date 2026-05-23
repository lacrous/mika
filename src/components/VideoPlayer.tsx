import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize,
  Minimize, Settings, ChevronLeft, ChevronRight, List, Clock,
  Subtitles, X, RotateCcw, FastForward, Rewind, PictureInPicture,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useLanguage } from "@/context/LanguageContext";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";

interface Episode {
  id: number;
  number: number;
  title: string;
  videoUrl?: string | null;
  thumbnail?: string | null;
  duration?: number | null;
  isFiller: number;
}

interface VideoPlayerProps {
  src: string;
  animeTitle: string;
  animeId: number;
  animeImage?: string;
  currentEpisode: Episode;
  episodes: Episode[];
  onEpisodeChange: (ep: Episode) => void;
  isRTL?: boolean;
}

export function VideoPlayer({
  src, animeTitle, animeId, animeImage, currentEpisode, episodes, onEpisodeChange, isRTL = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState("Auto");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const controlsTimeout = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();
  const { isRTL: contextRTL } = useLanguage();
  const rtl = isRTL || contextRTL;

  // Hide controls after inactivity
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      setShowControls((prev) => {
        // Use functional update to read latest state
        return false;
      });
    }, 3000);
  }, []);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0);
      // Buffered
      if (video.buffered.length > 0) {
        setBuffered((video.buffered.end(video.buffered.length - 1) / video.duration) * 100);
      }
    };
    const handleLoaded = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => { setIsLoading(false); setIsPlaying(true); };
    const handleEnded = () => { setIsPlaying(false); playNext(); };
    const handleError = () => { setError(rtl ? "فشل تحميل الفيديو" : "Failed to load video"); setIsLoading(false); };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoaded);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoaded);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
    };
  }, [src, rtl]);

  // Reset state when source changes
  useEffect(() => {
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);
    setError("");
    setIsPlaying(false);
  }, [src]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key.toLowerCase()) {
        case " ": case "k": e.preventDefault(); togglePlay(); break;
        case "arrowright": seek(10); break;
        case "arrowleft": seek(-10); break;
        case "arrowup": e.preventDefault(); setVolume((v) => Math.min(1, v + 0.1)); break;
        case "arrowdown": e.preventDefault(); setVolume((v) => Math.max(0, v - 0.1)); break;
        case "f": toggleFullscreen(); break;
        case "m": toggleMute(); break;
        case "n": playNext(); break;
        case "p": playPrev(); break;
        case "j": seek(-10); break;
        case "l": seek(10); break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, volume]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { video.play(); setIsPlaying(true); } else { video.pause(); setIsPlaying(false); }
    showControlsTemporarily();
  };

  const seek = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
    showControlsTemporarily();
  };

  const seekTo = (percentage: number) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    video.currentTime = (percentage / 100) * video.duration;
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const changeVolume = (v: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = v;
    setVolume(v);
    setIsMuted(v === 0);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Picture-in-Picture
  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch { /* PiP not supported */ }
  };

  // Timestamp sync
  const { isAuthenticated } = useAuth();
  const saveTimestamp = trpc.timestamps.save.useMutation();
  const [lastSaved, setLastSaved] = useState(0);

  // Load saved timestamp via proper tRPC query at top level
  const savedTsQuery = trpc.timestamps.get.useQuery(
    { episodeId: currentEpisode?.id || 0 },
    { enabled: isAuthenticated && !!currentEpisode?.id, retry: false }
  );

  // Load saved timestamp on episode change
  useEffect(() => {
    if (!isAuthenticated || !currentEpisode?.id) return;
    const saved = savedTsQuery.data || 0;
    if (saved > 0 && videoRef.current) {
      videoRef.current.currentTime = saved;
    }
  }, [currentEpisode?.id, isAuthenticated, savedTsQuery.data]);

  // Save timestamp every 10 seconds while playing
  useEffect(() => {
    if (!isAuthenticated || !currentEpisode?.id) return;
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.paused) return;
      const ts = Math.floor(video.currentTime);
      if (ts > 0 && ts !== lastSaved && ts % 10 === 0) {
        setLastSaved(ts);
        saveTimestamp.mutate({ animeId, episodeId: currentEpisode.id, timestamp: ts });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated, currentEpisode?.id, animeId, lastSaved]);

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const playNext = () => {
    const idx = episodes.findIndex((e) => e.id === currentEpisode.id);
    if (idx >= 0 && idx < episodes.length - 1) onEpisodeChange(episodes[idx + 1]);
  };

  const playPrev = () => {
    const idx = episodes.findIndex((e) => e.id === currentEpisode.id);
    if (idx > 0) onEpisodeChange(episodes[idx - 1]);
  };

  const formatTime = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}:${String(mins % 60).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const currentIdx = episodes.findIndex((e) => e.id === currentEpisode.id);
  const hasNext = currentIdx >= 0 && currentIdx < episodes.length - 1;
  const hasPrev = currentIdx > 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-xl overflow-hidden group select-none"
      style={{ aspectRatio: "16/9" }}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={showControlsTemporarily}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        preload="metadata"
        playsInline
      />

      {/* Loading Spinner */}
      <AnimatePresence>
        {isLoading && (
          <motion.div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
              <span className="text-[12px] text-[#888]">{rtl ? "جاري التحميل..." : "Loading..."}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="text-center">
              <RotateCcw className="w-10 h-10 text-[#ef4444] mx-auto mb-3" />
              <p className="text-[14px] text-white mb-2">{error}</p>
              <button onClick={() => { setError(""); videoRef.current?.load(); }} className="px-4 py-2 rounded-lg text-[12px] text-[#0a0a0a] font-medium" style={{ background: "linear-gradient(135deg, #D4AF37, #F0D878)" }}>
                {rtl ? "إعادة المحاولة" : "Retry"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Big Play Button (center) */}
      {!isPlaying && !isLoading && !error && (
        <motion.button
          className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
          onClick={togglePlay}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(212,175,55,0.9)", boxShadow: "0 0 30px rgba(212,175,55,0.4)" }}>
            <Play className="w-7 h-7 text-[#0a0a0a] fill-[#0a0a0a] ml-1" />
          </div>
        </motion.button>
      )}

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute inset-0 flex flex-col justify-between z-10 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Top Bar */}
            <div className={`flex items-center justify-between px-4 pt-3 pointer-events-auto ${rtl ? "flex-row-reverse" : ""}`}>
              <div className="flex items-center gap-3">
                <button onClick={() => navigate(`/anime/${animeId}`)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all">
                  <ChevronLeft className={`w-5 h-5 ${rtl ? "rotate-180" : ""}`} />
                </button>
                <div>
                  <p className="text-[13px] text-white font-medium truncate max-w-[300px]">{animeTitle}</p>
                  <p className="text-[11px] text-white/50">{rtl ? "حلقة" : "Ep"}. {currentEpisode.number}{currentEpisode.isFiller ? ` · ${rtl ? "فلر" : "Filler"}` : ""}</p>
                </div>
              </div>
              <button onClick={() => setShowEpisodes(true)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all">
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Center Skip Buttons */}
            <div className={`flex items-center justify-center gap-8 pointer-events-auto ${rtl ? "flex-row-reverse" : ""}`}>
              <button onClick={() => seek(-10)} className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                <Rewind className="w-5 h-5" />
              </button>
              <button onClick={playPrev} disabled={!hasPrev} className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30">
                <SkipBack className="w-5 h-5" />
              </button>
              <button onClick={togglePlay} className="w-14 h-14 rounded-full flex items-center justify-center transition-all" style={{ background: "rgba(212,175,55,0.9)", boxShadow: "0 0 20px rgba(212,175,55,0.3)" }}>
                {isPlaying ? <Pause className="w-6 h-6 text-[#0a0a0a] fill-[#0a0a0a]" /> : <Play className="w-6 h-6 text-[#0a0a0a] fill-[#0a0a0a] ml-1" />}
              </button>
              <button onClick={playNext} disabled={!hasNext} className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30">
                <SkipForward className="w-5 h-5" />
              </button>
              <button onClick={() => seek(10)} className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                <FastForward className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="px-4 pb-3 pointer-events-auto">
              {/* Progress Bar */}
              <div className="group/progress relative h-1.5 bg-white/20 rounded-full cursor-pointer mb-3" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = ((e.clientX - rect.left) / rect.width) * 100;
                seekTo(rtl ? 100 - pct : pct);
              }}>
                <div className="absolute inset-y-0 left-0 bg-white/30 rounded-full" style={{ width: `${buffered}%` }} />
                <div className="absolute inset-y-0 left-0 rounded-full transition-all" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #D4AF37, #F0D878)" }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#D4AF37] opacity-0 group-hover/progress:opacity-100 transition-opacity shadow" style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }} />
              </div>

              <div className={`flex items-center justify-between ${rtl ? "flex-row-reverse" : ""}`}>
                <div className={`flex items-center gap-2 ${rtl ? "flex-row-reverse" : ""}`}>
                  <span className="text-[11px] text-white/70 font-mono">{formatTime(currentTime)}</span>
                  <span className="text-[11px] text-white/30">/</span>
                  <span className="text-[11px] text-white/50 font-mono">{formatTime(duration)}</span>
                </div>

                <div className={`flex items-center gap-1 ${rtl ? "flex-row-reverse" : ""}`}>
                  {/* Volume */}
                  <div className="flex items-center gap-1 group/volume">
                    <button onClick={toggleMute} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <div className="w-0 overflow-hidden group-hover/volume:w-16 transition-all">
                      <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume}
                        onChange={(e) => changeVolume(Number(e.target.value))}
                        className="w-14 h-1 accent-[#D4AF37] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="relative">
                    <button onClick={() => setShowSettings(!showSettings)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                      <Settings className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {showSettings && (
                        <motion.div className="absolute bottom-full mb-2 right-0 w-44 rounded-xl overflow-hidden z-30" style={{ background: "rgba(15,15,15,0.95)", border: "1px solid rgba(255,255,255,0.08)" }}
                          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}>
                          <div className="p-2">
                            <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold px-2 py-1">{rtl ? "السرعة" : "Speed"}</p>
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                              <button key={rate} onClick={() => changePlaybackRate(rate)}
                                className={`w-full text-left px-2 py-1.5 rounded-lg text-[12px] transition-colors ${playbackRate === rate ? "text-[#D4AF37] bg-[rgba(212,175,55,0.1)]" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
                                {rate}x
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* PiP */}
                  <button onClick={togglePiP} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                    <PictureInPicture className="w-4 h-4" />
                  </button>
                  {/* Fullscreen */}
                  <button onClick={toggleFullscreen} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Episode List Sidebar */}
      <AnimatePresence>
        {showEpisodes && (
          <>
            <motion.div className="absolute inset-0 bg-black/50 z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEpisodes(false)} />
            <motion.div className="absolute top-0 bottom-0 z-30 w-80 max-w-[80vw] overflow-hidden flex flex-col" style={{ background: "rgba(10,10,10,0.95)", borderLeft: rtl ? "none" : "1px solid rgba(255,255,255,0.08)", borderRight: rtl ? "1px solid rgba(255,255,255,0.08)" : "none", [rtl ? "left" : "right"]: 0 }}
              initial={{ x: rtl ? "-100%" : "100%" }} animate={{ x: 0 }} exit={{ x: rtl ? "-100%" : "100%" }} transition={{ type: "spring", damping: 25 }}>
              <div className="flex items-center justify-between px-4 h-12 border-b border-white/5">
                <h3 className="text-[14px] text-white font-semibold flex items-center gap-2"><List className="w-4 h-4 text-[#D4AF37]" />{rtl ? "الحلقات" : "Episodes"} ({episodes.length})</h3>
                <button onClick={() => setShowEpisodes(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {episodes.map((ep) => {
                  const isActive = ep.id === currentEpisode.id;
                  return (
                    <button key={ep.id} onClick={() => { onEpisodeChange(ep); setShowEpisodes(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${isActive ? "bg-[rgba(212,175,55,0.08)]" : "hover:bg-white/5"}`}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-[13px] font-bold flex-shrink-0 ${isActive ? "bg-[rgba(212,175,55,0.15)] text-[#D4AF37]" : "bg-white/5 text-white/50"}`}>
                        {ep.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[12px] font-medium truncate ${isActive ? "text-[#D4AF37]" : "text-white/80"}`}>{ep.title || `${rtl ? "حلقة" : "Episode"} ${ep.number}`}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1 text-[10px] text-white/40"><Clock className="w-2.5 h-2.5" />{ep.duration || 24}m</span>
                          {ep.isFiller === 1 && <span className="text-[9px] px-1 py-0.5 rounded bg-[rgba(245,158,11,0.1)] text-[#f59e0b]">FILLER</span>}
                        </div>
                      </div>
                      {isActive && <div className="w-2 h-2 rounded-full bg-[#D4AF37] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
