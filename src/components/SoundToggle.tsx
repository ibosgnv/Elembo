"use client";

import { useEffect, useRef, useState } from "react";

const TRACK = "/audio/elembo-soleil.mp3";
const VOLUME = 0.32;

type State = "off" | "loading" | "on";

/**
 * Opt-in background music. Nothing is downloaded or played until the
 * visitor presses the button (browsers block autoplay with sound anyway).
 * Web Audio gives a gapless loop and smooth fades; playback pauses while
 * the tab is hidden and resumes when it comes back.
 */
export function SoundToggle({ className = "" }: { className?: string }) {
  const [state, setState] = useState<State>("off");
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const wantOn = useRef(false);

  async function start() {
    wantOn.current = true;
    setState("loading");
    try {
      const ctx = (ctxRef.current ??= new AudioContext());
      if (!gainRef.current) {
        gainRef.current = ctx.createGain();
        gainRef.current.gain.value = 0;
        gainRef.current.connect(ctx.destination);
      }
      if (!bufferRef.current) {
        const res = await fetch(TRACK);
        bufferRef.current = await ctx.decodeAudioData(await res.arrayBuffer());
      }
      if (!wantOn.current) return; // turned off while loading
      await ctx.resume();
      if (!sourceRef.current) {
        const src = ctx.createBufferSource();
        src.buffer = bufferRef.current;
        src.loop = true;
        src.connect(gainRef.current);
        src.start();
        sourceRef.current = src;
      }
      const g = gainRef.current.gain;
      g.cancelScheduledValues(ctx.currentTime);
      g.setValueAtTime(g.value, ctx.currentTime);
      g.linearRampToValueAtTime(VOLUME, ctx.currentTime + 1.4);
      setState("on");
    } catch {
      wantOn.current = false;
      setState("off");
    }
  }

  function stop() {
    wantOn.current = false;
    setState("off");
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain) return;
    const g = gain.gain;
    g.cancelScheduledValues(ctx.currentTime);
    g.setValueAtTime(g.value, ctx.currentTime);
    g.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    window.setTimeout(() => {
      if (!wantOn.current) ctx.suspend();
    }, 650);
  }

  // Pause in background tabs, resume on return
  useEffect(() => {
    const onVisibility = () => {
      const ctx = ctxRef.current;
      if (!ctx || !wantOn.current) return;
      if (document.hidden) ctx.suspend();
      else ctx.resume();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      ctxRef.current?.close();
    };
  }, []);

  const on = state === "on";
  return (
    <button
      type="button"
      onClick={() => (wantOn.current ? stop() : start())}
      aria-pressed={on}
      aria-busy={state === "loading"}
      aria-label={on ? "Couper la musique" : "Écouter la musique"}
      title={on ? "Couper la musique" : "Écouter la musique"}
      data-state={state}
      className={`group/sound inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-current bg-paper/90 text-ink transition hover:bg-ink hover:text-cream ${className}`}
    >
      <span aria-hidden className="flex h-[18px] items-end gap-[3px]">
        {[0.55, 1, 0.7, 0.85].map((h, i) => (
          <span
            key={i}
            className="sound-bar block w-[3px] rounded-full bg-current"
            style={{ height: `${h * 100}%`, animationDelay: `${i * -0.22}s` }}
          />
        ))}
      </span>
    </button>
  );
}
