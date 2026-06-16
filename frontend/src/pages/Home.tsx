
import { useState } from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import PaymentModal from '../components/PaymentModal';
import { HARDCODED_MEETUP, HARDCODED_PLAYLISTS, IMPACT_360, WALKING_WITH_RUTH, SMART_PARENT, FOUNDER_SERIES } from '../data/playlists';
import type { Movie } from '../types';

const Home = () => {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    const handleMovieSelect = (movie: Movie) => {
        setSelectedMovie(movie);
        setIsPaymentOpen(true);
    };

    return (
        <>
            <Hero />

            <div id="browse" className="relative z-10 py-12 md:py-20">
                <MovieRow title="Trending Now" movies={HARDCODED_PLAYLISTS} onSelect={handleMovieSelect} />
            </div>

            <div id="live_talks" className="relative z-10 py-12 md:py-20">
                <MovieRow title="Live Talks" movies={[...HARDCODED_PLAYLISTS].reverse()} onSelect={handleMovieSelect} />
            </div>

            <div id="founder_series" className="relative z-10 py-12 md:py-20">
                <MovieRow title="Founder Series" movies={[...FOUNDER_SERIES].reverse()} onSelect={handleMovieSelect} />
            </div>

            <div id="smart_parent" className="relative z-10 py-12 md:py-20">
                <MovieRow title="Smart Parent" movies={[...SMART_PARENT].reverse()} onSelect={handleMovieSelect} />
            </div>

            <div id="walking_with_ruth" className="relative z-10 py-12 md:py-20">
                <MovieRow title="Walking with Dr.Ruth" movies={[...WALKING_WITH_RUTH].reverse()} onSelect={handleMovieSelect} />
            </div>

            <div id="impact_360" className="relative z-10 py-12 md:py-20">
                <MovieRow title="Impact 360 Conference" movies={[...IMPACT_360].reverse()} onSelect={handleMovieSelect} />
            </div>


            <div id="meet_your_speaker" className="relative z-10 py-12 md:py-20">
                <MovieRow title="Meet Your Speaker" movies={[...HARDCODED_MEETUP].reverse()} onSelect={handleMovieSelect} />
            </div>

            <div id="monetize_your_work" className="relative z-10 py-12 md:py-20">
                <MovieRow
                    title="Monetize Your Work"
                    movies={HARDCODED_MEETUP}
                    onSelect={handleMovieSelect}
                    showWatchNow={false}
                />
            </div>

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                playlistName={selectedMovie?.title}
                price={600}
            />
        </>
    );
};

export default Home;