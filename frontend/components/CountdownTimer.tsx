import React, { useState, useEffect } from 'react';

export const CountdownTimer: React.FC = () => {
  const targetDate = new Date('2026-07-18T19:00:00').getTime();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="text-3xl md:text-5xl font-serif mb-1 font-light tracking-tighter">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/60 font-medium">
        {label}
      </div>
    </div>
  );

  return (
    <div className="flex gap-8 md:gap-12 mt-12 animate-fadeIn delay-300">
      <TimeUnit value={timeLeft.days} label="Dias" />
      <div className="w-px h-10 bg-white/20 self-center"></div>
      <TimeUnit value={timeLeft.hours} label="Horas" />
      <div className="w-px h-10 bg-white/20 self-center"></div>
      <TimeUnit value={timeLeft.minutes} label="Min" />
      <div className="w-px h-10 bg-white/20 self-center"></div>
      <TimeUnit value={timeLeft.seconds} label="Seg" />
    </div>
  );
};
