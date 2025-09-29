import { useEffect, useMemo, useState } from 'react';
import './App.css';


const ADOPTION_EMAIL_ENDPOINT = import.meta.env.VITE_ADOPTION_EMAIL_ENDPOINT;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const ADOPTION_EMAIL_SUBJECT = 'Yes, the cat has been adopted!';
const ADOPTION_EMAIL_BODY =
  'Great news! Someone just agreed to adopt the cat. Please reach out to coordinate the essentials.';

const EMAIL_ADDRESS = 'adoptions@example.com';


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
  const [emailStatus, setEmailStatus] = useState('idle');
  const [emailError, setEmailError] = useState('');
  const [showModal, setShowModal] = useState(false);


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


  const sendAdoptionEmail = async () => {
    if (ADOPTION_EMAIL_ENDPOINT) {
      const response = await fetch(ADOPTION_EMAIL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: ADOPTION_EMAIL_SUBJECT,
          body: ADOPTION_EMAIL_BODY,
        }),
      });

      if (!response.ok) {
        throw new Error('Email notification failed');
      }

      return;
    }

    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            subject: ADOPTION_EMAIL_SUBJECT,
            message: ADOPTION_EMAIL_BODY,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('EmailJS notification failed');
      }

      return;
    }

    throw new Error(
      'Missing adoption notification configuration. Set VITE_ADOPTION_EMAIL_ENDPOINT or the EmailJS environment variables.'
    );
  };

  const handleYesClick = async () => {
    setActiveModal('yes');
    setEmailStatus('pending');
    setEmailError('');

    try {
      await sendAdoptionEmail();
      setEmailStatus('success');
    } catch (error) {
      setEmailStatus('error');
      setEmailError(error.message);
      console.error('Failed to send adoption email', error);
    }
  };

  const handleNoClick = () => {
    setActiveModal('no');
  };

  const closeModal = () => {
    setActiveModal(null);
    setEmailStatus('idle');
    setEmailError('');
  };

  const handleYesClick = () => {
    const subject = encodeURIComponent('Cat Adoption Confirmation');
    const body = encodeURIComponent('Yes, the cat has been adopted!');
    window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;
  };

  const handleNoClick = () => {
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

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
                  {emailStatus === 'pending' && 'Sending the adoption email to Yasir...'}
                  {emailStatus === 'success' && "Email delivered! Yasir knows the cat's been adopted. 💌"}
                  {emailStatus === 'error' && (
                    <span>
                      We couldn&apos;t send the email. Please check your configuration and try again.
                      {emailError ? ` (${emailError})` : ''}
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

      {showModal && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="sadCatTitle">
          <div className="modal__content">
            <button type="button" className="modal__close" onClick={closeModal} aria-label="Close">
              ×
            </button>
            <div className="modal__emoji" role="img" aria-hidden="true">
              😿
            </div>
            <h2 id="sadCatTitle">It&apos;s okay, I&apos;ll find a new home.</h2>
            <p>Don&apos;t worry about me, I know the purrfect family is still out there.</p>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;
