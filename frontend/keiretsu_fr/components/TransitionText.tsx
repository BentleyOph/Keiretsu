'use client';

import { TextEffect } from "@/components/ui/text-effect";

const TransitionText = () => {
  return (
    <div className="flex">
      <TextEffect
        className="text-xl font-bold"
        preset="fade-in-blur"
        per="word"
        delay={0.5}
      >
        Keiretsu.The open innovation platform  
      </TextEffect>
    </div>
  );
};

export default TransitionText;
