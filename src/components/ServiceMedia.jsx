
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

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);

  const hasVideo = Boolean(video) && !hasVideoError;

  useEffect(() => {
    const videoElement = videoRef.current;
    const containerElement = containerRef.current;

    if (!videoElement || !containerElement || !hasVideo) return;

    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let isVisible = false;
    let isActive = true;

    const pauseVideo = () => {
      videoElement.pause();
    };

    const syncPlayback = async () => {
      const shouldPlay =
        isVisible &&
        !document.hidden &&
        !mediaQuery.matches;

      if (!shouldPlay) {
        pauseVideo();
        return;
      }

      if (!videoElement.paused) return;

      videoElement.muted = true;
      videoElement.defaultMuted = true;

      try {
        await videoElement.play();
      } catch (error) {
        if (!isActive) return;

        // Safari may reject autoplay in Low Power Mode.
        // Keep the service image visible instead.
        if (error.name !== "AbortError") {
          setIsPlaying(false);
        }
      }
    };

    const handleIntersection = (entries) => {
      const entry = entries[0];

      if (!entry) return;

      isVisible =
        entry.isIntersecting &&
        entry.intersectionRatio >= 0.5;

      syncPlayback();
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      { threshold: [0, 0.5, 1] }
    );

    observer.observe(containerElement);

    mediaQuery.addEventListener("change", syncPlayback);

    document.addEventListener(
      "visibilitychange",
      syncPlayback
    );

    return () => {
      isActive = false;

      observer.disconnect();

      mediaQuery.removeEventListener(
        "change",
        syncPlayback
      );

      document.removeEventListener(
        "visibilitychange",
        syncPlayback
      );

      pauseVideo();
    };
  }, [hasVideo, video]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
    >
      {hasVideo ? (
        <>
          <video
            ref={videoRef}
            src={video}
            autoPlay
            muted
            playsInline
            loop
            preload="metadata"
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            aria-label={`Video del servicio ${name}`}
            onPlaying={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => {
              setHasVideoError(true);
              setIsPlaying(false);
            }}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />

          {/* Cover native playback UI until video starts */}
          {!isPlaying && (
            <div className="pointer-events-none absolute inset-0 z-10 bg-gray-100">
              {image && (
                <Image
                  src={image}
                  alt=""
                  fill
                  priority={priority}
                  sizes={IMAGE_SIZES}
                  className="object-cover"
                />
              )}
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
