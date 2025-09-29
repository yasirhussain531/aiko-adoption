import { useEffect, useMemo, useState } from 'react';
import './App.css';

const DISCORD_DM_ENDPOINT = import.meta.env.VITE_DISCORD_DM_ENDPOINT;
const DISCORD_DM_MESSAGE = 'Yes the cat have been adopted';

const createCarouselImages = () => [
  {
    src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
    alt: 'Curious tabby cat looking up',
  },
  {
    src: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=800&q=80',
    alt: 'Playful orange kitten lying on a blanket',
  },
  {
    src: 'https://images.unsplash.com/photo-1510337550647-e84f83e341ca?auto=format&fit=crop&w=800&q=80',
    alt: 'Gray cat sitting on a windowsill',
  },
];

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const [discordStatus, setDiscordStatus] = useState('idle');
  const [discordError, setDiscordError] = useState('');

  const catImages = useMemo(() => createCarouselImages(), []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => clearTimeout(timeout);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((index) => (index === 0 ? catImages.length - 1 : index - 1));
  };

  const goToNext = () => {
    setCurrentIndex((index) => (index === catImages.length - 1 ? 0 : index + 1));
  };

  const notifyDiscord = async () => {
    if (!DISCORD_DM_ENDPOINT) {
      throw new Error('Missing VITE_DISCORD_DM_ENDPOINT environment variable');
    }

    const response = await fetch(DISCORD_DM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: DISCORD_DM_MESSAGE }),
    });

    if (!response.ok) {
      throw new Error('Discord notification failed');
    }
  };

  const handleYesClick = async () => {
    setActiveModal('yes');
    setDiscordStatus('pending');
    setDiscordError('');

    try {
      await notifyDiscord();
      setDiscordStatus('success');
    } catch (error) {
      setDiscordStatus('error');
      setDiscordError(error.message);
      console.error('Failed to send Discord DM', error);
    }
  };

  const handleNoClick = () => {
    setActiveModal('no');
  };

  const closeModal = () => {
    setActiveModal(null);
    setDiscordStatus('idle');
    setDiscordError('');
  };

  if (isLoading) {
    return (
      <div className="loader" role="status" aria-live="polite">
        <div className="spinner-cat" role="img" aria-label="Spinning cat">🐱</div>
        <p>Finding the purrfect match...</p>
      </div>
    );
  }

  const { src, alt } = catImages[currentIndex];

  return (
    <div className="app">
      <header className="hero">
        <h1>Will you adopt me?</h1>
        <p>Swipe through my favorite glamour shots and make your choice.</p>
      </header>

      <section className="carousel" aria-roledescription="carousel">
        <button
          type="button"
          className="carousel__control"
          onClick={goToPrevious}
          aria-label="Show previous cat photo"
        >
          ‹
        </button>

        <figure className="carousel__image-wrapper">
          <img src={src} alt={alt} className="carousel__image" />
          <figcaption>{alt}</figcaption>
        </figure>

        <button
          type="button"
          className="carousel__control"
          onClick={goToNext}
          aria-label="Show next cat photo"
        >
          ›
        </button>
      </section>

      <div className="carousel__dots" role="tablist" aria-label="Cat photo selectors">
        {catImages.map((image, index) => (
          <button
            key={image.src}
            type="button"
            className={`carousel__dot ${index === currentIndex ? 'carousel__dot--active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Show cat photo ${index + 1}`}
            aria-selected={index === currentIndex}
            role="tab"
          />
        ))}
      </div>

      <div className="actions">
        <button type="button" className="btn btn--yes" onClick={handleYesClick}>
          Yes
        </button>
        <button type="button" className="btn btn--no" onClick={handleNoClick}>
          No
        </button>
      </div>

      {activeModal && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="catModalTitle">
          <div
            className={`modal__content ${
              activeModal === 'yes' ? 'modal__content--happy' : 'modal__content--comfort'
            }`}
          >
            <button type="button" className="modal__close" onClick={closeModal} aria-label="Close">
              ×
            </button>

            {activeModal === 'yes' ? (
              <>
                <div className="modal__emoji" role="img" aria-hidden="true">
                  😻
                </div>
                <h2 id="catModalTitle">You have agreed to adopt me!</h2>
                <p>
                  You are getting all the essentials to take care of me from Yasir. I just want only one
                  thing and that is your love.
                </p>
                <div className="modal__status" role="status">
                  {discordStatus === 'pending' && 'Letting Yasir know on Discord...'}
                  {discordStatus === 'success' && 'Message delivered straight to Yasir\'s DMs. 💌'}
                  {discordStatus === 'error' && (
                    <span>
                      We couldn&apos;t reach Discord. Please check your configuration and try again.
                      {discordError ? ` (${discordError})` : ''}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="modal__emoji" role="img" aria-hidden="true">
                  😿
                </div>
                <h2 id="catModalTitle">It&apos;s okay, I&apos;ll find a new home.</h2>
                <p>Don&apos;t worry about me, I know the purrfect family is still out there.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
