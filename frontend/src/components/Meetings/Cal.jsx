import React, { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import Shinytext from "../Ui/Shinytext";
import BookNowButton from "../Animation/BookNowButton";


const Cal = () => {
    useEffect(() => {
        (async function () {
            const cal = await getCalApi({ namespace: "30min" });

            // 👇 Initialize only the popup UI (no floating button)
            cal("ui", {
                theme: "auto", // "light" | "dark" | "auto"
                layout: "month_view",
                hideEventTypeDetails: false,
            });
        })();
    }, []);

    return (
        <div className="py-6 pb-14">
            <div className="text-center  text-center flex items-center flex-col dashed container mx-auto max-w-3xl px-4 py-14 rounded-md">
                <div className="text-xl text-[var(--color-text)] mb-4">
                    

                    <Shinytext
                        text="Hey, you scrolled this far — let's talk 👋"
                        disabled={false}
                        speed={3}
                        className='custom-class'
                    />
                </div>

                {/* 👇 Ye button click hone par Cal.com popup khulega */}
                <span
                    data-cal-namespace="30min"
                    data-cal-link="meghraj-thakre/30min"
                    data-cal-config='{"layout":"month_view"}'
                    className=""
                >
                   <BookNowButton/>
                </span>
                
            </div>
        </div>
    );
};

export default Cal;
