"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HeroSlide } from "@/lib/types";

const INTERVAL = 5500;

export default function HeroSlider({
  slides,
}: {
  slides: HeroSlide[];
}) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);

  const goTo = useCallback(
    (index: number) => {
      setCurrent((prev) => {
        const total = slides.length;
        if (!total) return prev;
        const next = (index + total) % total;
        return next;
      });
    },
    [slides.length]
  );

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length < 2) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, INTERVAL);
  }, [slides.length]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoplay]);

  function handlePrev() {
    goTo(current - 1);
    startAutoplay();
  }
  function handleNext() {
    goTo(current + 1);
    startAutoplay();
  }
  function handleDot(index: number) {
    goTo(index);
    startAutoplay();
  }
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
      startAutoplay();
    }
  }

  if (!slides.length) return null;

  return (
    <div
      className="hero-slider"
      onMouseEnter={() => timerRef.current && clearInterval(timerRef.current)}
      onMouseLeave={startAutoplay}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="slider-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={slide.id ?? i} className={`slide ${i === current ? "active" : ""}`}>
            <div
              className="slide-img"
              style={{ backgroundImage: `url('${slide.gambar}')` }}
            />
            <div className="slide-overlay" />
            <div className="slide-content">
              <div className="slide-inner">
                <div className="slide-badge">
                  <span className="dot" /> {slide.badge}
                </div>
                <h1 className="slide-title">
                  {slide.title}
                  <br />
                  <span>{slide.title_accent}</span>
                </h1>
                <p className="slide-desc">{slide.deskripsi}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="slider-arrow slider-arrow-prev"
        aria-label="Slide sebelumnya"
        onClick={handlePrev}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button
        className="slider-arrow slider-arrow-next"
        aria-label="Slide berikutnya"
        onClick={handleNext}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="9 6 15 12 9 18"></polyline>
        </svg>
      </button>

      <div className="slider-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`slider-dot ${i === current ? "active" : ""}`}
            onClick={() => handleDot(i)}
            aria-label={`Ke slide ${i + 1}`}
          />
        ))}
      </div>

      <div
        key={current}
        className="slider-progress"
        style={{ animation: `progressGrow ${INTERVAL}ms linear forwards` }}
      />

      <style jsx>{`
        @keyframes progressGrow {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
