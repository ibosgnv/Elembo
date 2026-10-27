"use client";

import { useEffect, useRef } from "react";
import type { Product } from "@/data/products";
import profiles from "@/data/bottle-profiles.json";
import { getGsap, prefersReducedMotion } from "@/lib/motion";

type Slug = Product["slug"];
type Profile = { heightPx: number; radiusPx: number[]; texture: string };
const PROFILES = profiles as Record<Slug, Profile>;

/** World units: 1 = 1000 source pixels. */
const PX = 1 / 1000;
const SPIN_SPEED = 0.55; // radians per second, ~11 s per turn
const TILT_Z = -0.04; // the hero wrapper already tilts the bottle by -7°

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalV;
  void main() {
    vUv = uv;
    vNormalV = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Unlit photo texture + view-dependent shading so the bottle reads as round:
// darker towards the silhouette, a fixed glossy streak, a soft rim light.
const fragmentShader = /* glsl */ `
  uniform sampler2D map;
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec3 vNormalV;
  void main() {
    vec4 tex = texture2D(map, vUv);
    if (tex.a < 0.04) discard;
    vec3 n = normalize(vNormalV);
    float facing = clamp(abs(n.z), 0.0, 1.0);
    float shade = mix(0.62, 1.0, pow(facing, 0.55));
    float streak = smoothstep(0.30, 0.40, n.x) * (1.0 - smoothstep(0.44, 0.56, n.x)) * 0.28;
    float soft = smoothstep(-0.75, -0.55, n.x) * (1.0 - smoothstep(-0.5, -0.3, n.x)) * 0.10;
    float rim = pow(1.0 - facing, 3.0) * 0.18;
    vec3 col = tex.rgb * shade + vec3(streak + soft + rim);
    gl_FragColor = vec4(col, tex.a * uOpacity);
    #include <colorspace_fragment>
  }
`;

/**
 * Real 3D bottle: each flavour's silhouette is spun into a lathe mesh and
 * wrapped with its 360° unwrapped photo (see scripts/unwrap-bottles.py).
 * Turns continuously like the reference, leans with the pointer, and swaps
 * flavour with a little drop-and-spin. Renders nothing for reduced motion or
 * without WebGL — the flat images underneath stay visible then.
 */
export function Bottle3D({ slug, onReady }: { slug: Slug; onReady: (ready: boolean) => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ show: (s: Slug) => void } | null>(null);
  const firstSlug = useRef(slug);
  const latestSlug = useRef(slug);
  const readyRef = useRef(onReady);

  useEffect(() => {
    readyRef.current = onReady;
    latestSlug.current = slug;
  }, [onReady, slug]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || prefersReducedMotion()) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        return; // no WebGL: keep the flat images
      }
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.6 : 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.setAttribute("aria-hidden", "true");
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
      camera.position.set(0, 0, 5);

      const loader = new THREE.TextureLoader();
      const textures = new Map<Slug, import("three").Texture>();
      const geometries = new Map<Slug, import("three").LatheGeometry>();
      const loadTexture = (s: Slug) =>
        new Promise<import("three").Texture>((resolve, reject) => {
          const cached = textures.get(s);
          if (cached) return resolve(cached);
          loader.load(
            PROFILES[s].texture,
            (t) => {
              t.colorSpace = THREE.SRGBColorSpace;
              t.wrapS = THREE.RepeatWrapping;
              t.anisotropy = renderer.capabilities.getMaxAnisotropy();
              textures.set(s, t);
              resolve(t);
            },
            undefined,
            reject,
          );
        });
      const geometryFor = (s: Slug) => {
        const cached = geometries.get(s);
        if (cached) return cached;
        const { heightPx, radiusPx } = PROFILES[s];
        const n = radiusPx.length;
        const pts = [new THREE.Vector2(0, -heightPx / 2 * PX)];
        radiusPx.forEach((r, i) => {
          const y = (i / (n - 1) - 0.5) * heightPx * PX;
          pts.push(new THREE.Vector2(Math.max(r, 0.5) * PX, y));
        });
        pts.push(new THREE.Vector2(0, (heightPx / 2) * PX));
        const g = new THREE.LatheGeometry(pts, 128);
        geometries.set(s, g);
        return g;
      };

      const material = new THREE.ShaderMaterial({
        uniforms: { map: { value: null }, uOpacity: { value: 1 } },
        vertexShader,
        fragmentShader,
        transparent: true,
      });
      const tilt = new THREE.Group();
      const spinner = new THREE.Group();
      const mesh = new THREE.Mesh(geometryFor(firstSlug.current), material);
      spinner.add(mesh);
      tilt.add(spinner);
      tilt.rotation.z = TILT_Z;
      scene.add(tilt);

      const resize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        // Fit the tallest bottle with a little breathing room for the tilt
        const viewH = 1.5 * 1.08;
        const viewW = (viewH * w) / h;
        camera.left = -viewW / 2;
        camera.right = viewW / 2;
        camera.top = viewH / 2;
        camera.bottom = -viewH / 2;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      // Pointer lean (desktop only)
      const lean = { x: 0, y: 0, tx: 0, ty: 0 };
      const fine = window.matchMedia("(pointer: fine)").matches;
      const onPointer = (e: PointerEvent) => {
        lean.tx = (e.clientX / window.innerWidth - 0.5) * 0.5;
        lean.ty = (e.clientY / window.innerHeight - 0.5) * 0.25;
      };
      if (fine) window.addEventListener("pointermove", onPointer);

      // Render loop, paused off-screen and in background tabs
      let visible = true;
      const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
      io.observe(host);
      const swap = { boost: 0 };
      let raf = 0;
      let last = performance.now();
      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (!visible || document.hidden) return;
        spinner.rotation.y += (SPIN_SPEED + swap.boost) * dt;
        lean.x += (lean.tx - lean.x) * 0.06;
        lean.y += (lean.ty - lean.y) * 0.06;
        tilt.rotation.z = TILT_Z - lean.x * 0.35;
        tilt.rotation.x = lean.y;
        renderer.render(scene, camera);
      };

      const first = await loadTexture(firstSlug.current).catch(() => null);
      if (disposed) return;
      if (!first) {
        host.removeChild(renderer.domElement);
        renderer.dispose();
        return;
      }
      material.uniforms.map.value = first;
      raf = requestAnimationFrame(tick);
      readyRef.current(true);

      // Warm the other flavours once the hero is up
      const idle = window.setTimeout(() => {
        (Object.keys(PROFILES) as Slug[]).forEach((s) => {
          geometryFor(s);
          loadTexture(s).catch(() => {});
        });
      }, 1200);

      const { gsap } = getGsap();
      let current = firstSlug.current;
      apiRef.current = {
        show(next) {
          if (next === current) return;
          current = next;
          gsap.killTweensOf([spinner.position, spinner.scale, material.uniforms.uOpacity, swap]);
          const tl = gsap.timeline();
          tl.to(spinner.position, { y: -0.12, duration: 0.32, ease: "power2.in" }, 0)
            .to(material.uniforms.uOpacity, { value: 0, duration: 0.3, ease: "power1.in" }, 0)
            .to(swap, { boost: 9, duration: 0.3, ease: "power2.in" }, 0)
            .add(async () => {
              const tex = await loadTexture(next).catch(() => null);
              if (disposed || current !== next || !tex) return;
              mesh.geometry = geometryFor(next);
              material.uniforms.map.value = tex;
              gsap.fromTo(spinner.position, { y: 0.16 }, { y: 0, duration: 0.8, ease: "back.out(1.7)" });
              gsap.to(material.uniforms.uOpacity, { value: 1, duration: 0.35, ease: "power1.out" });
              gsap.to(swap, { boost: 0, duration: 1.1, ease: "power3.out" });
            });
        },
      };
      // The visitor may have switched flavour while the first texture loaded
      apiRef.current.show(latestSlug.current);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(idle);
        ro.disconnect();
        io.disconnect();
        if (fine) window.removeEventListener("pointermove", onPointer);
        gsap.killTweensOf([spinner.position, spinner.scale, material.uniforms.uOpacity, swap]);
        textures.forEach((t) => t.dispose());
        geometries.forEach((g) => g.dispose());
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        apiRef.current = null;
        readyRef.current(false);
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  useEffect(() => {
    apiRef.current?.show(slug);
  }, [slug]);

  return <div ref={hostRef} aria-hidden className="pointer-events-none absolute inset-0" />;
}
