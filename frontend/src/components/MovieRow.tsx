import React from 'react';
import { MdChevronLeft, MdChevronRight, MdPlayCircleOutline, MdAddCircleOutline, MdShare } from 'react-icons/md';
import WatchNow from './WatchNow';
import type { Movie } from '../types';


interface MovieRowProps {
  title: string;
  movies: Movie[];
  onSelect: (movie: Movie) => void;
  showWatchNow?: boolean;
}
const MovieCard: React.FC<{
  movie: Movie;
  onSelect: (movie: Movie) => void;
  showWatchNow?: boolean;
}> = ({ movie, onSelect, showWatchNow = true }) => {

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}?video=${movie.id}`;
    if (navigator.share) {
      navigator.share({ title: movie.title, url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-col w-[280px] md:w-[360px] flex-shrink-0">
      <div
        onClick={() => onSelect(movie)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(movie); } }}
        tabIndex={0}
        className="group relative w-full aspect-video rounded-md overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-1 hover:z-20 hover:shadow-2xl hover:shadow-primary/20 bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2"
        role="button"
        aria-label={`Select ${movie.title}`}
      >
        <div className="absolute inset-0 bg-secondary animate-pulse" />
        <img
          src={movie.image}
          alt={movie.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onLoad={(e) => {
            (e.target as HTMLImageElement).previousElementSibling?.remove();
          }}
        />
        {/* Hover Overlay */}

        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h4 className="text-white font-bold text-sm md:text-base mb-2 line-clamp-1">{movie.title}</h4>
          <div className="flex items-center gap-3">
            <button className="text-white hover:text-primary transition-colors">
              <MdPlayCircleOutline className="text-3xl" />
            </button>
            <button className="text-white hover:text-primary transition-colors">
              <MdAddCircleOutline className="text-3xl" />
            </button>
            <button
              onClick={handleShare}
              className="text-white hover:text-primary transition-colors"
              aria-label="Share"
            >
              <MdShare className="text-2xl" />
            </button>
            <span className="ml-auto text-xs font-bold text-green-500">{movie.rating || '98% Match'}</span>
          </div>
        </div>
      </div>

      {showWatchNow && <WatchNow onClick={() => onSelect(movie)} />}
    </div>
  );
};

const MovieRow: React.FC<MovieRowProps & { autoPlay?: boolean }> = ({ title, movies, onSelect, showWatchNow = true, autoPlay = true }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  // Clone movies for infinite effect
  const infiniteMovies = [...movies, ...movies, ...movies];

  React.useEffect(() => {
    // Initial scroll to the middle set to allow left scrolling immediately
    if (scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 3;
        }
      }, 100);
    }
  }, [movies]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const oneThird = scrollWidth / 3;

      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollRef.current.scrollLeft = scrollLeft - oneThird;
      } else if (scrollLeft <= 10) {
        scrollRef.current.scrollLeft = scrollLeft + oneThird;
      }
    }
  };

  const scroll = React.useCallback((direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  }, []);

  React.useEffect(() => {
    if (!autoPlay || isHovered) return;
    const interval = setInterval(() => scroll('right'), 5000);
    return () => clearInterval(interval);
  }, [autoPlay, isHovered, scroll]);

  return (
    <section
      className="relative mb-12 px-4 md:px-12 group/row"
      onMouseEnter={() => {
        setShowControls(true);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setShowControls(false);
        setIsHovered(false);
      }}
    >
      <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3 text-foreground">
        {title}
        <span className="w-12 h-[2px] bg-primary group-hover/row:w-24 transition-all duration-500"></span>
      </h2>
      <div className="relative">
        {showControls && (
          <>
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/80 text-white p-2 h-full transition-all duration-300 backdrop-blur-sm"
              aria-label="Scroll Left"
            >
              <MdChevronLeft className="text-4xl" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/80 text-white p-2 h-full transition-all duration-300 backdrop-blur-sm"
              aria-label="Scroll Right"
            >
              <MdChevronRight className="text-4xl" />
            </button>
          </>
        )}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-4"
        >
          {infiniteMovies.map((movie, idx) => (
            <MovieCard key={`${movie.id}-${idx}`} movie={movie} onSelect={onSelect} showWatchNow={showWatchNow} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieRow;