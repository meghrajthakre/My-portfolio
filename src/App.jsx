import React, { useEffect, useState } from "react";
import Navbar from '../src/components/Ui/Layouts/Navbar';

function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Simulate page load
    const timer = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        transition-all duration-[700ms] ease-[cubic-bezier(0.4,0,0.2,1)]
        ${loaded ? "blur-0" : "blur-xs "}
      `}
    >
      <Navbar />

    </div>
  );
}

export default App;
