"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const IMAGE_SIZES =
  "(max-width: 639px) 82vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw";

export default function ServiceMedia({ image, video, name, priority = false }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const isVisibleRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const [hasVideoError, setHasVideoError] = useState(false);

  const hasVideo = Boolean(video) && !hasVideoError;

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement || !hasVideo) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const attemptPlayback = () => {
      if (!isVisibleRef.current || reducedMotionRef.current || document.hidden) {
        return;
      }

      videoElement.muted = true;

      const playPromise = videoElement.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {});
      }
    };

    const updateMotionPreference = () => {
      reducedMotionRef.current = mediaQuery.matches;

      if (mediaQuery.matches) {
        videoElement.pause();
      } else {
        attemptPlayback();
      }
    };

    const handleVisibilityChange = (entries) => {
      const entry = entries[0];
      if (!entry) return;

      isVisibleRef.current =
        entry.isIntersecting && entry.intersectionRatio >= 0.6;

      if (isVisibleRef.current) {
        attemptPlayback();
      } else {
        videoElement.pause();
      }
    };

    const handleDocumentVisibility = () => {
      if (document.hidden) {
        videoElement.pause();
      } else {
        attemptPlayback();
      }
    };

    const observer = new IntersectionObserver(handleVisibilityChange, {
      threshold: [0, 0.6, 1],
    });

    const containerElement = containerRef.current;
    if (containerElement) {
      observer.observe(containerElement);
    }

    mediaQuery.addEventListener("change", updateMotionPreference);
    document.addEventListener("visibilitychange", handleDocumentVisibility);
    updateMotionPreference();

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", updateMotionPreference);
      document.removeEventListener("visibilitychange", handleDocumentVisibility);
      videoElement.pause();
    };
  }, [hasVideo, video]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {hasVideo ? (
        <video
          ref={videoRef}
          src={video}
          poster={image || undefined}
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          aria-label={`Video del servicio ${name}`}
          onError={() => setHasVideoError(true)}
          className="pointer-events-none h-full w-full object-cover"
        >
          Tu navegador no admite la reproducción de videos.
        </video>
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