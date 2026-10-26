"""
Original instrumental for the Elembo site, composed and rendered in code.

Style: bright Congolese rumba / soukous feel — parallel-third guitar lines
(sebene), offbeat rhythm guitar, walking rumba bass, congas and shaker.
Key of E major, 116 BPM, I–IV–V–IV, 32 bars, rendered so the end flows
back into the start for a seamless loop.

Usage: python3 scripts/compose-music.py out.wav   (needs numpy + scipy)
"""
import sys
import numpy as np
from scipy.signal import fftconvolve, butter, lfilter

SR = 44100
BPM = 116
BEAT = 60 / BPM
STEP = BEAT / 4            # 16th note
BARS = 32
BAR_STEPS = 16
TOTAL = int(BARS * BAR_STEPS * STEP * SR)
rng = np.random.default_rng(7)

L = np.zeros(TOTAL)
R = np.zeros(TOTAL)


def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def place(sig, t, pan=0.0, gain=1.0):
    """Add a mono signal at time t (seconds), wrapping past the end for a seamless loop."""
    start = int(t * SR) % TOTAL
    sig = sig * gain
    gl = np.cos((pan + 1) * np.pi / 4)
    gr = np.sin((pan + 1) * np.pi / 4)
    n = len(sig)
    end = start + n
    if end <= TOTAL:
        L[start:end] += sig * gl
        R[start:end] += sig * gr
    else:
        k = TOTAL - start
        L[start:] += sig[:k] * gl
        R[start:] += sig[:k] * gr
        L[: n - k] += sig[k:] * gl
        R[: n - k] += sig[k:] * gr


_ks_cache = {}


def pluck(m, dur, bright=0.5, decay=0.996):
    """Karplus-Strong plucked string, vectorised per period, cached."""
    key = (m, round(dur, 3), bright, decay)
    if key in _ks_cache:
        return _ks_cache[key]
    f = midi_hz(m)
    N = max(2, int(round(SR / f)))
    n = int(dur * SR)
    burst = rng.uniform(-1, 1, N)
    # soften the excitation for a rounder, nylon/clean-electric tone
    b, a = butter(1, min(0.99, 1500 + bright * 6000) / (SR / 2))
    burst = lfilter(b, a, burst)
    out = np.zeros(n + N)
    out[:N] = burst
    pos = N
    prev = burst
    while pos < n:
        nxt = decay * 0.5 * (prev + np.roll(prev, 1))
        k = min(N, n - pos)
        out[pos: pos + k] = nxt[:k]
        prev = nxt
        pos += N
    out = out[:n]
    env = np.minimum(1, np.linspace(0, 1, n) * 400)  # tiny attack
    tail = np.ones(n)
    fade = min(n, int(0.03 * SR))
    tail[-fade:] = np.linspace(1, 0, fade)
    out = out * env * tail
    out /= max(1e-9, np.abs(out).max())
    _ks_cache[key] = out
    return out


def bass_note(m, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = midi_hz(m)
    sig = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)
    env = np.exp(-t * 3.2) * np.minimum(1, t * 300)
    fade = min(n, int(0.02 * SR))
    env[-fade:] *= np.linspace(1, 0, fade)
    return sig * env


def conga(freq, slap=False):
    n = int(0.28 * SR)
    t = np.arange(n) / SR
    pitch = freq * (1 + 0.5 * np.exp(-t * 60))
    body = np.sin(2 * np.pi * np.cumsum(pitch) / SR) * np.exp(-t * (18 if not slap else 30))
    noise = rng.uniform(-1, 1, n) * np.exp(-t * (90 if not slap else 45)) * (0.25 if not slap else 0.6)
    return body + noise


def shaker(accent):
    n = int(0.06 * SR)
    t = np.arange(n) / SR
    noise = rng.uniform(-1, 1, n)
    b, a = butter(2, [5000 / (SR / 2), 12000 / (SR / 2)], btype="band")
    noise = lfilter(b, a, noise)
    env = np.minimum(1, t * 900) * np.exp(-t * 70)
    return noise * env * (1.0 if accent else 0.55)


def rim():
    n = int(0.08 * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 80) + rng.uniform(-1, 1, n) * np.exp(-t * 120) * 0.4
    return s


# --- Harmony ---------------------------------------------------------------
E_MAJOR = [0, 2, 4, 5, 7, 9, 11]
ROOT = 64  # E4


def degree_to_midi(d, base=ROOT):
    octave, idx = divmod(d, 7)
    return base + 12 * octave + E_MAJOR[idx]


# chord root degrees: I (E) = 0, IV (A) = 3, V (B) = 4
PROG = [0, 3, 4, 3]

def chord_degrees(root):
    return [root, root + 2, root + 4]


# --- Parts -----------------------------------------------------------------
def rhythm_guitar(bar, root):
    # offbeat "chop" on the and of each beat, chord in the 4th octave
    for beat in range(4):
        t = (bar * BAR_STEPS + beat * 4 + 2) * STEP
        for i, d in enumerate(chord_degrees(root)):
            m = degree_to_midi(d, 52)
            place(pluck(m, STEP * 1.6, bright=0.3, decay=0.985), t + i * 0.004, pan=-0.45, gain=0.2)


LEAD_PATTERNS = [
    # (step, scale degree offset from chord root); played in parallel thirds
    [(0, 4), (2, 2), (3, 4), (4, 7), (6, 4), (8, 5), (10, 4), (11, 2), (12, 4), (14, 2)],
    [(0, 7), (1, 6), (2, 4), (4, 2), (6, 4), (7, 2), (8, 0), (10, 2), (12, 4), (14, 7)],
    [(0, 2), (2, 4), (4, 7), (5, 9), (6, 7), (8, 4), (10, 5), (12, 4), (13, 2), (14, 0)],
    [(0, 4), (1, 4), (2, 7), (4, 4), (6, 2), (8, 4), (9, 4), (10, 7), (12, 9), (14, 7)],
]


def lead_guitar(bar, root, variant, octave_shift=0):
    for step, off in LEAD_PATTERNS[variant % len(LEAD_PATTERNS)]:
        t = (bar * BAR_STEPS + step) * STEP
        d = root + off
        lo = degree_to_midi(d, 64 + octave_shift)
        hi = degree_to_midi(d + 2, 64 + octave_shift)  # diatonic third above
        swing = 0.012 if step % 2 else 0.0
        place(pluck(lo, STEP * 2.4, bright=0.75), t + swing, pan=0.4, gain=0.3)
        place(pluck(hi, STEP * 2.4, bright=0.75), t + swing + 0.006, pan=0.5, gain=0.24)


def bass(bar, root, next_root):
    r = degree_to_midi(root, 40)
    fifth = degree_to_midi(root + 4, 40)
    approach = degree_to_midi(next_root, 40) - 1
    pattern = [(0, r, 3), (6, fifth, 2), (8, r, 3), (11, fifth, 1), (14, approach, 2)]
    for step, m, length in pattern:
        place(bass_note(m, STEP * length * 1.1), (bar * BAR_STEPS + step) * STEP, pan=0, gain=0.28)


def drums(bar, full):
    for s in range(16):
        t = (bar * BAR_STEPS + s) * STEP
        place(shaker(s % 4 == 0 or s % 4 == 2), t + (0.008 if s % 2 else 0), pan=0.15, gain=0.09 if full else 0.07)
    # conga tumbao-ish pattern
    for step, freq, slap in [(0, 196, False), (3, 262, True), (6, 262, False), (7, 262, False), (10, 196, False), (11, 262, True), (14, 175, False), (15, 175, False)]:
        place(conga(freq, slap), (bar * BAR_STEPS + step) * STEP, pan=-0.2, gain=0.2)
    if full:
        for step in (4, 12):
            place(rim(), (bar * BAR_STEPS + step) * STEP, pan=0.05, gain=0.12)


# --- Arrangement -----------------------------------------------------------
for bar in range(BARS):
    root = PROG[bar % 4]
    next_root = PROG[(bar + 1) % 4]
    section = bar // 8  # 0 intro, 1 & 2 full, 3 high variation
    rhythm_guitar(bar, root)
    bass(bar, root, next_root)
    drums(bar, full=section > 0)
    if section >= 1:
        lead_guitar(bar, root, variant=(bar // 2) + section, octave_shift=12 if section == 3 else 0)
    elif bar % 4 == 3:
        # a short pickup phrase leading into the full groove
        lead_guitar(bar, root, variant=0)

# --- Mix -------------------------------------------------------------------
def reverb(x, seconds=1.4, mix=0.16):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = rng.uniform(-1, 1, n) * np.exp(-t * 4.0)
    ir /= np.sqrt((ir ** 2).sum())
    wet = fftconvolve(x, ir)[: len(x) + n]
    # wrap the tail onto the start so the loop is seamless
    out = np.zeros(len(x))
    out += wet[: len(x)]
    spill = wet[len(x):]
    out[: len(spill)] += spill
    return x * (1 - mix) + out * mix


L = reverb(L)
R = reverb(R)
stereo = np.stack([L, R], axis=1)
# gentle high-pass to clean rumble, then soft-clip and normalise
# High-pass circularly (filter three copies, keep the middle) so the loop point stays continuous
b, a = butter(2, 40 / (SR / 2), btype="high")
stereo = lfilter(b, a, np.concatenate([stereo] * 3), axis=0)[TOTAL: 2 * TOTAL]
stereo = np.tanh(stereo * 1.4) / np.tanh(1.4)
stereo *= 0.89 / np.abs(stereo).max()

from scipy.io import wavfile
wavfile.write(sys.argv[1], SR, (stereo * 32767).astype(np.int16))
print(f"{BARS} bars, {TOTAL / SR:.1f}s, peak {np.abs(stereo).max():.2f}, rms {np.sqrt((stereo ** 2).mean()):.3f}")
