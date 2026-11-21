"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const IMAGE_SIZES =
  "(max-width: 639px) 82vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw";

export default function ServiceMedia({
  image,
  video,
  name,
  priority = false,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);

  const hasVideo = Boolean(video) && !hasVideoError;

  
  useEffect(() => {
    if (!hasVideo || shouldLoad) return;

    const containerElement = containerRef.current;
    if (!containerElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(containerElement);

    return () => observer.disconnect();
  }, [hasVideo, shouldLoad]);

  
  useEffect(() => {
    const videoElement = videoRef.current;
    const containerElement = containerRef.current;

    if (!videoElement || !containerElement || !hasVideo || !shouldLoad) {
      return;
    }

    videoElement.muted = true;
    videoElement.defaultMuted = true;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let isVisible = false;
    let isActive = true;

    const syncPlayback = async () => {
      const shouldPlay =
        isVisible && !document.hidden && !mediaQuery.matches;

      if (!shouldPlay) {
        videoElement.pause();
        return;
      }

      if (!videoElement.paused) return;

      try {
        await videoElement.play();
      } catch (error) {
        if (isActive && error.name !== "AbortError") {
          console.warn("Autoplay bloqueado:", error.name);
        }
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = Boolean(entry?.isIntersecting);
        syncPlayback();
      },
      { threshold: 0.5 }
    );

    observer.observe(containerElement);
    mediaQuery.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      isActive = false;
      observer.disconnect();
      mediaQuery.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      videoElement.pause();
    };
  }, [hasVideo, shouldLoad, video]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {hasVideo ? (
        <>
          <video
            ref={videoRef}
            src={shouldLoad ? video : undefined}
            muted
            playsInline
            loop
            preload={shouldLoad ? "auto" : "none"}
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            aria-label={`Video del servicio ${name}`}
            onPlaying={() => setHasStarted(true)}
            onError={() => {
              if (shouldLoad) setHasVideoError(true);
            }}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />

      
          {image && (
            <div
              className={`pointer-events-none absolute inset-0 z-10 bg-gray-100 transition-opacity duration-300 ${
                hasStarted ? "opacity-0" : "opacity-100"
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                priority={priority}
                sizes={IMAGE_SIZES}
                className="object-cover"
              />
            </div>
          )}
        </>
      ) : image ? (
        <Image
          src={image}
          alt={name}
          fill
          priority={priority}
          sizes={IMAGE_SIZES}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          role="img"
          aria-label={`Imagen no disponible para ${name}`}
          className="flex h-full w-full items-center justify-center bg-gray-100 p-4 text-center text-sm text-gray-500"
        >
          Imagen no disponible
        </div>
      )}
    </div>
  );
}