@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

.gd-page {
  --gd-blue: #007f8f;
  --gd-black: #080b0c;
  --gd-white: #f7f9f9;

  background: var(--gd-black);
  color: var(--gd-white);
  font-family: 'Space Grotesk', sans-serif;
  overflow: hidden;
}

.gd-page *,
.gd-page *::before,
.gd-page *::after {
  box-sizing: border-box;
}

.gd-page a {
  color: inherit;
  text-decoration: none;
}

/* NAVIGATION */

.gd-nav {
  height: 82px;
  padding: 0 6%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.15);
  position: relative;
  z-index: 5;
}

.gd-logo {
  font-size: 27px;
  font-weight: 700;
  letter-spacing: -2px;
}

.gd-logo span {
  font-size: 11px;
  vertical-align: top;
  margin-left: 3px;
}

.gd-nav-label,
.gd-nav-cta {
  font-size: 11px;
  letter-spacing: 1.5px;
}

.gd-nav-cta {
  border: 1px solid rgba(255,255,255,0.5);
  padding: 12px 18px;
  transition: 0.3s ease;
}

.gd-nav-cta:hover {
  background: var(--gd-blue);
  border-color: var(--gd-blue);
}

/* HERO */

.gd-hero {
  min-height: 760px;
  padding: 35px 6% 70px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.gd-hero-top,
.gd-hero-bottom {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.gd-hero-top,
.gd-eyebrow,
.gd-hero-bottom,
.gd-scroll {
  font-size: 11px;
  letter-spacing: 1.5px;
}

.gd-hero-content {
  position: relative;
  z-index: 2;
  margin: 80px 0;
}

.gd-eyebrow {
  color: var(--gd-blue);
  margin-bottom: 25px;
}

.gd-hero-title {
  font-size: clamp(65px, 11vw, 155px);
  line-height: 0.82;
  letter-spacing: -0.09em;
  font-weight: 700;
  margin: 0;
}

.gd-hero-title > span:not(.gd-outline) {
  color: var(--gd-blue);
}

.gd-outline {
  color: transparent;
  -webkit-text-stroke: 1.5px var(--gd-white);
}

.gd-hero-bottom {
  margin-top: 55px;
  align-items: flex-end;
}

.gd-hero-bottom p {
  max-width: 330px;
  font-size: 14px;
  line-height: 1.8;
  letter-spacing: 0;
  color: rgba(255,255,255,0.7);
}

.gd-scroll {
  padding-bottom: 10px;
}

.gd-scroll span {
  color: var(--gd-blue);
  margin-left: 12px;
}

.gd-hero-decoration {
  position: absolute;
  width: 260px;
  height: 260px;
  right: 8%;
  top: 25%;
  opacity: 0.5;
  pointer-events: none;
}

.gd-orbit {
  position: absolute;
  border: 1px solid var(--gd-blue);
  border-radius: 50%;
  inset: 0;
  animation: gd-rotate 18s linear infinite;
}

.gd-orbit-one {
  transform: scaleY(0.35) rotate(35deg);
}

.gd-orbit-two {
  transform: scaleY(0.35) rotate(-35deg);
  animation-direction: reverse;
}

.gd-orbit-center {
  position: absolute;
  inset: 40%;
  background: var(--gd-blue);
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 22px;
  font-weight: 700;
  animation: gd-pulse 3s ease-in-out infinite;
}

/* COMMON SECTION */

.gd-section {
  padding: 110px 8%;
}

.gd-section-label {
  display: flex;
  justify-content: space-between;
  padding-bottom: 22px;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  font-size: 11px;
  letter-spacing: 1.5px;
}

.gd-reveal {
  opacity: 0;
  transform: translateY(35px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.gd-reveal.gd-visible {
  opacity: 1;
  transform: translateY(0);
}

/* INTRO */

.gd-intro {
  background: var(--gd-white);
  color: var(--gd-black);
}

.gd-intro .gd-section-label {
  border-color: rgba(0,0,0,0.2);
}

.gd-intro-content {
  display: grid;
  grid-template-columns: 1.4fr 0.6fr;
  gap: 70px;
  align-items: end;
  padding-top: 85px;
}

.gd-intro-content h2 {
  font-size: clamp(42px, 6.5vw, 90px);
  line-height: 0.95;
  letter-spacing: -0.07em;
  margin: 0;
}

.gd-intro-content h2 span {
  color: var(--gd-blue);
}

.gd-intro-description {
  max-width: 350px;
}

.gd-plus {
  font-size: 38px;
  color: var(--gd-blue);
}

.gd-intro-description p {
  font-size: 14px;
  line-height: 1.9;
  color: #50595a;
}

/* SERVICES */

.gd-section-heading {
  font-size: clamp(45px, 7vw, 95px);
  line-height: 0.95;
  letter-spacing: -0.07em;
  margin: 80px 0 65px;
}

.gd-section-heading span {
  color: var(--gd-blue);
}

.gd-service {
  display: grid;
  grid-template-columns: 0.3fr 1.5fr 0.7fr 40px;
  align-items: center;
  gap: 25px;
  padding: 35px 0;
  border-top: 1px solid rgba(255,255,255,0.2);
  transition: padding 0.35s ease;
}

.gd-service:last-child {
  border-bottom: 1px solid rgba(255,255,255,0.2);
}

.gd-service:hover {
  padding-left: 18px;
}

.gd-service-number,
.gd-service-tag {
  font-size: 11px;
  letter-spacing: 1.5px;
  color: var(--gd-blue);
}

.gd-service-main h3 {
  font-size: clamp(23px, 3vw, 38px);
  margin: 0 0 10px;
}

.gd-service-main p {
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  max-width: 450px;
  line-height: 1.7;
  margin: 0;
}

.gd-service-arrow {
  font-size: 25px;
  transition: transform 0.3s ease;
}

.gd-service:hover .gd-service-arrow {
  transform: translate(5px, -5px);
  color: var(--gd-blue);
}

/* WORK */

.gd-work {
  background: var(--gd-white);
  color: var(--gd-black);
}

.gd-work .gd-section-label {
  border-color: rgba(0,0,0,0.2);
}

.gd-work-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 30px;
  margin: 70px 0;
}

.gd-work-heading h2 {
  font-size: clamp(45px, 7vw, 95px);
  line-height: 0.9;
  letter-spacing: -0.07em;
  margin: 0;
}

.gd-work-heading h2 span {
  color: var(--gd-blue);
}

.gd-work-heading p {
  max-width: 250px;
  font-size: 13px;
  line-height: 1.7;
  color: #555;
}

.gd-project-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.gd-project {
  min-width: 0;
}

.gd-project-top {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  font-size: 10px;
  letter-spacing: 1px;
}

.gd-project-art {
  min-height: 350px;
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.gd-project-blue .gd-project-art {
  background: var(--gd-blue);
  color: white;
}

.gd-project-white .gd-project-art {
  background: #e2e9e9;
  color: var(--gd-black);
}

.gd-project-dark .gd-project-art {
  background: var(--gd-black);
  color: white;
}

.gd-project-symbol {
  position: relative;
  z-index: 2;
  font-size: clamp(75px, 10vw, 140px);
  font-weight: 700;
  letter-spacing: -12px;
  transition: transform 0.5s ease;
}

.gd-project:hover .gd-project-symbol {
  transform: scale(1.2) rotate(-8deg);
}

.gd-project-shape {
  position: absolute;
  width: 190px;
  height: 190px;
  border: 1px solid currentColor;
  border-radius: 50%;
  transition: transform 0.7s ease;
}

.gd-project:hover .gd-project-shape {
  transform: scale(1.7) rotate(45deg);
}

.gd-project-info {
  padding: 20px 0;
}

.gd-project-info h3 {
  font-size: 21px;
  margin: 0 0 8px;
}

.gd-project-info span {
  font-size: 11px;
  color: #666;
}

/* STATEMENT */

.gd-statement {
  padding: 120px 8%;
  background: var(--gd-blue);
  position: relative;
  overflow: hidden;
}

.gd-statement-inner {
  position: relative;
  z-index: 1;
}

.gd-statement-inner > span {
  font-size: 11px;
  letter-spacing: 2px;
}

.gd-statement h2 {
  font-size: clamp(55px, 10vw, 135px);
  line-height: 0.9;
  letter-spacing: -0.08em;
  margin: 55px 0 0;
}

.gd-statement h2 span {
  color: var(--gd-black);
}

.gd-statement-mark {
  position: absolute;
  right: 5%;
  bottom: 0;
  font-size: 180px;
  opacity: 0.18;
  animation: gd-rotate 25s linear infinite;
}

/* PROCESS */

.gd-process-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.gd-process-card {
  border-top: 1px solid rgba(255,255,255,0.4);
  padding-top: 22px;
  position: relative;
}

.gd-process-card > span {
  font-size: 12px;
  color: var(--gd-blue);
}

.gd-process-card h3 {
  font-size: 27px;
  margin: 55px 0 15px;
}

.gd-process-card p {
  font-size: 13px;
  line-height: 1.8;
  color: rgba(255,255,255,0.6);
}

.gd-process-line {
  width: 0;
  height: 2px;
  background: var(--gd-blue);
  transition: width 0.5s ease;
}

.gd-process-card:hover .gd-process-line {
  width: 100%;
}

/* CTA */

.gd-cta {
  padding: 120px 8%;
  background: var(--gd-white);
  color: var(--gd-black);
}

.gd-cta > span {
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--gd-blue);
}

.gd-cta h2 {
  font-size: clamp(55px, 10vw, 135px);
  line-height: 0.9;
  letter-spacing: -0.08em;
  margin: 45px 0;
}

.gd-cta h2 span {
  color: var(--gd-blue);
}

.gd-cta > a {
  display: inline-flex;
  gap: 40px;
  align-items: center;
  background: var(--gd-blue);
  color: white;
  padding: 18px 25px;
  font-size: 12px;
  letter-spacing: 1px;
  transition: 0.3s ease;
}

.gd-cta > a:hover {
  background: var(--gd-black);
}

/* FOOTER */

.gd-footer {
  min-height: 100px;
  padding: 25px 6%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.gd-footer > span,
.gd-footer > a:last-child {
  font-size: 10px;
  letter-spacing: 1px;
}

/* ANIMATIONS */

@keyframes gd-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes gd-pulse {
  0%, 100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }
}

/* RESPONSIVE */

@media (max-width: 900px) {
  .gd-hero-decoration {
    width: 180px;
    height: 180px;
    right: 5%;
    top: 30%;
  }

  .gd-intro-content {
    grid-template-columns: 1fr;
    gap: 35px;
  }

  .gd-project-grid {
    grid-template-columns: 1fr 1fr;
  }

  .gd-process-grid {
    grid-template-columns: 1fr 1fr;
    row-gap: 45px;
  }
}

@media (max-width: 600px) {
  .gd-nav {
    height: 70px;
    padding: 0 5%;
  }

  .gd-nav-label {
    display: none;
  }

  .gd-hero {
    min-height: 650px;
    padding: 25px 6%;
  }

  .gd-hero-top {
    font-size: 9px;
  }

  .gd-hero-decoration {
    width: 130px;
    height: 130px;
    top: 32%;
    right: 5%;
  }

  .gd-hero-title {
    font-size: clamp(55px, 14vw, 85px);
  }

  .gd-hero-bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .gd-section {
    padding: 75px 6%;
  }

  .gd-section-label {
    font-size: 9px;
  }

  .gd-intro-content {
    padding-top: 55px;
  }

  .gd-service {
    grid-template-columns: 35px 1fr 25px;
    gap: 12px;
  }

  .gd-service-tag {
    display: none;
  }

  .gd-work-heading {
    flex-direction: column;
    align-items: flex-start;
  }

  .gd-project-grid {
    grid-template-columns: 1fr;
  }

  .gd-project-art {
    min-height: 300px;
  }

  .gd-statement {
    padding: 85px 6%;
  }

  .gd-process-grid {
    grid-template-columns: 1fr;
  }

  .gd-process-card h3 {
    margin-top: 25px;
  }

  .gd-cta {
    padding: 85px 6%;
  }

  .gd-footer {
    flex-wrap: wrap;
    padding: 25px 6%;
  }

  .gd-footer > span {
    display: none;
  }
}

/* REDUCED MOTION */

@media (prefers-reduced-motion: reduce) {
  .gd-page *,
  .gd-page *::before,
  .gd-page *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .gd-reveal {
    opacity: 1;
    transform: none;
  }
}