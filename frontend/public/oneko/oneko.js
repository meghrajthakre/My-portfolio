// oneko.js: https://github.com/adryd325/oneko.js

(function oneko() {
  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  if (isReducedMotion) return;

  const nekoEl = document.createElement("div");
  const SKIN_STORAGE_KEY = "portfolio:oneko-skin";
  const skins = [
    { id: "cat", label: "Milo the Cat", file: "/oneko/oneko.gif" },
    { id: "dog", label: "Bruno the Dog", file: "/oneko/dog.png" },
    { id: "fox", label: "Rusty the Fox", file: "/oneko/fox.png" },
    { id: "bunny", label: "Coco the Bunny", file: "/oneko/bunny.png" },
    { id: "ghost", label: "Boo the Ghost", file: "/oneko/ghost.png" },
    { id: "black", label: "Shadow the Cat", file: "/oneko/black.png" },
  ];

  let skinIndex = 0;
  let chooserOverlay = null;

  try {
    const savedSkin = localStorage.getItem(SKIN_STORAGE_KEY);
    const savedIndex = skins.findIndex((skin) => skin.id === savedSkin);
    if (savedIndex >= 0) skinIndex = savedIndex;
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }

  let nekoPosX = 32;
  let nekoPosY = 32;

  let mousePosX = 0;
  let mousePosY = 0;

  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;

  const nekoSpeed = 10;
  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    scratchWallN: [
      [0, 0],
      [0, -1],
    ],
    scratchWallS: [
      [-7, -1],
      [-6, -2],
    ],
    scratchWallE: [
      [-2, -2],
      [-2, -3],
    ],
    scratchWallW: [
      [-4, 0],
      [-4, -1],
    ],
    tired: [[-3, -2]],
    sleeping: [
      [-2, 0],
      [-2, -1],
    ],
    N: [
      [-1, -2],
      [-1, -3],
    ],
    NE: [
      [0, -2],
      [0, -3],
    ],
    E: [
      [-3, 0],
      [-3, -1],
    ],
    SE: [
      [-5, -1],
      [-5, -2],
    ],
    S: [
      [-6, -3],
      [-7, -2],
    ],
    SW: [
      [-5, -3],
      [-6, -1],
    ],
    W: [
      [-4, -2],
      [-4, -3],
    ],
    NW: [
      [-1, 0],
      [-1, -1],
    ],
  };

  function applySkin(index, persist = false) {
    skinIndex = (index + skins.length) % skins.length;
    const skin = skins[skinIndex];
    nekoEl.style.backgroundImage = `url(${skin.file})`;
    nekoEl.title = `${skin.label} \u00b7 Right-click to change pet`;
    nekoEl.dataset.skin = skin.id;

    if (persist) {
      try {
        localStorage.setItem(SKIN_STORAGE_KEY, skin.id);
      } catch {
        // Switching should still work when storage is unavailable.
      }
    }
  }

  function closeSkinChooser() {
    if (!chooserOverlay) return;
    document.removeEventListener("keydown", handleChooserKeydown);

    const overlay = chooserOverlay;
    const panel = overlay.firstElementChild;
    chooserOverlay = null;

    overlay.style.opacity = "0";
    if (panel) {
      panel.style.opacity = "0";
      panel.style.transform = "translateY(6px) scale(0.97)";
    }
    window.setTimeout(() => overlay.remove(), 160);
  }

  function handleChooserKeydown(event) {
    if (event.key === "Escape") closeSkinChooser();
  }

  function openSkinChooser() {
    if (chooserOverlay) return;

    chooserOverlay = document.createElement("div");
    Object.assign(chooserOverlay.style, {
      position: "fixed",
      inset: "0",
      zIndex: "2147483646",
      display: "grid",
      placeItems: "center",
      padding: "20px",
      background: "transparent",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      opacity: "0",
      transition: "opacity 180ms ease",
    });
    chooserOverlay.setAttribute("role", "presentation");

    const panel = document.createElement("div");
    Object.assign(panel.style, {
      position: "relative",
      width: "232px",
      padding: "16px",
      border: "1px solid color-mix(in srgb, var(--color-border) 80%, transparent)",
      borderRadius: "16px",
      background: "transparent",
      backdropFilter: "blur(22px)",
      WebkitBackdropFilter: "blur(22px)",
      boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--color-text) 7%, transparent), 0 28px 80px -18px rgba(0, 0, 0, 0.65)",
      color: "var(--color-text)",
      opacity: "0",
      transform: "translateY(6px) scale(0.97)",
      transition: "opacity 180ms ease, transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)",
    });
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "oneko-chooser-title");

    const title = document.createElement("strong");
    title.id = "oneko-chooser-title";
    title.textContent = "Choose Neko";
    Object.assign(title.style, {
      display: "block",
      margin: "0",
      fontSize: "15px",
      lineHeight: "30px",
      letterSpacing: "-0.01em",
    });

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    closeButton.setAttribute("aria-label", "Close pet chooser");
    Object.assign(closeButton.style, {
      width: "30px",
      height: "30px",
      display: "grid",
      placeItems: "center",
      padding: "0",
      border: "1px solid color-mix(in srgb, var(--color-border) 70%, transparent)",
      borderRadius: "999px",
      background: "color-mix(in srgb, var(--color-icons-bg) 78%, transparent)",
      color: "var(--color-text)",
      cursor: "pointer",
      transition: "background-color 120ms ease, transform 120ms ease",
    });
    closeButton.addEventListener("mouseenter", () => {
      closeButton.style.transform = "scale(1.08)";
    });
    closeButton.addEventListener("mouseleave", () => {
      closeButton.style.transform = "scale(1)";
    });
    closeButton.addEventListener("click", closeSkinChooser);

    const header = document.createElement("div");
    Object.assign(header.style, {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      marginBottom: "14px",
    });
    header.append(title, closeButton);

    const grid = document.createElement("div");
    Object.assign(grid.style, {
      display: "grid",
      gridTemplateColumns: "repeat(3, 48px)",
      justifyContent: "center",
      gap: "12px",
    });

    skins.forEach((skin, index) => {
      const isSelected = index === skinIndex;
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", `Choose ${skin.label}`);
      button.setAttribute("aria-pressed", String(isSelected));
      Object.assign(button.style, {
        position: "relative",
        width: "48px",
        height: "48px",
        border: "1px solid transparent",
        borderRadius: "9px",
        backgroundColor: isSelected ? "var(--color-icons-bg)" : "transparent",
        boxShadow: isSelected ? "0 0 0 2px var(--color-secondary-text)" : "none",
        display: "grid",
        placeItems: "center",
        padding: "0",
        cursor: "pointer",
        transition: "background-color 120ms ease, box-shadow 120ms ease, transform 120ms ease",
      });

      button.addEventListener("mouseenter", () => {
        if (!isSelected) button.style.backgroundColor = "color-mix(in srgb, var(--color-icons-bg) 70%, transparent)";
        button.style.transform = "translateY(-1px)";
      });
      button.addEventListener("mouseleave", () => {
        if (!isSelected) button.style.backgroundColor = "transparent";
        button.style.transform = "translateY(0)";
      });

      const preview = document.createElement("span");
      Object.assign(preview.style, {
        width: "32px",
        height: "32px",
        backgroundImage: `url(${skin.file})`,
        backgroundPosition: "-96px -96px",
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
      });
      button.appendChild(preview);

      const tooltip = document.createElement("span");
      tooltip.textContent = skin.label;
      Object.assign(tooltip.style, {
        position: "absolute",
        left: "50%",
        top: "calc(100% + 7px)",
        zIndex: "3",
        padding: "5px 7px",
        border: "1px solid var(--color-border)",
        borderRadius: "6px",
        background: "var(--color-text)",
        color: "var(--color-bg)",
        fontSize: "10px",
        fontWeight: "600",
        lineHeight: "1",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        opacity: "0",
        transform: "translate(-50%, 3px)",
        transition: "opacity 120ms ease, transform 120ms ease",
      });
      button.appendChild(tooltip);

      button.addEventListener("mouseenter", () => {
        tooltip.style.opacity = "1";
        tooltip.style.transform = "translate(-50%, 0)";
      });
      button.addEventListener("mouseleave", () => {
        tooltip.style.opacity = "0";
        tooltip.style.transform = "translate(-50%, 3px)";
      });

      button.addEventListener("click", () => {
        applySkin(index, true);
        closeSkinChooser();
      });
      grid.appendChild(button);
    });

    panel.append(header, grid);
    chooserOverlay.appendChild(panel);
    chooserOverlay.addEventListener("click", (event) => {
      if (event.target === chooserOverlay) closeSkinChooser();
    });
    document.body.appendChild(chooserOverlay);
    document.addEventListener("keydown", handleChooserKeydown);
    closeButton.focus();

    const activeOverlay = chooserOverlay;
    requestAnimationFrame(() => {
      if (chooserOverlay !== activeOverlay) return;
      activeOverlay.style.opacity = "1";
      panel.style.opacity = "1";
      panel.style.transform = "translateY(0) scale(1)";
    });
  }

  function init() {
    nekoEl.id = "oneko";
    nekoEl.ariaHidden = true;
    nekoEl.style.width = "32px";
    nekoEl.style.height = "32px";
    nekoEl.style.position = "fixed";
    nekoEl.style.pointerEvents = "auto";
    nekoEl.style.cursor = "context-menu";
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    nekoEl.style.zIndex = 2147483647;

    skins.forEach((skin) => {
      const image = new Image();
      image.src = skin.file;
    });
    applySkin(skinIndex);

    nekoEl.addEventListener("contextmenu", function (event) {
      event.preventDefault();
      event.stopPropagation();
      openSkinChooser();
    });

    document.body.appendChild(nekoEl);

    document.addEventListener("mousemove", function (event) {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    });

    window.requestAnimationFrame(onAnimationFrame);
  }

  let lastFrameTimestamp;

  function onAnimationFrame(timestamp) {
    // Stops execution if the neko element is removed from DOM
    if (!nekoEl.isConnected) {
      return;
    }
    if (!lastFrameTimestamp) {
      lastFrameTimestamp = timestamp;
    }
    if (timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp
      frame()
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;

    // every ~ 20 seconds
    if (
      idleTime > 10 &&
      Math.floor(Math.random() * 200) == 0 &&
      idleAnimation == null
    ) {
      let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
      if (nekoPosX < 32) {
        avalibleIdleAnimations.push("scratchWallW");
      }
      if (nekoPosY < 32) {
        avalibleIdleAnimations.push("scratchWallN");
      }
      if (nekoPosX > window.innerWidth - 32) {
        avalibleIdleAnimations.push("scratchWallE");
      }
      if (nekoPosY > window.innerHeight - 32) {
        avalibleIdleAnimations.push("scratchWallS");
      }
      idleAnimation =
        avalibleIdleAnimations[
          Math.floor(Math.random() * avalibleIdleAnimations.length)
        ];
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) {
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function frame() {
    frameCount += 1;
    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < nekoSpeed || distance < 48) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      // count down after being alerted before moving
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    let direction;
    direction = diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;

    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
  }

  init();
})();
