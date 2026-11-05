import { useCallback, useState } from "react";

import { LineNav } from "../../../components/line-nav";

const ITEMS = [
  { title: "Overview", href: "#basic-overview" },
  { title: "Projects", href: "#basic-projects" },
  { title: "About", href: "#basic-about" },
  { title: "Contact", href: "#basic-contact", badge: true },
];

export default function LineNavDemo() {
  const [activeHref, setActiveHref] = useState(ITEMS[0].href);
  const onItemClick = useCallback((item, event) => {
    event.preventDefault();
    setActiveHref(item.href);
  }, []);

  return (
    <div className="grid min-h-64 place-items-center">
      <LineNav
        aria-label="Basic demo"
        className="w-fit py-3"
        items={ITEMS}
        activeHref={activeHref}
        scrollActiveIntoView={false}
        onItemClick={onItemClick}
      />
    </div>
  );
}
