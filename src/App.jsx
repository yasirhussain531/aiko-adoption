import { useEffect, useMemo, useState } from 'react';
import './App.css';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const ADOPTION_EMAIL_SUBJECT = 'Yes, the cat has been adopted!';
const ADOPTION_EMAIL_BODY =
  'Great news! Someone just agreed to adopt the cat. Please reach out to coordinate the essentials.';

const createCarouselImages = () => [
  {
    src: 'https://ik.imagekit.io/kappx0fk6/aiko1.jfif?updatedAt=1759173563906',
    alt: 'Issey bhetr option hai sobhu k liye koi appke pass?',
  },
  {
    src: 'https://ik.imagekit.io/kappx0fk6/aiko4.jfif?updatedAt=1759173563152',
    alt: 'Appki Boba Cat , Khuwab dekh kitney barey hain meri ankhon mai!',
  },
  {
    src: 'https://ik.imagekit.io/kappx0fk6/aiko3.jfif?updatedAt=1759173563336',
    alt: 'Sobhu ki maybe dulhan ban jaon?',
  },
  {
    src: 'https://ik.imagekit.io/kappx0fk6/aiko2.jfif?updatedAt=1759173564010',
    alt: 'I can smell Sobhu ki khushboo, app mujhey apni zindagi mai shamil karengi?',
  },
];

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const [emailStatus, setEmailStatus] = useState('idle');
  const [emailError, setEmailError] = useState('');

  const catImages = useMemo(() => createCarouselImages(), []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 4800);
    return () => clearTimeout(timeout);
  }, []);

  const goToPrevious = () =>
    setCurrentIndex((index) => (index === 0 ? catImages.length - 1 : index - 1));

  const goToNext = () =>
    setCurrentIndex((index) => (index === catImages.length - 1 ? 0 : index + 1));

  // ---- EmailJS Logic Only ----
  const sendAdoptionEmail = async () => {
    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_PUBLIC_KEY,
    template_params: {
      email: "hyperbit531@gmail.com", 
      subject: ADOPTION_EMAIL_SUBJECT,
      message: ADOPTION_EMAIL_BODY,
    },
  }),
});

if (!response.ok) {
  const errorText = await response.text();
  console.error("EmailJS API error:", errorText);
  throw new Error('EmailJS notification failed');
}

      return;
    }

    throw new Error(
      'Missing EmailJS configuration. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY.'
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

  if (isLoading) {
    return (
      <div className="loader" role="status" aria-live="polite">
        <div className="spinner-cat" role="img" aria-label="Spinning cat">🐱</div>
        <p>Assalam Walikum Bushraa , Appse Ek bohot Ehem Sawal ha mera</p>
      </div>
    );
  }

  const { src, alt } = catImages[currentIndex];

  return (
    <div className="app">
      <header className="hero">
        <h1>Kiya App Mujey Appney Sobhu Ki Dulhan Banaogi?</h1>
        <p>Am i good enough for you? Meri Ankhein Dekhein App</p>
      </header>

      <section className="carousel" aria-roledescription="carousel">
        <button type="button" className="carousel__control" onClick={goToPrevious} aria-label="Show previous cat photo">
          ‹
        </button>

        <figure className="carousel__image-wrapper">
          <img src={src} alt={alt} className="carousel__image" />
          <figcaption>{alt}</figcaption>
        </figure>

        <button type="button" className="carousel__control" onClick={goToNext} aria-label="Show next cat photo">
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
                <h2 id="catModalTitle">JazakhAllah, Bushraa! Appne mujey goud leliya!</h2>
                <p>
                  Tension not , Essentials saari cheezein appko milengi bas appse mujey appka pyar chaiye , milega?
                </p>
                <div className="modal__status" role="status">
                  {emailStatus === 'pending' && 'Yasir ko yeh pyari khabar bhj wa rhi houn... 📨'}
                  {emailStatus === 'success' && "Email delivered! Yasir ko pata chal gaya. Woh jald Saara Saman Ponchwaiga 💌"}
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
                <h2 id="catModalTitle">Koi baat nhi, Mera naseeb kahin aur likha hoga</h2>
                <p>Tension hi nahi ustad, I know the purrfect family is still out there.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
