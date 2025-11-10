import React from "react";
import { setupData } from "../data/setUpData";

const Gears = () => {
  // Group items by category (Devices, Extensions, Software)
  const categories = [...new Set(setupData.map((item) => item.category))];

  return (
    <div className="max-w-3xl m-auto px-6 sm:px-8 mt-10 text-[var(--color-text)]">
      {/* Header */}
      <header className="text-center pb-6 border-b border-[var(--color-border)] flex flex-col items-center gap-4">
        <h4 className="text-5xl font-bold text-[var(--color-heading)]">
          Gears
        </h4>
        <p className="text-[var(--color-muted)] max-w-md">
          My gears and tools I use to get my work done.
        </p>
      </header>

      {/* Gear Categories */}
      <div className="mt-10 space-y-10">
        {categories.map((category) => (
          <section key={category}>
            {/* Category Title */}
            <h2 className="text-2xl font-semibold mb-4 text-[var(--color-secondary-text)]">
              {category === "Device"
                ? "💻 Devices"
                : category === "Extension"
                ? "🌐 Web Extensions"
                : "🧰 Software"}
            </h2>

            {/* Items Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {setupData
                .filter((item) => item.category === category)
                .map(({ name, specs, Icon }) => (
                  <div
                    key={name}
                    className="flex items-center gap-3 bg-[var(--color-card-bg)]
                    dashed rounded-lg p-3
                    hover:bg-[var(--color-secondary-bg)]
                    transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Icon className="text-xl text-[var(--color-accent)] flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">{name}</h3>
                      {specs && (
                        <p className="text-sm text-[var(--color-muted)]">
                          {specs}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Gears;
