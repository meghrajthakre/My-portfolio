import { Component, Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  Box3, DoubleSide, Group, HalfFloatType, LinearFilter, Mesh, NoBlending, OrthographicCamera,
  PlaneGeometry, Scene, ShaderMaterial, Vector2, Vector3, WebGLRenderTarget,
} from "three";
const MODEL_URL = "/models/human.glb";
const INNER_MODEL_URL = "/models/skeleton.glb";

const DEFAULTS = {
  fov: 70, height: 0.46, elevation: 12, spinSpeed: 4,
  tone: 0.95, tint: "#FCFFF8", grain: 0.095, ambient: 0.2, diffuse: 0.8, rim: 0.12,
  light: [-0.6, 0.8, 1],
  radius: 0.05, strength: 0.22, decay: 0.975, displace: 0.006, noiseScale: 12, noiseSpeed: 0.46,
  edge: 0.55, soft: 0.25, simScale: 0.5,
  bodyKeep: 0.5, innerGain: 1.5, innerTint: "#ff3b30", innerScale: 1, innerX: 0, innerY: 0, innerZ: 0, fresnelPower: 1.6, fresnelGain: 1.8, core: 0.3,
  bloom: true, bloomThreshold: 0.79, bloomKnee: 1, bloomIntensity: 0.85, bloomRadius: 0.85,
  bloomPasses: 3, bloomScale: 0.55,
  debugInner: false,
  crt: true, scanCount: 370, scanDepth: 0.32, aberration: 0.0044, vignette: 1.0, contrast: 0.95, saturation: 2.0,
};
const HUMAN_SCAN_SETTINGS = {
  radius: 0.035,
  strength: 0.15,
  innerScale: 1,
  innerX: 0,
  innerY: 0,
};

const MESH_VERT = /* glsl */ `
  varying vec3 vNormalV;
  varying vec3 vPosV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vPosV = mv.xyz;
    vNormalV = normalMatrix * normal;
    gl_Position = projectionMatrix * mv;
  }
`;
const QUAD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
const BODY_FRAG = /* glsl */ `
  precision highp float;
  varying vec3 vNormalV;
  varying vec3 vPosV;
  uniform vec3 uLightDir;
  uniform vec3 uTint;
  uniform float uAmbient, uDiffuse, uRim, uTone, uGrain, uSeed;
  float rnd(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  // Vertex normal when the model has one; otherwise a flat normal from screen
  // derivatives, so a model without normals still shades. Back faces flip.
  vec3 safeNormal(vec3 vn, vec3 pos) {
    vec3 n = dot(vn, vn) > 1e-6 ? normalize(vn) : normalize(cross(dFdx(pos), dFdy(pos)));
    return gl_FrontFacing ? n : -n;
  }
  void main() {
    vec3 n = safeNormal(vNormalV, vPosV);
    vec3 toEye = normalize(-vPosV);
    float lit = max(dot(n, normalize(uLightDir)), 0.0);
    float edge = pow(1.0 - max(dot(n, toEye), 0.0), 2.5);
    float level = (uAmbient + uDiffuse * lit + uRim * edge) * uTone;
    vec2 q = gl_FragCoord.xy + uSeed;
    vec3 speckle = vec3(rnd(q), rnd(q + 17.3), rnd(q + 41.7)) - 0.5;
    gl_FragColor = vec4(clamp(vec3(level) * uTint + speckle * uGrain, 0.0, 1.0), 1.0);
  }
`;
const INNER_FRAG = /* glsl */ `
  precision highp float;
  varying vec3 vNormalV;
  varying vec3 vPosV;
  uniform vec3 uTint;
  uniform float uPower, uGain, uCore;

  // Vertex normal when the model has one; otherwise a flat normal from screen
  // derivatives, so a model without normals still shades. Back faces flip.
  vec3 safeNormal(vec3 vn, vec3 pos) {
    vec3 n = dot(vn, vn) > 1e-6 ? normalize(vn) : normalize(cross(dFdx(pos), dFdy(pos)));
    return gl_FrontFacing ? n : -n;
  }
  void main() {
    vec3 n = safeNormal(vNormalV, vPosV);
    vec3 toEye = normalize(-vPosV);
    float f = pow(1.0 - abs(dot(n, toEye)), uPower);
    gl_FragColor = vec4(clamp(vec3(uCore + uGain * f) * uTint, 0.0, 1.0), 1.0);
  }
`;
const FLUID_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPrev, uMask;
  uniform vec2 uFrom, uTo, uAspect;
  uniform float uRadius, uStrength, uKeep, uPush, uFreq, uTime;
  float h21(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 8414.7); }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x),
               mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float s = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { s += a * vnoise(p); p *= 2.03; a *= 0.5; }
    return s;
  }
  void main() {
    vec2 flow = vec2(fbm(vUv * uFreq + vec2(0.0, uTime)), fbm(vUv * uFreq + vec2(7.1, -uTime))) - 0.5;
    float old = texture2D(uPrev, vUv - flow * uPush).r * uKeep;
    vec2 pa = (vUv - uFrom) * uAspect;
    vec2 ba = (uTo - uFrom) * uAspect;
    float t = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
    float d = length(pa - ba * t);
    float add = uStrength * exp(-(d * d) / max(uRadius * uRadius, 1e-6));
    // only paint on the figure, and only while the cursor itself is on it
    add *= texture2D(uMask, vUv).a * texture2D(uMask, uTo).a;
    gl_FragColor = vec4(min(old + add, 1.0), 0.0, 0.0, 1.0);
  }
`;
const COMPOSITE_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uBody, uInner, uFluid;
  uniform float uEdge, uSoft, uBodyKeep, uInnerGain, uForce;
  void main() {
    float f = texture2D(uFluid, vUv).r;
    float m = max(smoothstep(uEdge - uSoft, uEdge + uSoft, f), uForce);
    vec4 b = texture2D(uBody, vUv) * (1.0 - uForce);
    vec4 x = texture2D(uInner, vUv);
    gl_FragColor = clamp(b * mix(1.0, uBodyKeep, m) + x * (m * uInnerGain), 0.0, 1.0);
  }
`;
const BRIGHT_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uSrc;
  uniform float uThreshold, uKnee;
  void main() {
    vec4 c = texture2D(uSrc, vUv);
    float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
    gl_FragColor = vec4(c.rgb * smoothstep(uThreshold, uThreshold + max(uKnee, 1e-4), l), 1.0);
  }
`;
const BLUR_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uSrc;
  uniform vec2 uStep;
  void main() {
    vec3 c = texture2D(uSrc, vUv).rgb * 0.227027;
    c += (texture2D(uSrc, vUv + uStep).rgb + texture2D(uSrc, vUv - uStep).rgb) * 0.1945946;
    c += (texture2D(uSrc, vUv + uStep * 2.0).rgb + texture2D(uSrc, vUv - uStep * 2.0).rgb) * 0.1216216;
    c += (texture2D(uSrc, vUv + uStep * 3.0).rgb + texture2D(uSrc, vUv - uStep * 3.0).rgb) * 0.0540541;
    c += (texture2D(uSrc, vUv + uStep * 4.0).rgb + texture2D(uSrc, vUv - uStep * 4.0).rgb) * 0.0162162;
    gl_FragColor = vec4(c, 1.0);
  }
`;
const COMBINE_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uSrc, uBloom;
  uniform float uBloomGain, uCrt, uScanCount, uScanDepth, uSplit, uVignette, uContrast, uSaturation;
  void main() {
    vec4 c;
    if (uCrt > 0.5 && uSplit > 0.0) {
      vec2 dir = (vUv - 0.5) * uSplit;
      vec4 r = texture2D(uSrc, vUv + dir);
      vec4 g = texture2D(uSrc, vUv);
      vec4 b = texture2D(uSrc, vUv - dir);
      c = vec4(r.r, g.g, b.b, max(max(r.a, g.a), b.a));
    } else { c = texture2D(uSrc, vUv); }
    vec3 glow = texture2D(uBloom, vUv).rgb * uBloomGain;
    float a = clamp(c.a + dot(glow, vec3(0.3333)), 0.0, 1.0);
    vec3 rgb = clamp(c.rgb + glow, 0.0, 1.0);
    if (uCrt > 0.5) {
      rgb = clamp((rgb - 0.5) * uContrast + 0.5, 0.0, 1.0);
      float luma = dot(rgb, vec3(0.2126, 0.7152, 0.0722));
      rgb = clamp(mix(vec3(luma), rgb, uSaturation), 0.0, 1.0);
      float scan = 1.0 - uScanDepth * (0.5 + 0.5 * sin(vUv.y * uScanCount * 6.2831853));
      vec2 d = vUv - 0.5;
      float k = clamp(scan * (1.0 - uVignette * dot(d, d) * 2.0), 0.0, 1.0);
      rgb *= k; a *= k;
    }
    gl_FragColor = vec4(rgb, a);
  }
`;

const tintVec = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || "#ffffff");
  if (!m) return new Vector3(1, 1, 1);
  const n = parseInt(m[1], 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const avg = (c[0] + c[1] + c[2]) / 3 || 1;
  return new Vector3(c[0] / avg, c[1] / avg, c[2] / avg);
};
const quadMaterial = (fragmentShader, uniforms) =>
  new ShaderMaterial({ vertexShader: QUAD_VERT, fragmentShader, uniforms, blending: NoBlending, depthTest: false, depthWrite: false });

const normalise = (source, material) => {
  const root = source.clone(true);
  root.traverse((n) => {
    if (!n.isMesh) return;
    n.material = material;
    n.frustumCulled = false;
    if (!n.geometry.attributes.normal) n.geometry.computeVertexNormals();
  });
  const box = new Box3().setFromObject(root);
  const centre = box.getCenter(new Vector3());
  const h = box.getSize(new Vector3()).y || 1;
  root.position.sub(centre);
  const holder = new Group();
  holder.add(root);
  holder.scale.setScalar(1 / h);
  const scene = new Scene();
  scene.add(holder);
  return { scene, holder };
};

function XrayFigure({ cfg, reducedMotion }) {
  const { gl, size } = useThree();
  const bodyGltf = useLoader(GLTFLoader, MODEL_URL);
  const innerGltf = useLoader(GLTFLoader, INNER_MODEL_URL);
  const pointer = useRef({ ax: -9, ay: -9, bx: -9, by: -9, moved: false });
  const spin = useRef(0);
  // drag-to-rotate: `check` is a press waiting to be tested against the figure
  const drag = useRef({ check: null, active: false, lastX: 0, vel: 0 });

  const rig = useMemo(() => {
    const bodyMat = new ShaderMaterial({
      vertexShader: MESH_VERT, fragmentShader: BODY_FRAG, side: DoubleSide,
      uniforms: {
        uLightDir: { value: new Vector3(...cfg.light) }, uTint: { value: tintVec(cfg.tint) },
        uAmbient: { value: cfg.ambient }, uDiffuse: { value: cfg.diffuse }, uRim: { value: cfg.rim },
        uTone: { value: cfg.tone }, uGrain: { value: cfg.grain }, uSeed: { value: 0 },
      },
    });
    const innerMat = new ShaderMaterial({
      vertexShader: MESH_VERT, fragmentShader: INNER_FRAG, side: DoubleSide,
      uniforms: {
        uTint: { value: tintVec(cfg.innerTint) }, uPower: { value: cfg.fresnelPower },
        uGain: { value: cfg.fresnelGain }, uCore: { value: cfg.core },
      },
    });
    const body = normalise(bodyGltf.scene, bodyMat);
    const inner = normalise(innerGltf.scene, innerMat);
    // line a separate skeleton/anatomy model up with the body
    inner.holder.scale.multiplyScalar(cfg.innerScale);
    inner.holder.position.set(cfg.innerX, cfg.innerY, cfg.innerZ);
    const filt = { minFilter: LinearFilter, magFilter: LinearFilter };
    const meshRT = () => new WebGLRenderTarget(2, 2, { ...filt, depthBuffer: true, samples: 4 });
    const flatRT = (extra = {}) => new WebGLRenderTarget(2, 2, { ...filt, depthBuffer: false, ...extra });
    const t = {
      body: meshRT(), inner: meshRT(), comp: flatRT(),
      fluidA: flatRT({ type: HalfFloatType }), fluidB: flatRT({ type: HalfFloatType }),
      bloomA: flatRT(), bloomB: flatRT(),
    };
    const u = {
      fluid: {
        uPrev: { value: null }, uMask: { value: t.body.texture }, uFrom: { value: new Vector2(-9, -9) }, uTo: { value: new Vector2(-9, -9) },
        uAspect: { value: new Vector2(1, 1) }, uRadius: { value: cfg.radius }, uStrength: { value: 0 },
        uKeep: { value: 1 }, uPush: { value: cfg.displace }, uFreq: { value: cfg.noiseScale }, uTime: { value: 0 },
      },
      comp: {
        uBody: { value: t.body.texture }, uInner: { value: t.inner.texture }, uFluid: { value: null },
        uEdge: { value: cfg.edge }, uSoft: { value: cfg.soft }, uBodyKeep: { value: cfg.bodyKeep }, uInnerGain: { value: cfg.innerGain }, uForce: { value: cfg.debugInner ? 1 : 0 },
      },
      bright: { uSrc: { value: t.comp.texture }, uThreshold: { value: cfg.bloomThreshold }, uKnee: { value: cfg.bloomKnee } },
      blur: { uSrc: { value: null }, uStep: { value: new Vector2() } },
      combine: {
        uSrc: { value: t.comp.texture }, uBloom: { value: t.bloomA.texture }, uBloomGain: { value: cfg.bloomIntensity },
        uCrt: { value: cfg.crt ? 1 : 0 }, uScanCount: { value: cfg.scanCount }, uScanDepth: { value: cfg.scanDepth },
        uSplit: { value: cfg.aberration }, uVignette: { value: cfg.vignette }, uContrast: { value: cfg.contrast },
        uSaturation: { value: cfg.saturation },
      },
    };
    const mats = {
      fluid: quadMaterial(FLUID_FRAG, u.fluid), comp: quadMaterial(COMPOSITE_FRAG, u.comp),
      bright: quadMaterial(BRIGHT_FRAG, u.bright), blur: quadMaterial(BLUR_FRAG, u.blur),
      combine: quadMaterial(COMBINE_FRAG, u.combine),
    };
    const quad = new Mesh(new PlaneGeometry(2, 2), mats.comp);
    quad.frustumCulled = false;
    const quadScene = new Scene();
    quadScene.add(quad);
    const quadCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    return { bodyMat, innerMat, body, inner, t, u, mats, quad, quadScene, quadCam };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyGltf, innerGltf]);

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    const W = Math.max(2, Math.round(size.width * dpr));
    const H = Math.max(2, Math.round(size.height * dpr));
    const sw = Math.max(2, Math.round(W * cfg.simScale));
    const sh = Math.max(2, Math.round(H * cfg.simScale));
    const bw = Math.max(2, Math.round(W * cfg.bloomScale));
    const bh = Math.max(2, Math.round(H * cfg.bloomScale));
    const { t, u } = rig;
    t.body.setSize(W, H); t.inner.setSize(W, H); t.comp.setSize(W, H);
    t.fluidA.setSize(sw, sh); t.fluidB.setSize(sw, sh);
    t.bloomA.setSize(bw, bh); t.bloomB.setSize(bw, bh);
    u.fluid.uAspect.value.set(sw / sh, 1);
  }, [rig, gl, size, cfg.simScale, cfg.bloomScale]);

  useEffect(() => {
    const p = pointer.current;
    const move = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;
      if (!p.moved) { p.ax = x; p.ay = y; }
      p.bx = x; p.by = y; p.moved = true;
    };
    const leave = () => { p.moved = false; };

    const d = drag.current;
    const SENS = 0.008; // radians per pixel dragged
    const down = (e) => {
      if (e.button !== 0) return;
      d.check = { x: e.clientX, y: e.clientY }; // tested against the figure next frame
      d.lastX = e.clientX;
    };
    const dragMove = (e) => {
      if (!d.active) return;
      const dx = e.clientX - d.lastX;
      d.lastX = e.clientX;
      spin.current += dx * SENS;
      d.vel = dx * SENS * 60; // radians per second, for the fling on release
    };
    const up = () => {
      d.check = null;
      if (d.active) {
        d.active = false;
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      }
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointermove", dragMove, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointermove", dragMove);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, []);

  useEffect(() => () => {
    Object.values(rig.t).forEach((r) => r.dispose());
    Object.values(rig.mats).forEach((m) => m.dispose());
    rig.bodyMat.dispose(); rig.innerMat.dispose(); rig.quad.geometry.dispose();
  }, [rig]);

  const run = (material, target) => {
    rig.quad.material = material;
    gl.setRenderTarget(target);
    gl.render(rig.quadScene, rig.quadCam);
  };

  useFrame((state, delta) => {
    const { t, u, mats, body, inner } = rig;
    const p = pointer.current;
    const dt = Math.min(delta, 0.1);
    const d = drag.current;
    if (!d.active) {
      // fling after release, easing back to the slow idle spin
      spin.current += d.vel * dt;
      d.vel *= Math.pow(0.92, dt * 60);
      if (!reducedMotion) spin.current += ((cfg.spinSpeed * Math.PI) / 180) * dt;
    }
    body.holder.rotation.y = spin.current;
    inner.holder.rotation.y = spin.current;
    rig.bodyMat.uniforms.uSeed.value = Math.random() * 1000;

    u.fluid.uPrev.value = t.fluidA.texture;
    u.fluid.uFrom.value.set(p.ax, p.ay);
    u.fluid.uTo.value.set(p.bx, p.by);
    // paint only on frames where the cursor actually travelled, so it heals when you stop
    u.fluid.uStrength.value = !drag.current.active && p.moved && (p.ax !== p.bx || p.ay !== p.by) ? cfg.strength : 0;
    u.fluid.uKeep.value = Math.pow(cfg.decay, dt * 60);
    u.fluid.uTime.value = state.clock.elapsedTime * cfg.noiseSpeed;
    run(mats.fluid, t.fluidB);
    const tmp = t.fluidA; t.fluidA = t.fluidB; t.fluidB = tmp;
    p.ax = p.bx; p.ay = p.by;

    gl.setRenderTarget(t.body); gl.render(body.scene, state.camera);
    gl.setRenderTarget(t.inner); gl.render(inner.scene, state.camera);

    u.comp.uFluid.value = t.fluidA.texture;
    run(mats.comp, t.comp);

    if (d.check) {
      const px = Math.floor((d.check.x / window.innerWidth) * t.comp.width);
      const py = Math.floor((1 - d.check.y / window.innerHeight) * t.comp.height);
      const px4 = new Uint8Array(4);
      gl.readRenderTargetPixels(t.comp, px, py, 1, 1, px4);
      d.check = null;
      if (px4[3] > 40) { // pressed on the figure
        d.active = true;
        d.vel = 0;
        document.body.style.userSelect = "none";
        document.body.style.cursor = "grabbing";
      }
    }

    if (cfg.bloom) {
      run(mats.bright, t.bloomA);
      const bw = t.bloomA.width, bh = t.bloomA.height;
      for (let i = 0; i < cfg.bloomPasses; i++) {
        const spread = cfg.bloomRadius * (i + 1);
        u.blur.uSrc.value = t.bloomA.texture; u.blur.uStep.value.set(spread / bw, 0); run(mats.blur, t.bloomB);
        u.blur.uSrc.value = t.bloomB.texture; u.blur.uStep.value.set(0, spread / bh); run(mats.blur, t.bloomA);
      }
      u.combine.uBloomGain.value = cfg.bloomIntensity;
    } else u.combine.uBloomGain.value = 0;

    u.combine.uBloom.value = t.bloomA.texture;
    run(mats.combine, null);
  }, 1);

  return null;
}

class HumanBackgroundErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) {
    console.error("Unable to render the human scan. Check that the model files are available.", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="fixed inset-0 z-10 flex items-center justify-center bg-black px-6 text-center text-sm text-white">
          <p>Human scan could not be loaded. Check <code className="font-mono">public/models/human.glb</code> and the skeleton file path.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function HumanScan() {
  const cfg = useMemo(() => ({ ...DEFAULTS, ...HUMAN_SCAN_SETTINGS }), []);
  const reducedMotion = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const fovRad = (cfg.fov * Math.PI) / 180;
  const dist = 1 / cfg.height / (2 * Math.tan(fovRad / 2));
  const tilt = (cfg.elevation * Math.PI) / 180;
  return (
    <>
      <HumanBackgroundErrorBoundary>
        <style>{`
          .human-background {
            position: fixed;
            inset: 0;
            z-index: -3;
            overflow: hidden;
            pointer-events: none;
            isolation: isolate;
          }
          .human-background canvas {
            position: absolute;
            inset: 0;
            display: block;
            width: 100%;
            height: 100%;
            pointer-events: none;
          }
          .human-fx {
            position: absolute;
            inset: 0;
            pointer-events: none;
            mix-blend-mode: saturation;
          }
        `}</style>
        <div className="human-background" aria-hidden="true" style={{ background: "#000000" }}>
          <Canvas
            camera={{ fov: cfg.fov, near: 0.05, far: 40, position: [0, Math.sin(tilt) * dist, Math.cos(tilt) * dist] }}
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
            onCreated={({ gl, camera }) => { gl.setClearColor(0x000000, 0); camera.lookAt(0, 0, 0); }}
          >
            <Suspense fallback={null}>
              <XrayFigure cfg={cfg} reducedMotion={reducedMotion} />
            </Suspense>
          </Canvas>
          <div className="human-fx" style={{ background: "#e8271c", opacity: 0.14 }} />
        </div>
      </HumanBackgroundErrorBoundary>
      <main className="relative z-0 mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center text-[var(--color-text)]">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">
          Interactive 3D study
        </p>
        <h2 className="text-4xl font-bold sm:text-6xl">Human Scan</h2>
        <p className="mt-5 max-w-lg text-base text-[var(--color-secondary-text)] sm:text-lg">
          Move your pointer across the scan to reveal its inner structure.
        </p>
      </main>
    </>
  );
}

export default HumanScan;