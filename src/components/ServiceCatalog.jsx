
"use client";

import { useEffect, useMemo, useState } from "react";

import ServiceCard from "@/components/ServiceCard";
import CartBar from "@/components/CartBar";
import CheckoutPanel from "@/components/CheckoutPanel";

const CART_STORAGE_KEY = "carrito";
const ALL_CATEGORIES = "Todos";

const normalizeCartItem = (item) => {
  if (!item || typeof item !== "object" || item.id == null) {
    return null;
  }

  return {
    id: item.id,
    name: item.name ?? item.nombre ?? "",
    description: item.description ?? item.descripcion ?? "",
    price: Number(item.price ?? item.precio) || 0,
    durationMinutes: Number(
      item.durationMinutes ?? item.duracionMinutos
    ) || 0,
    category: item.category ?? item.categoria ?? "",
    image: item.image ?? item.imagen ?? "",
    video: item.video ?? null,
    quantity: Math.max(
      1,
      Math.trunc(Number(item.quantity ?? item.cantidad) || 1)
    ),
  };
};

export default function ServiceCatalog({ services = [] }) {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);

        if (Array.isArray(parsedCart)) {
          const restoredCart = parsedCart
            .map(normalizeCartItem)
            .filter(Boolean);

          setCart(restoredCart);
        }
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setIsCartLoaded(true);
    }
  }, []);

  
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      services
        .map((service) => service.category)
        .filter(
          (category) =>
            typeof category === "string" &&
            category.trim().length > 0 &&
            category !== ALL_CATEGORIES
        )
    );

    return [ALL_CATEGORIES, ...uniqueCategories];
  }, [services]);

  
  const filteredServices = useMemo(() => {
    if ( activeCategory === ALL_CATEGORIES || !categories.includes(activeCategory) ) {
      return services;
    }

    return services.filter( (service) => service.category === activeCategory );
  }, [activeCategory, categories, services]);

  
  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }, [cart]);

  
  const legacyCart = useMemo(() => {
    return cart.map((item) => ({
      ...item,
      nombre: item.name,
      descripcion: item.description,
      precio: item.price,
      duracionMinutos: item.durationMinutes,
      categoria: item.category,
      imagen: item.image,
      cantidad: item.quantity,
    }));
  }, [cart]);

  
  const saveCart = (updatedCart) => {
    setCart(updatedCart);

    try {
      localStorage.setItem( CART_STORAGE_KEY, JSON.stringify(updatedCart) );
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };


  const handleAddService = (service) => {
    if (!service || service.id == null) return;

    const existingItem = cart.find(
      (item) => item.id === service.id
    );

    const updatedCart = existingItem
      ? cart.map((item) =>
          item.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [
          ...cart,
          {
            ...service,
            quantity: 1,
          },
        ];

    saveCart(updatedCart);
  };

  
  const handleRemoveService = (serviceId) => {
    const updatedCart = cart.filter( (item) => item.id !== serviceId );
    saveCart(updatedCart);
  };

  
  const handleClearCart = () => {
    setCart([]);
    setIsCheckoutOpen(false);

    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };


  const getServiceQuantity = (serviceId) => {
    return cart.find( (item) => item.id === serviceId )?.quantity ?? 0;
  };

  return (
    <>
      
      <div className="mt-6 flex flex-wrap justify-center gap-2 px-2 sm:mt-8 sm:gap-3 sm:px-0">
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={isActive}
              className={`nails-category-button ${
                isActive
                  ? "nails-category-button-active"
                  : "nails-category-button-inactive"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      
      <div className="mt-10 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 xl:grid-cols-4">
        {filteredServices.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            quantity={getServiceQuantity(service.id)}
            onAdd={handleAddService}
            onRemove={handleRemoveService}
            priority={index === 0}
          />
        ))}
      </div>

      
      {isCartLoaded && (
        <CartBar
          carrito={legacyCart}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
        />
      )}

      
      {isCartLoaded && isCheckoutOpen && (
        <CheckoutPanel
          carrito={legacyCart}
          total={total}
          onClose={() => setIsCheckoutOpen(false)}
          onCitaCreada={handleClearCart}
        />
      )}
    </>
  );
}
