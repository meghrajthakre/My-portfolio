import {
  FaApple,
  FaKeyboard,
  FaMouse,
  FaHeadphones,
  FaMobileAlt,
  FaChrome,
  FaAd,
  FaReact,
  FaDesktop,
  FaTerminal,
  FaEyeDropper,
  FaDiscord,
  FaLaptopCode
} from "react-icons/fa";

import {
  SiNotion,
  SiTicktick,
  SiObsstudio,
  SiVlcmediaplayer,
  SiGrammarly,
  SiWappalyzer,
  SiDailydotdev,
} from "react-icons/si";

export const setupData = [
  // 💻 Devices
  {
    category: "Device",
    name: "Asus Vivobook",
    specs: "8GB RAM · 512GB SSD",
    Icon: FaLaptopCode,
  },
  {
    category: "Device",
    name: "Magic Keyboard",
    Icon: FaKeyboard,
  },
  {
    category: "Device",
    name: "Arctic Fox Mouse",
    Icon: FaMouse,
  },
  {
    category: "Device",
    name: "OnePlus Earbuds (Special Edition)",
    Icon: FaHeadphones,
  },
  {
    category: "Device",
    name: "Apple 12 Pro",
    specs: "128GB",
    Icon: FaMobileAlt,
  },

  // 🌐 Web Extensions
  { category: "Extension", name: "Unhook", Icon: FaChrome },
  { category: "Extension", name: "uBlock Origin", Icon: FaAd },
  { category: "Extension", name: "React Developer Tools", Icon: FaReact },
  { category: "Extension", name: "daily.dev", Icon: SiDailydotdev },
  { category: "Extension", name: "Grammarly", Icon: SiGrammarly },
  { category: "Extension", name: "Wappalyzer", Icon: SiWappalyzer },
  { category: "Extension", name: "ColorZilla", Icon: FaEyeDropper },

  // 🧰 Software
  { category: "Software", name: "Dia", Icon: FaDesktop },
  { category: "Software", name: "Notion", Icon: SiNotion },
  { category: "Software", name: "TickTick", Icon: SiTicktick },
  { category: "Software", name: "OBS Studio", Icon: SiObsstudio },
  { category: "Software", name: "VLC", Icon: SiVlcmediaplayer },
  { category: "Software", name: "Ghostty", Icon: FaTerminal },
  { category: "Software", name: "Discord", Icon: FaDiscord },
];
