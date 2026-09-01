import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Cosmyra from './Cosmyra';
import Auth from './Auth';

function App() {
window.scrollTo(0, 0);
  const canvasRef = useRef(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [page, setPage] = useState("landing");
  const [, setUser] = useState(null);

  function handleAuth(user) {
    setUser(user);
    setPage("app");
  }



  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    function initStars() {
      stars = [];
      const count = Math.floor((canvas.width * canvas.height) / 3000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.2 + 0.2,
          o: Math.random() * 0.7 + 0.1,
          speed: Math.random() * 0.0008 + 0.0002,
          phase: Math.random() * Math.PI * 2
        });
      }
    }
    function drawStars(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        const opacity = s.o * (0.6 + 0.4 * Math.sin(t * s.speed * 1000 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(232,223,200," + opacity + ")";
        ctx.fill();
      });
      animId = requestAnimationFrame(drawStars);
    }
    window.addEventListener('resize', () => { resize(); initStars(); });
    resize();
    initStars();
    animId = requestAnimationFrame(drawStars);
    return () => cancelAnimationFrame(animId);
  }, []);

  if (page === "auth") {
    return (
      <div className="app">
        <canvas ref={canvasRef} className="starfield" />
        <Auth onAuth={handleAuth} />
      </div>
    );
  }

  if (page === "app") {
    return (
      <div className="app">
        <canvas ref={canvasRef} className="starfield" />
        <nav className="nav">
          <a className="nav-logo" href="/">Soular</a>
        </nav>
        <section className="section" style={{paddingTop: "8rem"}}>
          <p className="section-label">Ask YOUR Stars</p>
          <h2 className="section-title">Cosmyra is waiting</h2>
          <Cosmyra />
        </section>
      </div>
    );
  }

  return (
    <div className="app">
      <canvas ref={canvasRef} className="starfield" />

      <nav className="nav">
        <a className="nav-logo" href="/">Soular</a>
        <ul className="nav-links">
          <li><a href="#features">How it works</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="/signup" className="nav-cta">Begin your journey</a></li>
        </ul>
      </nav>

      <section className="hero">
        <div className="hero-orbit" />
        <div className="hero-orbit hero-orbit-2" />
        <h1 className="hero-brand">Soular</h1>
        <p className="hero-tagline">
          <span>Your soul.</span> &nbsp;✦&nbsp; <span>Your stars.</span> &nbsp;✦&nbsp; <span>Your journey.</span>
        </p>
        <p className="hero-eyebrow">Astrology · Human Design · AI Insight</p>
        <div className="hero-feature-name">Ask <em>YOUR</em> Stars</div>
        <div className="hero-actions">
          <a href="/signup" onClick={(e) => { e.preventDefault(); setPage("auth"); }} className="btn-primary">Discover what YOUR stars say</a>
          <a href="#features" className="btn-ghost">See how it works</a>
        </div>
        <p className="hero-trial">72 hours free &nbsp;·&nbsp; no credit card required</p>
      </section>

      <section className="section" id="features">
        <p className="section-label">What is Soular</p>
        <h2 className="section-title">Not your average horoscope app.</h2>
        <p className="value-prop">You were born under a specific sky. Soular decodes it — giving you personalized guidance from your natal chart and Human Design, whenever you need it.</p>
        <div className="cosmyra-section">
          <img src="/oracle1.png" alt="Cosmyra — your celestial guide" className="cosmyra-image" />
          <div className="cosmyra-intro">
            <p className="cosmyra-name">Meet Cosmyra</p>
            <p className="cosmyra-desc">She is the conduit between you and the cosmos. Ancient, honored, and deeply trusted — she receives your questions as sacred and answers with the wisdom of the stars that were arranged just for you. She never predicts. She never commands. She opens doors that you get to choose to walk through.</p>
            <p className="cosmyra-whisper">"I have been waiting for your question."</p>
          </div>
        </div>
        <p className="section-sub">Soular knows your exact birth chart and uses AI to translate it into guidance that speaks directly to your life, your questions, your moment.</p>
        <div className="pillars">
          <div className="pillar">
            <span className="pillar-glyph">☽</span>
            <h3 className="pillar-title">Your natal chart</h3>
            <p className="pillar-text">Every planet, every house, calculated to the minute of your birth. Not a Sun sign generalization — your actual cosmic fingerprint.</p>
          </div>
          <div className="pillar">
            <span className="pillar-glyph">✦</span>
            <h3 className="pillar-title">Ask YOUR Stars</h3>
            <p className="pillar-text">Type any question and receive a response woven from your unique chart. This is astrology that actually knows you.</p>
          </div>
          <div className="pillar">
            <span className="pillar-glyph">◈</span>
            <h3 className="pillar-title">Human Design</h3>
            <p className="pillar-text">Your bodygraph reveals your energy type, strategy, and authority. The operating manual you were never given.</p>
          </div>
        </div>
      </section>

      <section className="section" id="ask">
        <p className="section-label">Ask YOUR Stars</p>
        <h2 className="section-title">What would you like to know?</h2>
        <p className="section-sub">Cosmyra is waiting. Type your question and let the stars speak directly to you.</p>
        <Cosmyra />
      </section>

      <section className="section" id="pricing">
        <p className="section-label">Begin your journey</p>
        <h2 className="section-title">Choose your path</h2>
        <p className="section-sub">Start free for 72 hours. No credit card. No commitment. Just you and your stars.</p>
        <div className="billing-toggle">
          <span className={"btog-label" + (!isAnnual ? " on" : "")}>Monthly</span>
          <div className={"btog-track" + (isAnnual ? " annual" : "")} onClick={() => setIsAnnual(!isAnnual)}>
            <div className="btog-thumb" />
          </div>
          <span className={"btog-label" + (isAnnual ? " on" : "")}>Annual</span>
          {isAnnual && <span className="btog-save">2 months free</span>}
        </div>
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="plan-name">Stargazer</div>
            <div className="plan-price">$0</div>
            <div className="plan-period">72-hour free trial · no card needed</div>
            <ul className="plan-features">
              <li>Your natal chart generated</li>
              <li>3 Ask YOUR Stars questions</li>
              <li>1 daily horoscope preview</li>
            </ul>
            <a href="/signup" className="plan-btn outline">Start free trial</a>
          </div>
          <div className="pricing-card featured">
            <div className="featured-tag">Most popular</div>
            <div className="plan-name">Cosmic</div>
            <div className="plan-price">{isAnnual ? "$10" : "$12"}<span>/mo</span></div>
            <div className="plan-period">{isAnnual ? "Billed $120 annually · save $24" : "Billed monthly"}</div>
            <ul className="plan-features">
              <li>Your natal chart · always available</li>
              <li>Daily personalized horoscope</li>
              <li>10 Ask YOUR Stars questions/month</li>
              <li>Question history saved</li>
            </ul>
            <a href="/signup" onClick={(e) => { e.preventDefault(); setPage("auth"); }} className="plan-btn solid">Begin your journey</a>
          </div>
          <div className="pricing-card">
            <div className="plan-name">Oracle</div>
            <div className="plan-price">{isAnnual ? "$20" : "$24"}<span>/mo</span></div>
            <div className="plan-period">{isAnnual ? "Billed $240 annually · save $48" : "Billed monthly"}</div>
            <ul className="plan-features">
              <li>Everything in Cosmic</li>
              <li>Unlimited Ask YOUR Stars questions</li>
              <li>Human Design bodygraph</li>
              <li>3 friend and family charts</li>
            </ul>
            <a href="/signup" className="plan-btn outline">Go Oracle</a>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-ring">
          <div className="cta-glyph">☽</div>
        </div>
        <h2 className="cta-title">The stars have been waiting<br/>to speak with you.</h2>
        <p className="cta-sub">72 hours free. No card. Just your birth data and an open question.</p>
        <a href="/signup" onClick={(e) => { e.preventDefault(); setPage("auth"); }} className="btn-primary">Discover what YOUR stars say</a>
      </section>

      <footer className="footer">
        <div className="footer-logo">Soular</div>
        <div className="footer-text">Your soul. Your stars. Your journey. · © 2025 Soular</div>
        <div className="footer-text">Made with love and cosmic intention</div>
      </footer>
    </div>
  );
}

export default App;
