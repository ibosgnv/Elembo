"""
Turn each flat bottle mockup into a 3D-ready asset pair:

- public/images/bottles/3d/<slug>.webp  : 360° texture unwrapped around the
  bottle's own silhouette (front photographed half, mirrored for the back)
- src/data/bottle-profiles.json          : radius per height, used to spin
  the silhouette into a lathe mesh in three.js

The photo's baked edge darkening is partly compensated so it doesn't travel
around the bottle as a dark band when it rotates.

Usage: python3 scripts/unwrap-bottles.py   (needs numpy, scipy, pillow)
"""
import json
import numpy as np
from PIL import Image
from scipy.ndimage import map_coordinates, median_filter, uniform_filter1d

SLUGS = ["orange", "ananas", "mangue", "orange-ananas", "mangue-ananas"]
TEX_W = 2048
# Each label copy uses only the photo within ±PANEL of face-on, where it is sharp
# and undistorted; the sides between the two copies are filled cleanly instead
# of stretching the photo's squeezed edges.
PANEL = np.radians(72)
FADE = np.radians(10)
PROFILE_SAMPLES = 160
out_profiles = {}

for slug in SLUGS:
    img = np.asarray(Image.open(f"public/images/bottles/{slug}.webp").convert("RGBA")).astype(np.float32) / 255
    a = img[..., 3]
    rows = np.where((a > 0.4).any(axis=1))[0]
    top, bottom = rows.min(), rows.max()
    H = bottom - top + 1
    left = np.zeros(H)
    right = np.zeros(H)
    for i, y in enumerate(range(top, bottom + 1)):
        xs = np.where(a[y] > 0.4)[0]
        left[i], right[i] = (xs.min(), xs.max()) if len(xs) else (np.nan, np.nan)
    # fill gaps, smooth the silhouette
    idx = np.arange(H)
    ok = ~np.isnan(left)
    left = np.interp(idx, idx[ok], left[ok])
    right = np.interp(idx, idx[ok], right[ok])
    left = median_filter(left, 9)
    right = median_filter(right, 9)
    radius = (right - left) / 2
    center = uniform_filter1d((right + left) / 2, 41)

    # --- edge shading compensation, measured on the photo itself ---------
    s_bins = np.linspace(0, 1, 41)
    lum = img[..., :3] @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    acc = np.zeros(len(s_bins))
    cnt = np.zeros(len(s_bins))
    for i in range(0, H, 3):
        y = top + i
        r = radius[i]
        if r < 20:
            continue
        xs = np.arange(int(left[i]), int(right[i]) + 1)
        s = np.abs(xs - center[i]) / r
        b = np.clip((s * (len(s_bins) - 1)).round().astype(int), 0, len(s_bins) - 1)
        np.add.at(acc, b, lum[y, xs])
        np.add.at(cnt, b, 1)
    prof = acc / np.maximum(cnt, 1)
    prof = uniform_filter1d(prof, 5)
    gain_curve = np.clip(prof[:8].mean() / np.maximum(prof, 1e-3), 1.0, 1.6)
    gain_curve = 1 + (gain_curve - 1) * 0.7

    # --- label band (white paper rows) in the lower part of the bottle ----
    rgb = img[..., :3]
    mx, mn = rgb.max(-1), rgb.min(-1)
    sat = (mx - mn) / np.maximum(mx, 1e-3)
    cen = slice(int(center.mean() - 0.45 * radius.max()), int(center.mean() + 0.45 * radius.max()))
    whiteish = ((lum[:, cen] > 0.80) & (sat[:, cen] < 0.2)).mean(1)
    cand = np.array([y for y in range(top + int(H * 0.4), bottom + 1) if whiteish[y] > 0.15])
    label_top, label_bottom = bottom, bottom
    if len(cand):
        # merge runs separated by small gaps (dark artwork), keep the longest
        runs = np.split(cand, np.where(np.diff(cand) > 60)[0] + 1)
        best = max(runs, key=len)
        label_top, label_bottom = int(best[0]) - 4, int(best[-1]) + 4
    # paper colour per row: the bright, unsaturated pixels of the label
    paper = np.ones((H, 3), dtype=np.float32)
    for i, y in enumerate(range(top, bottom + 1)):
        if label_top <= y <= label_bottom:
            row = rgb[y, cen][(lum[y, cen] > 0.80) & (sat[y, cen] < 0.2)]
            if len(row):
                paper[i] = np.median(row, axis=0)
    paper = uniform_filter1d(paper, 25, axis=0)

    # --- unwrap -------------------------------------------------------------
    theta = (np.arange(TEX_W) + 0.5) / TEX_W * 2 * np.pi  # u=0 faces the camera
    phi = (theta + np.pi) % (2 * np.pi) - np.pi  # (-pi, pi]
    back = np.abs(phi) > np.pi / 2
    # local angle within the nearest copy; the back copy is sampled so it reads
    # correctly (not mirrored) when seen from behind
    alpha = np.where(back, phi - np.sign(phi) * np.pi, phi)
    inside = np.abs(alpha) <= PANEL

    def sample(alpha_cols):
        xs = center[:, None] + radius[:, None] * 0.975 * np.sin(alpha_cols)[None, :]
        ys = np.repeat(np.arange(top, bottom + 1)[:, None], len(alpha_cols), axis=1).astype(np.float32)
        out = np.zeros((H, len(alpha_cols), 4), dtype=np.float32)
        for c in range(4):
            out[..., c] = map_coordinates(img[..., c], [ys, xs], order=3, mode="nearest")
        g = np.interp(np.abs(0.975 * np.sin(alpha_cols)), s_bins, gain_curve)[None, :, None]
        out[..., :3] = np.clip(out[..., :3] * g, 0, 1)
        return out

    tex = sample(np.clip(alpha, -PANEL, PANEL))

    # Sides (between the two copies): angular distance past the panel edge
    over = np.clip(np.abs(alpha) - PANEL, 0, None)
    gap = np.pi / 2 - PANEL  # half-width of each side gap
    # glass / juice / cap rows: blend two mirror reflections back into the
    # clean panel, so colour and ribs continue without a seam
    refl_front = np.sign(alpha) * (PANEL - np.minimum(over, PANEL))
    t = np.clip(over / gap, 0, 1)[None, :, None] * 0.5  # 0 at panel edge → 0.5 at gap centre
    mirrored = sample(refl_front)
    blend = tex * 1  # panel edge value (clamped sample) continues smoothly
    side_fill = mirrored * (1 - t) + mirrored[:, ::-1] * t
    side = (~inside)[None, :, None]
    tex = np.where(side, side_fill, tex)

    # label rows: fade the artwork into plain label paper across the sides
    rows = np.arange(top, bottom + 1)
    is_label = ((rows >= label_top) & (rows <= label_bottom))[:, None, None]
    fade = np.clip(1 - (over - 0) / FADE, 0, 1)[None, :, None]  # 1 inside, → 0 past FADE
    # soften the artwork edge a little inside the panel too
    fade = fade * np.clip((PANEL - np.abs(alpha)) / np.radians(4) + 1, 0, 1)[None, :, None]
    art = sample(np.clip(alpha, -PANEL, PANEL))
    paper_rgba = np.concatenate([paper[:, None, :].repeat(TEX_W, 1), tex[..., 3:4]], axis=-1)
    label_tex = art * fade + paper_rgba * (1 - fade)
    label_tex[..., 3] = tex[..., 3]
    tex = np.where(is_label, label_tex, tex)
    print(f"  label rows {label_top - top}–{label_bottom - top} of {H}")

    Image.fromarray((np.clip(tex, 0, 1) * 255).round().astype(np.uint8), "RGBA").save(
        f"public/images/bottles/3d/{slug}.webp", quality=90, alpha_quality=100, method=6
    )


    # --- profile (bottom → top), in source pixels ---------------------------
    sample_rows = np.linspace(H - 1, 0, PROFILE_SAMPLES)
    r_samples = np.interp(sample_rows, idx, radius)
    out_profiles[slug] = {
        "heightPx": int(H),
        "radiusPx": [round(float(v), 2) for v in r_samples],
        "texture": f"/images/bottles/3d/{slug}.webp",
    }
    print(slug, "height", H, "max radius", round(float(radius.max()), 1), "edge gain", np.round(gain_curve[[20, 30, 36, 40]], 2))

with open("src/data/bottle-profiles.json", "w") as f:
    json.dump(out_profiles, f)
