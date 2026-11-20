
"use client";

import { useState } from "react";
import { ArrowLeft, Clock, Check, X } from "lucide-react";
import ServiceMedia from "./ServiceMedia";

const RESERVATION_PERCENTAGE = 0.2;

export default function ServiceCard({
  service,
  quantity = 0,
  onAdd,
  onRemove,
  priority = false,
}) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  if (!service) return null;

  const {
    id,
    nombre: name,
    descripcion: description,
    precio: servicePrice,
    duracionMinutos: durationMinutes,
    imagen: image,
    video,
  } = service;

  const isSelected = quantity > 0;
  const price = Number(servicePrice) || 0;
  const reservationAmount = price * RESERVATION_PERCENTAGE;

  const closeDetails = () => {
    setIsDetailsOpen(false);
  };

  return (
    <article className="group nails-product-card nails-fade-in flex h-130 w-[82vw] max-w-[320px] shrink-0 snap-start flex-col overflow-hidden sm:w-full sm:max-w-none sm:shrink">
      
      <div className="relative h-64 w-full shrink-0 overflow-hidden">
        <ServiceMedia
          key={`${id}-${video || image}`}
          name={name}
          image={image}
          video={video}
          priority={priority}
        />

    
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-nails-caramelo/20 via-transparent to-transparent" />

    
        <button
          type="button"
          onClick={() => setIsDetailsOpen(true)}
          aria-label={`Ver detalles de ${name}`}
          aria-expanded={isDetailsOpen}
          className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white"
        />

        
        <div
          className={`absolute inset-0 z-20 flex flex-col justify-end bg-nails-caramelo/20 p-5 backdrop-blur-[2px] transition-all duration-300 ${
            isDetailsOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-full opacity-0"
          }`}
          aria-hidden={!isDetailsOpen}
          inert={!isDetailsOpen}
        >
          <button
            type="button"
            onClick={closeDetails}
            className="absolute right-3 top-3 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow"
            aria-label={`Cerrar detalles de ${name}`}
            tabIndex={isDetailsOpen ? 0 : -1}
          >
            <X size={16} aria-hidden="true" />
          </button>

          <p className="text-xs font-bold tracking-wider text-nails-white">
            INCLUYE
          </p>

          <p className="mt-2 text-sm leading-relaxed font-bold text-nails-white">
            {description}
          </p>
        </div>

        
        {isSelected && (
          <div className="pointer-events-none absolute right-3 top-3 z-40 flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-green-700 shadow">
            <Check size={13} aria-hidden="true" />
            Seleccionado
          </div>
        )}
      </div>

    
      <div className="flex flex-1 flex-col p-4">
        <h3 className="nails-title line-clamp-2 min-h-10 text-xl leading-7 font-bold text-nails-brown">
          {name}
        </h3>

    
        <div className="mt-2 min-h-6">
          {durationMinutes > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Clock size={15} aria-hidden="true" />
              <span>{durationMinutes} min</span>
            </div>
          )}
        </div>

      
        <div className="mt-auto pt-2">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500">
                Precio
              </p>

              <p className="mt-1 text-xl font-bold text-nails-brown">
                S/ {price.toFixed(2)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-medium text-gray-500">
                Reserva 20%
              </p>

              <p className="mt-1 text-base font-bold text-nails-brown">
                S/ {reservationAmount.toFixed(2)}
              </p>
            </div>
          </div>

        
          <div className="mt-5 flex min-h-5 justify-end">
            {isSelected ? (
              <button
                type="button"
                onClick={() => onRemove?.(id)}
                className="nails-button-remove flex w-full items-center justify-center gap-2"
              >
                <ArrowLeft size={15} aria-hidden="true" />
                Cambiar servicio
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onAdd?.(service)}
                className="nails-button-add flex w-fit items-center justify-center px-5 py-4 text-sm hover:bg-nails-caramelo"
              >
                Agregar Servicio
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
