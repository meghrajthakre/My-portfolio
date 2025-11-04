import { useRef, useState } from "react";

const SpotlightCard = ({
    children,
    className = "",
    spotlightColor = "rgba(255, 255, 255, 0.15)",
}) => {
    const divRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current || isFocused) return;

        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(0.5);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(0.5);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative rounded-2xl  bg-[var(--color-card-bg] 
            text-[var(--color-secondary-text)] overflow-hidden  shadow-sm transition-all duration-300 ease-out ${className}`}
        >
            <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-in-out"
                style={{
                    boxShadow: `0 0 25px 4px ${spotlightColor}`,
                    transition: "box-shadow 0.4s ease",
                    opacity,
                    background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
                }}
            />


            {children}
        </div>
    );
};

export default SpotlightCard;
