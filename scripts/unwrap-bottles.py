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
TEX_W = 1024
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

    # --- unwrap -------------------------------------------------------------
    theta = (np.arange(TEX_W) + 0.5) / TEX_W * 2 * np.pi  # u=0 faces the camera
    # Front half samples the photo left→right; the back half samples it again,
    # flipped, so the artwork reads correctly (not mirrored) seen from behind.
    # The two panels meet at the sides, like the seam of a wrap-around label.
    sin_t = np.sin(theta) * np.where(np.cos(theta) >= 0, 1.0, -1.0)
    ys = np.repeat(np.arange(top, bottom + 1)[:, None], TEX_W, axis=1).astype(np.float32)
    xs = center[:, None] + radius[:, None] * 0.975 * sin_t[None, :]
    tex = np.zeros((H, TEX_W, 4), dtype=np.float32)
    for c in range(4):
        tex[..., c] = map_coordinates(img[..., c], [ys, xs], order=1, mode="nearest")
    s_abs = np.abs(0.975 * sin_t)
    g = np.interp(s_abs, s_bins, gain_curve)[None, :, None]
    tex[..., :3] = np.clip(tex[..., :3] * g, 0, 1)
    # rows where the bottle is very thin (cap edge) keep their alpha soft
    Image.fromarray((tex * 255).round().astype(np.uint8), "RGBA").save(
        f"public/images/bottles/3d/{slug}.webp", quality=88, alpha_quality=100, method=6
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
