
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface VideoProject {
  id: number;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  accent: string;
}

const demoVideo =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const videoProjects: VideoProject[] = [
  {
    id: 1,
    title: "Motion in Bloom",
    category: "CINEMATIC",
    description: "A visual study of movement, color, and natural detail.",
    thumbnail:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85",
    videoUrl: demoVideo,
    accent: "#8be9fd",
  },
  {
    id: 2,
    title: "Beyond the Frame",
    category: "BRAND FILM",
    description: "A cinematic direction concept for modern brands.",
    thumbnail:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=85",
    videoUrl: demoVideo,
    accent: "#b7a5ff",
  },
  {
    id: 3,
    title: "Electric Dreams",
    category: "MOTION DESIGN",
    description: "An experimental visual concept driven by energy and rhythm.",
    thumbnail:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85",
    videoUrl: demoVideo,
    accent: "#ff9b85",
  },
  {
    id: 4,
    title: "A Different Perspective",
    category: "PRODUCT FILM",
    description: "A product-focused concept with a cinematic point of view.",
    thumbnail:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=85",
    videoUrl: demoVideo,
    accent: "#91e6b3",
  },
  {
    id: 5,
    title: "After Hours",
    category: "VISUAL STORY",
    description: "Atmosphere, contrast, and storytelling after dark.",
    thumbnail:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85",
    videoUrl: demoVideo,
    accent: "#ffd27d",
  },
  {
    id: 6,
    title: "Open Horizons",
    category: "TRAVEL FILM",
    description: "A journey through expansive landscapes and quiet moments.",
    thumbnail:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=85",
    videoUrl: demoVideo,
    accent: "#8be9fd",
  },
];

interface VideoGenerationHeroProps {
  title?: string;
  description?: string;
}

const ROTATION_SPEED = 42;

export default function VideoGenerationHero({
  title = "Video Generation",
  description =
    "We turn ideas into moving images — cinematic films, expressive motion, and visual stories designed to make people feel something.",
}: VideoGenerationHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] =
    useState<VideoProject | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const rotationRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const angleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const targetIndexRef = useRef(0);
  const previousTimeRef = useRef<number | null>(null);
  const hoveringRef = useRef(false);
  const selectedVideoRef = useRef<VideoProject | null>(null);

  const reducedMotion = useReducedMotion();
  const cardAngle = 360 / videoProjects.length;

  // Keep the latest interaction state available to the animation loop.
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    selectedVideoRef.current = selectedVideo;
  }, [selectedVideo]);

  // Find the nearest equivalent angle for a selected card.
  // This avoids a full-circle jump when moving between card 6 and card 1.
  const getNearestAngle = useCallback(
    (index: number, currentAngle: number) => {
      const baseAngle = -index * cardAngle;
      const fullTurns = Math.round(
        (currentAngle - baseAngle) / 360,
      );

      return baseAngle + fullTurns * 360;
    },
    [cardAngle],
  );

  // Request a smooth move to a particular card.
  const selectCard = useCallback(
    (index: number) => {
      const safeIndex =
        (index + videoProjects.length) % videoProjects.length;

      activeIndexRef.current = safeIndex;
      targetIndexRef.current = safeIndex;
      targetAngleRef.current = getNearestAngle(
        safeIndex,
        angleRef.current,
      );

    
      setActiveIndex(safeIndex);
    },
    [getNearestAngle],
  );

  // Continuous rotation with smooth manual selection and no timed pauses.
  useEffect(() => {
    const element = rotationRef.current;
    if (!element) return;

    let frameId = 0;

    const renderAngle = (angle: number) => {
      element.style.setProperty("--orbit-angle", `${angle}deg`);
    };

    const animate = (time: number) => {
      const previousTime = previousTimeRef.current;
      previousTimeRef.current = time;

      const delta =
        previousTime === null ? 0 : Math.min(time - previousTime, 40);

      const currentAngle = angleRef.current;
      const targetAngle = targetAngleRef.current;
      const difference = targetAngle - currentAngle;
      const videoIsOpen = Boolean(selectedVideoRef.current);

      if (reducedMotion) {
        const staticAngle = -activeIndexRef.current * cardAngle;
        angleRef.current = staticAngle;
        targetAngleRef.current = staticAngle;
        targetIndexRef.current = activeIndexRef.current;
        renderAngle(staticAngle);
      } else if (!videoIsOpen) {
        const maxStep = (ROTATION_SPEED * delta) / 1000;

        if (Math.abs(difference) > 0.05) {
          // Complete manual card/arrow movement even while hovered.
          const nextAngle =
            Math.abs(difference) <= maxStep
              ? targetAngle
              : currentAngle + Math.sign(difference) * maxStep;

          angleRef.current = nextAngle;
          renderAngle(nextAngle);

          if (Math.abs(targetAngle - nextAngle) < 0.001) {
            angleRef.current = targetAngle;
            renderAngle(targetAngle);
            activeIndexRef.current = targetIndexRef.current;
            setActiveIndex(targetIndexRef.current);
          }
        } else if (!hoveringRef.current && !isPaused) {
          // Rotate continuously; the angle is never reset at 360 degrees.
          const nextAngle = currentAngle - (ROTATION_SPEED * delta) / 1000;
          angleRef.current = nextAngle;
          targetAngleRef.current = nextAngle;
          renderAngle(nextAngle);

          // Keep the active title/counter in sync with the card at the front.
          const roundedIndex = Math.round(-nextAngle / cardAngle);
          const nextIndex =
            ((roundedIndex % videoProjects.length) + videoProjects.length) %
            videoProjects.length;

          if (nextIndex !== activeIndexRef.current) {
            activeIndexRef.current = nextIndex;
            targetIndexRef.current = nextIndex;
            setActiveIndex(nextIndex);
          }
        }
      }

      frameId = window.requestAnimationFrame(animate);
    };

    renderAngle(angleRef.current);
    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
      previousTimeRef.current = null;
    };
  }, [cardAngle, isPaused, reducedMotion]);

  // Close the player with Escape and prevent background scrolling.
  useEffect(() => {
    if (!selectedVideo) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedVideo(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedVideo]);

  const closePlayer = () => {
    setSelectedVideo(null);
  };

  const openVideo = (project: VideoProject, index: number) => {
    selectCard(index);
    selectedVideoRef.current = project;
    setSelectedVideo(project);
  };

  const moveSelection = (direction: number) => {
    const nextIndex =
      (activeIndexRef.current + direction + videoProjects.length) %
      videoProjects.length;

    selectCard(nextIndex);
  };

  return (
    <section className="video-generation-hero">
      <style>{`
        .video-generation-hero {
          --video-cyan: #79e8f7;
          position: relative;
          min-height: min(900px, 100svh);
          overflow: hidden;
          isolation: isolate;
          padding: clamp(110px, 13vh, 150px) clamp(20px, 6vw, 96px) 48px;
          color: #f4f7fb;
          background:
            radial-gradient(ellipse at 50% 52%, rgba(25,109,132,.18), transparent 42%),
            radial-gradient(ellipse at 85% 12%, rgba(67,87,140,.13), transparent 30%),
            #080b10;
          font-family: inherit;
        }

        .video-generation-hero *,
        .video-generation-hero *::before,
        .video-generation-hero *::after {
          box-sizing: border-box;
        }

        .video-generation-hero button {
          font: inherit;
        }

        .video-generation-hero .video-noise {
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          opacity: .16;
          background-image: radial-gradient(rgba(255,255,255,.3) .55px, transparent .55px);
          background-size: 5px 5px;
          mask-image: linear-gradient(to bottom, black, transparent 85%);
        }

        .video-generation-hero .video-topline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: clamp(38px, 6vh, 64px);
          color: rgba(232,240,247,.58);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        .video-generation-hero .video-status {
          display: inline-flex;
          align-items: center;
          gap: 9px;
        }

        .video-generation-hero .video-status::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--video-cyan);
          box-shadow: 0 0 12px var(--video-cyan);
        }

        .video-generation-hero .video-heading {
          position: relative;
          z-index: 2;
          max-width: 790px;
          margin: 0 auto;
          text-align: center;
        }

        .video-generation-hero .video-eyebrow {
          margin: 0 0 17px;
          color: var(--video-cyan);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .28em;
          text-transform: uppercase;
        }

        .video-generation-hero .video-heading h1 {
          margin: 0;
          font-size: clamp(43px, 7.3vw, 100px);
          font-weight: 500;
          letter-spacing: -.075em;
          line-height: .98;
          text-wrap: balance;
        }

        .video-generation-hero .video-heading p {
          max-width: 570px;
          margin: 22px auto 0;
          color: rgba(232,240,247,.62);
          font-size: clamp(13px, 1.15vw, 15px);
          line-height: 1.8;
        }

        .video-generation-hero .video-gallery {
          position: relative;
          width: min(100%, 1000px);
          height: clamp(300px, 42vw, 470px);
          margin: 8px auto 0;
          perspective: 1100px;
        }

        .video-generation-hero .video-orbit {
          --orbit-angle: 0deg;
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          transform: rotateY(var(--orbit-angle));
          will-change: transform;
        }

        .video-generation-hero .video-orbit-card {
          --card-angle: 0deg;
          --card-accent: var(--video-cyan);
          position: absolute;
          top: 50%;
          left: 50%;
          width: clamp(140px, 20vw, 218px);
          padding: 0;
          overflow: hidden;
          text-align: left;
          border: 1px solid rgba(255,255,255,.17);
          border-radius: 12px;
          background: #101821;
          box-shadow: 0 22px 70px rgba(0,0,0,.42);
          cursor: pointer;
          backface-visibility: hidden;
          transform-style: preserve-3d;
          transition:
            border-color .35s ease,
            box-shadow .35s ease,
            filter .35s ease;
        }

        .video-generation-hero .video-orbit-card:hover,
        .video-generation-hero .video-orbit-card.is-active {
          border-color: var(--card-accent);
          box-shadow: 0 0 0 1px rgba(121,232,247,.12), 0 28px 80px rgba(0,0,0,.65);
        }

        .video-generation-hero .video-orbit-card:focus-visible,
        .video-generation-hero .video-control-button:focus-visible,
        .video-generation-hero .video-gallery-center:focus-visible,
        .video-generation-hero .video-close:focus-visible {
          outline: 2px solid var(--video-cyan);
          outline-offset: 4px;
        }

        .video-generation-hero .video-card-image {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: linear-gradient(135deg, #183746, #171b2e);
        }

        .video-generation-hero .video-card-image img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: .82;
          transition: transform .65s cubic-bezier(.2,.7,.2,1), opacity .4s ease;
        }

        .video-generation-hero .video-orbit-card:hover .video-card-image img,
        .video-generation-hero .video-orbit-card.is-active .video-card-image img {
          transform: scale(1.07);
          opacity: 1;
        }

        .video-generation-hero .video-card-image::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 45%, rgba(4,8,13,.78));
          pointer-events: none;
        }

        .video-generation-hero .video-card-play {
          position: absolute;
          z-index: 1;
          top: 50%;
          left: 50%;
          display: grid;
          width: 43px;
          height: 43px;
          place-items: center;
          border: 1px solid rgba(255,255,255,.7);
          border-radius: 50%;
          color: white;
          background: rgba(8,13,20,.35);
          backdrop-filter: blur(8px);
          transform: translate(-50%, -50%);
          transition: background .25s ease, color .25s ease;
        }

        .video-generation-hero .video-orbit-card:hover .video-card-play,
        .video-generation-hero .video-orbit-card.is-active .video-card-play {
          color: #061016;
          background: var(--card-accent);
        }

        .video-generation-hero .video-card-caption {
          padding: 13px 14px 15px;
        }

        .video-generation-hero .video-card-category {
          display: block;
          margin-bottom: 7px;
          color: var(--card-accent);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .17em;
        }

        .video-generation-hero .video-card-title {
          display: block;
          color: #f4f7fb;
          font-size: clamp(12px, 1.25vw, 15px);
          font-weight: 500;
          line-height: 1.35;
        }

        .video-generation-hero .video-gallery-center {
          position: absolute;
          z-index: 4;
          top: 50%;
          left: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 210px;
          height: 210px;
          padding: 20px;
          text-align: center;
          border: 1px solid rgba(121,232,247,.2);
          border-radius: 50%;
          color: inherit;
          background: radial-gradient(circle, rgba(24,85,103,.22), rgba(8,11,16,.84) 70%);
          box-shadow: 0 0 70px rgba(36,166,194,.08), inset 0 0 35px rgba(121,232,247,.04);
          transform: translate(-50%, -50%);
          cursor: pointer;
          transition: border-color .3s ease, box-shadow .3s ease;
        }

        .video-generation-hero .video-gallery-center:hover {
          border-color: rgba(121,232,247,.65);
          box-shadow: 0 0 55px rgba(36,166,194,.16), inset 0 0 35px rgba(121,232,247,.08);
        }

        .video-generation-hero .video-center-symbol {
          display: grid;
          width: 42px;
          height: 42px;
          place-items: center;
          margin-bottom: 13px;
          border: 1px solid rgba(121,232,247,.5);
          border-radius: 50%;
          color: var(--video-cyan);
          font-size: 15px;
        }

        .video-generation-hero .video-center-label {
          color: rgba(232,240,247,.48);
          font-size: 8px;
          letter-spacing: .2em;
        }

        .video-generation-hero .video-center-title {
          max-width: 100%;
          margin-top: 7px;
          overflow: hidden;
          color: #f4f7fb;
          font-size: 12px;
          font-weight: 500;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .video-generation-hero .video-gallery-controls {
          position: absolute;
          z-index: 5;
          right: 0;
          bottom: 10px;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
        }

        .video-generation-hero .video-control-button {
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 50%;
          color: #f4f7fb;
          background: rgba(11,17,24,.8);
          cursor: pointer;
          transition: border-color .25s ease, background .25s ease;
        }

        .video-generation-hero .video-control-button:hover {
          border-color: var(--video-cyan);
          background: rgba(29,80,94,.7);
        }

        .video-generation-hero .video-counter {
          min-width: 75px;
          color: rgba(232,240,247,.7);
          font-size: 10px;
          letter-spacing: .12em;
          text-align: center;
        }

        .video-generation-hero .video-counter strong {
          color: var(--video-cyan);
          font-weight: 500;
        }

        .video-generation-hero .video-bottomline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-top: 15px;
          color: rgba(232,240,247,.42);
          font-size: 9px;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .video-generation-hero .video-bottomline span:last-child {
          color: rgba(121,232,247,.8);
        }

        .video-generation-hero .video-modal-backdrop {
          position: fixed;
          z-index: 9999;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 22px;
          background: rgba(2,5,9,.88);
          backdrop-filter: blur(18px);
          animation: videoModalFade .25s ease both;
        }

        .video-generation-hero .video-modal {
          position: relative;
          width: min(100%, 1040px);
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 14px;
          background: #090e14;
          box-shadow: 0 30px 120px rgba(0,0,0,.65);
          animation: videoModalRise .35s cubic-bezier(.2,.75,.2,1) both;
        }

        .video-generation-hero .video-modal-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,.1);
        }

        .video-generation-hero .video-modal-kicker {
          margin-bottom: 5px;
          color: var(--video-cyan);
          font-size: 9px;
          letter-spacing: .2em;
        }

        .video-generation-hero .video-modal-title {
          margin: 0;
          color: #f4f7fb;
          font-size: 15px;
          font-weight: 500;
        }

        .video-generation-hero .video-close {
          display: grid;
          flex: 0 0 auto;
          width: 38px;
          height: 38px;
          place-items: center;
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 50%;
          color: white;
          background: transparent;
          font-size: 22px;
          cursor: pointer;
        }

        .video-generation-hero .video-player-wrap {
          aspect-ratio: 16 / 9;
          background: #000;
        }

        .video-generation-hero .video-player-wrap video {
          display: block;
          width: 100%;
          height: 100%;
          max-height: 72vh;
          object-fit: contain;
        }

        .video-generation-hero .video-modal-footer {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          padding: 13px 20px;
          color: rgba(232,240,247,.5);
          font-size: 10px;
          letter-spacing: .08em;
        }

        @keyframes videoModalFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes videoModalRise {
          from { opacity: 0; transform: translateY(14px) scale(.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (max-width: 680px) {
          .video-generation-hero {
            min-height: 100svh;
            padding: 100px 18px 30px;
          }

          .video-generation-hero .video-topline {
            margin-bottom: 42px;
            font-size: 8px;
          }

          .video-generation-hero .video-heading h1 {
            font-size: clamp(42px, 12vw, 68px);
          }

          .video-generation-hero .video-heading p {
            max-width: 430px;
            font-size: 12px;
          }

          .video-generation-hero .video-gallery {
            height: 380px;
            margin-top: 12px;
            perspective: 850px;
          }

          .video-generation-hero .video-orbit-card {
            width: clamp(122px, 37vw, 170px);
            border-radius: 9px;
          }

          .video-generation-hero .video-card-caption {
            padding: 10px 10px 12px;
          }

          .video-generation-hero .video-card-category {
            font-size: 7px;
          }

          .video-generation-hero .video-gallery-center {
            width: 135px;
            height: 135px;
            padding: 12px;
          }

          .video-generation-hero .video-center-symbol {
            width: 30px;
            height: 30px;
            margin-bottom: 7px;
            font-size: 11px;
          }

          .video-generation-hero .video-center-label {
            font-size: 7px;
          }

          .video-generation-hero .video-center-title {
            font-size: 10px;
          }

          .video-generation-hero .video-gallery-controls {
            bottom: 2px;
          }

          .video-generation-hero .video-bottomline {
            margin-top: 10px;
            font-size: 7px;
          }

          .video-generation-hero .video-modal-backdrop {
            padding: 12px;
          }

          .video-generation-hero .video-modal-top {
            padding: 12px;
          }

          .video-generation-hero .video-modal-footer {
            padding: 10px 12px;
            font-size: 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .video-generation-hero *,
          .video-generation-hero *::before,
          .video-generation-hero *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <div className="video-noise" />

      <div className="video-topline">
        <span>TARKA / MOTION STUDIO</span>
        <span className="video-status">Visual stories in motion</span>
      </div>

      <header className="video-heading">
        <p className="video-eyebrow">
          Ideas in motion · {String(videoProjects.length).padStart(2, "0")} selected frames
        </p>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      <div
        className="video-gallery"
        onMouseEnter={() => {
          hoveringRef.current = true;
          setIsPaused(true);
        }}
        onMouseLeave={() => {
          hoveringRef.current = false;
          setIsPaused(false);
        }}
      >
        <div className="video-orbit" ref={rotationRef}>
          {videoProjects.map((project, index) => {
            const angle = cardAngle * index;
            const isActive = index === activeIndex;

            const cardStyle = {
              "--card-angle": `${angle}deg`,
              "--card-accent": project.accent,
              transform: `
                translate(-50%, -50%)
                rotateY(${angle}deg)
                translateZ(clamp(150px, 26vw, 270px))
                rotateY(${-angle}deg)
                rotateY(calc(-1 * var(--orbit-angle)))
              `,
            } as CSSProperties;

            return (
              <button
                key={project.id}
                type="button"
                className={`video-orbit-card${isActive ? " is-active" : ""}`}
                style={cardStyle}
                aria-label={`Play ${project.title}`}
                aria-pressed={isActive}
                onFocus={() => selectCard(index)}
                onMouseEnter={() => selectCard(index)}
                onClick={() => openVideo(project, index)}
              >
                <div className="video-card-image">
                  <img src={project.thumbnail} alt="" loading="lazy" />
                  <span className="video-card-play" aria-hidden="true">
                    ▶
                  </span>
                </div>

                <div className="video-card-caption">
                  <span className="video-card-category">
                    {project.category}
                  </span>
                  <span className="video-card-title">
                    {project.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        
        <div className="video-gallery-controls">
          <button
            type="button"
            className="video-control-button"
            aria-label="Previous video"
            onClick={() => moveSelection(-1)}
          >
            ←
          </button>

          <span className="video-counter" aria-live="polite">
            <strong>{String(activeIndex + 1).padStart(2, "0")}</strong>
            {" / "}
            {String(videoProjects.length).padStart(2, "0")}
          </span>

          <button
            type="button"
            className="video-control-button"
            aria-label="Next video"
            onClick={() => moveSelection(1)}
          >
            →
          </button>
        </div>
      </div>

      <div className="video-bottomline">
        <span>Select a frame to enter the story</span>
        <span>Sound · Motion · Meaning</span>
      </div>

      {selectedVideo && (
        <div
          className="video-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePlayer();
            }
          }}
        >
          <section
            className="video-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedVideo.title} video player`}
          >
            <div className="video-modal-top">
              <div>
                <div className="video-modal-kicker">
                  {selectedVideo.category}
                </div>
                <h2 className="video-modal-title">
                  {selectedVideo.title}
                </h2>
              </div>

              <button
                type="button"
                className="video-close"
                aria-label="Close video player"
                onClick={closePlayer}
              >
                ×
              </button>
            </div>

            <div className="video-player-wrap">
              <video
                key={selectedVideo.id}
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                playsInline
                preload="metadata"
              >
                Your browser does not support HTML video.
              </video>
            </div>

            <div className="video-modal-footer">
              <span>{selectedVideo.description}</span>
              <span>DEMO PROJECT</span>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
