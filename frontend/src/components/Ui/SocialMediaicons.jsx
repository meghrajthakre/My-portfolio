import React, { useEffect, useRef } from "react";
import { FaDiscord, FaEnvelope, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Tooltip from "../../common/Tooltip";
import { StaggerItem, StaggerReveal } from "../Animation/StaggerReveal";

const BREAK_DIST = 64;   // itni doori ke baad chipkan tootti hai (px)
const PULL = 0.45;       // icon cursor ki taraf kitna khiske (0-1)
const MAX_STRETCH = 2.2; // max lambai
const HOVER_GROW = 1.1;

// Stick: stiff spring, cursor ke saath glued
const STICK = { k: 420, c: 30 };
// Release: kam damping, rubber wobble
const RELEASE = { k: 200, c: 6 };

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// Ek time pe sirf ek icon cursor se chipak sakta hai
let stuckOwner = null;

// Chipke rehne tak poore page pe pointer cursor (html par class lagti hai)
const STICK_CURSOR_CLASS = "social-stick-cursor";
const setStickCursor = (on) =>
  document.documentElement.classList.toggle(STICK_CURSOR_CLASS, on);

const StretchLink = ({ href, label, Icon }) => {
  const anchorRef = useRef(null);
  const innerRef = useRef(null);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const ownerId = useRef(Symbol("icon")).current;

  const st = useRef({
    x: 0, vx: 0, y: 0, vy: 0,
    s: 1, vs: 0,
    g: 1, vg: 0,
    angle: 0,
    stuck: false,
    target: { x: 0, y: 0, s: 1, g: 1 },
  }).current;

  const reduceMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const render = () => {
    const squash = 1 / Math.sqrt(Math.max(st.s, 0.2));
    innerRef.current.style.transform =
      `translate(${st.x}px, ${st.y}px) rotate(${st.angle}rad) ` +
      `scale(${st.s}, ${squash}) rotate(${-st.angle}rad) scale(${st.g})`;
  };

  const tick = (now) => {
    const dt = Math.min((now - lastTimeRef.current) / 1000, 1 / 30);
    lastTimeRef.current = now;
    const { k, c } = st.stuck ? STICK : RELEASE;

    let moving = false;
    const step = (key, vKey, target) => {
      st[vKey] += (-k * (st[key] - target) - c * st[vKey]) * dt;
      st[key] += st[vKey] * dt;
      if (Math.abs(st[key] - target) > 0.001 || Math.abs(st[vKey]) > 0.01) moving = true;
    };
    step("x", "vx", st.target.x);
    step("y", "vy", st.target.y);
    step("s", "vs", st.target.s);
    step("g", "vg", st.target.g);
    render();

    if (moving || st.stuck) {
      frameRef.current = requestAnimationFrame(tick);
    } else {
      frameRef.current = 0;
      innerRef.current.style.transform = "";
    }
  };

  const start = () => {
    if (frameRef.current) return;
    lastTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(tick);
  };

  const release = () => {
    if (!st.stuck) return;
    st.stuck = false;
    if (stuckOwner === ownerId) {
      stuckOwner = null;
      setStickCursor(false); // chipkan tooti: cursor normal
    }
    if (anchorRef.current) anchorRef.current.dataset.stuck = "false";
    st.target = { x: 0, y: 0, s: 1, g: 1 };
    start();
  };

  // Cursor ki position se target nikalo
  const follow = (clientX, clientY) => {
    const rect = anchorRef.current.getBoundingClientRect();
    const dx = clientX - (rect.left + rect.width / 2);
    const dy = clientY - (rect.top + rect.height / 2);
    const dist = Math.hypot(dx, dy);

    if (dist > BREAK_DIST) {
      release();
      return;
    }

    st.angle = Math.atan2(dy, dx);
    st.target.x = dx * PULL;
    st.target.y = dy * PULL;
    st.target.s = clamp(1 + dist / 24, 1, MAX_STRETCH);
    st.target.g = HOVER_GROW;
    start();
  };

  const handleEnter = (event) => {
    if (event.pointerType !== "mouse" || reduceMotion()) return;
    if (stuckOwner && stuckOwner !== ownerId) return;
    stuckOwner = ownerId;
    st.stuck = true;
    anchorRef.current.dataset.stuck = "true";
    setStickCursor(true); // chipke rehne tak pointer cursor
    follow(event.clientX, event.clientY);
  };

  // Chipakne ke baad cursor icon ke bahar bhi jaye to track karte raho
  useEffect(() => {
    const onMove = (event) => {
      if (!st.stuck || event.pointerType !== "mouse") return;
      follow(event.clientX, event.clientY);
    };
    const onLeaveWindow = () => release();

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      cancelAnimationFrame(frameRef.current);
      if (stuckOwner === ownerId) {
        stuckOwner = null;
        setStickCursor(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tooltip text={label}>
      <a
        ref={anchorRef}
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        aria-label={label}
        data-stuck="false"
        onPointerEnter={handleEnter}
        className="group flex cursor-pointer items-center justify-center p-2 outline-none focus-visible:text-[var(--profile-icon-hover)]"
      >
        <span ref={innerRef} className="flex will-change-transform">
          <Icon
            aria-hidden="true"
            className="h-5 w-5 text-[var(--profile-icon-color)] transition-colors duration-300 group-data-[stuck=true]:text-[var(--profile-icon-hover)]"
          />
        </span>
      </a>
    </Tooltip>
  );
};

const ICONS = [
  { href: "https://x.com/meghraj_thakre1", label: "Twitter / X", Icon: FaXTwitter },
  { href: "https://www.linkedin.com/in/meghraj-thakre-01a09b23a/", label: "LinkedIn", Icon: FaLinkedin },
  { href: "https://github.com/meghrajthakre", label: "GitHub", Icon: FaGithub },
  { href: "https://www.instagram.com/meghraj_thakre/", label: "Instagram", Icon: FaInstagram },
  { href: "https://discord.com/app", label: "Discord — meghraj2285", Icon: FaDiscord },
  { href: "mailto:meghrajthakre444@gmail.com", label: "Gmail", Icon: FaEnvelope },
];

const SocialMediaicons = () => (
  <>
    {/* !important taaki text/input jaise elements ka apna cursor bhi override ho */}
    <style>{`.${STICK_CURSOR_CLASS}, .${STICK_CURSOR_CLASS} * { cursor: pointer !important; }`}</style>

    <StaggerReveal className="flex flex-nowrap items-center gap-0" delay={0.12}>
      {ICONS.map(({ href, label, Icon }) => (
        <StaggerItem key={label}>
          <StretchLink href={href} label={label} Icon={Icon} />
        </StaggerItem>
      ))}
    </StaggerReveal>
  </>
);

export default SocialMediaicons;