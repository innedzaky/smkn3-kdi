"use client";

import { useEffect, useRef, useState } from "react";

export default function BrosurSlider({
  depan,
  belakang,
}: {
  depan: string;
  belakang: string;
}) {
  const [val, setVal] = useState(50);
  const imgBgRef = useRef<HTMLImageElement>(null);
  const imgFgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const sync = () => {
    if (overlayRef.current) overlayRef.current.style.width = `${val}%`;
    if (handleRef.current) handleRef.current.style.left = `${val}%`;
    if (imgBgRef.current && imgFgRef.current && imgBgRef.current.clientWidth > 0) {
      imgFgRef.current.style.width = `${imgBgRef.current.clientWidth}px`;
    }
  };

  useEffect(() => {
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [val]);

  useEffect(() => {
    window.addEventListener("resize", sync);
    const onOrientation = () => setTimeout(sync, 100);
    window.addEventListener("orientationchange", onOrientation);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", onOrientation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="brosur-slider-container">
      <span className="brosur-badge brosur-badge-before">Halaman Depan</span>
      <span className="brosur-badge brosur-badge-after">Halaman Belakang</span>

      <img
        src={belakang}
        alt="Brosur Halaman Belakang"
        className="brosur-img-bg"
        ref={imgBgRef}
        onLoad={sync}
      />

      <div className="brosur-img-overlay" ref={overlayRef}>
        <img src={depan} alt="Brosur Halaman Depan" ref={imgFgRef} />
      </div>

      <div className="brosur-handle" ref={handleRef}>
        <div className="brosur-knob">◄►</div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="brosur-slider-input"
        aria-label="Geser untuk membandingkan halaman brosur"
      />
    </div>
  );
}
