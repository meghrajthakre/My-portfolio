import React, { useEffect, useState } from 'react'

const BackToTop = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShow(true);
            } else {
                setShow(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const goTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    return (
        <div>
            {
                show &&

                <button type="button" onClick={goTop} aria-label="Scroll to top" className="inline-flex items-center justify-center rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 size-10 fixed right-4 bottom-4 z-50 lg:right-8 lg:bottom-8 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                </button>
            }
        </div>
    )
}

export default BackToTop
