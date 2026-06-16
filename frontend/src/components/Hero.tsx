import React from 'react';
import { MdPlayArrow, MdInfoOutline } from 'react-icons/md';

const Hero: React.FC = () => {
  return (
    <section className="relative h-[90vh] w-full flex items-center justify-start overflow-hidden pt-20 group">
      {/* Background with Blur & Gradients */}
      <div className="absolute inset-0 z-0">
        {/* Blurred background fills everything */}
        <img
          src="/heroImage.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60 transition-transform duration-[10000ms] group-hover:scale-125"
        />
        {/* Clean image sits on top, fully visible */}
        <img
          src="/heroImage.webp"
          alt="Beautiful Lady in Studio"
          fetchPriority="high"
          className="relative w-full h-full object-contain object-center z-10 transition-transform duration-[10000ms] group-hover:scale-105"
        />
        {/* Overlays stay on top */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
      </div>
      {/* Content */}
      <div className="relative z-10 px-4 md:px-12 max-w-4xl">
        <div className="flex items-center gap-2 mb-4 animate-fade-in-up stagger-1 opacity-0">
          <span className="w-8 h-[2px] bg-primary"></span>
          <span className="text-primary font-bold tracking-widest text-sm uppercase">Original Series</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tighter drop-shadow-2xl animate-fade-in-up stagger-2 opacity-0">
          ARBAN <br />
          <span className="text-primary text-gradient">STREAM</span>
        </h1>

        <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-xl leading-relaxed drop-shadow-md animate-fade-in-up stagger-3 opacity-0">
          <span className="font-bold">Your daily dose of expert voices.</span> <br />
          Discover the untold stories of Kenya's professionals. <br />
          Stream the expert voices that feed your curiosity, whatever that is today.
        </p>

        <div className="flex items-center gap-4 animate-fade-in-up stagger-4 opacity-0">
          <button className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-8 py-3 rounded font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(229,9,20,0.3)] hover:shadow-[0_8px_30px_rgba(229,9,20,0.5)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary outline-none">
            <MdPlayArrow className="text-2xl" /> Play
          </button>
          <button className="flex items-center gap-2 bg-secondary/80 hover:bg-secondary text-foreground px-8 py-3 rounded font-bold transition-all duration-300 backdrop-blur-md border border-white/10 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground outline-none">
            <MdInfoOutline className="text-2xl" /> More Info
          </button>
        </div>

        <div className="flex items-center gap-4 pt-4 md:pt-8 text-lg font-bold italic">
          <div>
            <p> Listen.</p>
          </div>
          <div>
            <p> Learn.</p>
          </div>
          <div>
            <p> Connect.</p>
          </div>


        </div>
      </div>

      {/* Bottom fade for smooth transition to content */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
