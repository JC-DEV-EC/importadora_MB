import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";

export function useAnimatedNumber(target: number, duration = 1200): number {
  const [current, setCurrent] = useState(0);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (animatedRef.current) return;
    animatedRef.current = true;

    const obj = { val: 0 };
    animate(obj, {
      val: target,
      duration,
      easing: "easeOutExpo",
      onUpdate: () => setCurrent(obj.val),
    });
  }, [target, duration]);

  return Math.round(current);
}
