import React, { useEffect, useRef } from "react";

const DogFollower = () => {
  const dogsRef = useRef({});
  const activeDogRef = useRef(null);
  const dogX = useRef(window.innerWidth / 2);
  const dogY = useRef(window.innerHeight / 2);
  const targetX = useRef(dogX.current);
  const targetY = useRef(dogY.current);
  const lastMoveTime = useRef(Date.now());
  const isIdle = useRef(false);

  useEffect(() => {
    const dogs = {
      up: document.getElementById("dog-up"),
      down: document.getElementById("dog-down"),
      left: document.getElementById("dog-left"),
      right: document.getElementById("dog-right"),
      upLeft: document.getElementById("dog-up-left"),
      upRight: document.getElementById("dog-up-right"),
      downLeft: document.getElementById("dog-down-left"),
      downRight: document.getElementById("dog-down-right"),
      idleRight: document.getElementById("dog-idle-right"),
      idleLeft: document.getElementById("dog-idle-left"),
    };

    dogsRef.current = dogs;
    activeDogRef.current = dogs.right;
    activeDogRef.current.classList.add("active");

    const handleMouseMove = (e) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;
      lastMoveTime.current = Date.now();
      isIdle.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);

    const switchDog = (newDog) => {
      if (activeDogRef.current !== newDog) {
        activeDogRef.current.classList.remove("active");
        activeDogRef.current = newDog;
        activeDogRef.current.classList.add("active");
      }
    };

    const getDirection = (dx, dy) => {
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      if (angle >= -22.5 && angle < 22.5) return "right";
      if (angle >= 22.5 && angle < 67.5) return "downRight";
      if (angle >= 67.5 && angle < 112.5) return "down";
      if (angle >= 112.5 && angle < 157.5) return "downLeft";
      if (angle >= 157.5 || angle < -157.5) return "left";
      if (angle >= -157.5 && angle < -112.5) return "upLeft";
      if (angle >= -112.5 && angle < -67.5) return "up";
      if (angle >= -67.5 && angle < -22.5) return "upRight";
    };

    function animate() {
      const dx = targetX.current - dogX.current;
      const dy = targetY.current - dogY.current;
      const distance = Math.hypot(dx, dy);
      const now = Date.now();

      if (now - lastMoveTime.current < 5000 ) {
        const speed = 0.001; // smoother & faster movement
        dogX.current += dx * speed;
        dogY.current += dy * speed;
        const dir = getDirection(dx, dy);
        if (dogsRef.current[dir]) switchDog(dogsRef.current[dir]);
      } else {
        if (!isIdle.current) {
          isIdle.current = true;
          switchDog(dogX.current < targetX.current ? dogs.idleRight : dogs.idleLeft);
        }
      }

      if (activeDogRef.current) {
        activeDogRef.current.style.left = `${dogX.current}px`;
        activeDogRef.current.style.top = `${dogY.current}px`;
      }

      requestAnimationFrame(animate);
    }

    animate();
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <img id="dog-up" className="dog" src="public/follower/ezgif.com-rotate (3).gif" alt="dog-up" />
      <img id="dog-down" className="dog" src="public/follower/ezgif.com-rotate.gif" alt="dog-down" />
      <img id="dog-left" className="dog" src="public/follower/ezgif.com-rotate (1).gif" alt="dog-left" />
      <img id="dog-right" className="dog" src="public/follower/ezgif.com-gif-maker.gif" alt="dog-right" />
      <img id="dog-up-left" className="dog" src="public/follower/dog_flipped_same_size-ezgif.com-rotate (1).gif" alt="dog-up-left" />
      <img id="dog-up-right" className="dog" src="public/follower/dog_rotated_topright_30_same_size.gif" alt="dog-up-right" />
      <img id="dog-down-left" className="dog" src="public/follower/dog_flipped_same_size-ezgif.com-rotate.gif" alt="dog-down-left" />
      <img id="dog-down-right" className="dog" src="public/follower/dog_south_west_30_same_size.gif" alt="dog-down-right" />
      <img id="dog-idle-right" className="dog" src="public/follower/ezgif.com-effects (1).gif" alt="dog-idle-right" />
      <img id="dog-idle-left" className="dog" src="public/follower/ezgif.com-rotate (4).gif" alt="dog-idle-left" />

      <style>{`
        .dog {
          position: fixed; /* 🧠 stays on screen even if scroll */
          width: 40px;    /* 🐾 bigger & cuter */
          height: 40px;
          object-fit: contain;
          pointer-events: none;
          transform: translate(-50%, -50%);
          display: none;
          z-index: 99999;
        }
        .dog.active {
          display: block;
        }
      `}</style>
    </>
  );
};

export default DogFollower;
