import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../../types/product';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerState = useRef({
    isPointerDown: false,
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
    pointerId: -1,
    hasCapture: false,
    suppressClick: false,
  });
  const [itemsPerView, setItemsPerView] = useState(3);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const visibleItems = Math.min(itemsPerView, products.length);

  const updateScrollState = () => {
    const node = containerRef.current;
    if (!node) return;
    const maxScroll = node.scrollWidth - node.clientWidth;
    setCanScrollLeft(node.scrollLeft > 8);
    setCanScrollRight(node.scrollLeft < maxScroll - 8);
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setItemsPerView(width >= 1024 ? 3 : 2);
      updateScrollState();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;
    node.addEventListener('scroll', updateScrollState);
    updateScrollState();
    return () => node.removeEventListener('scroll', updateScrollState);
  }, [itemsPerView, products.length]);

  const scrollBy = (direction: 1 | -1) => {
    const node = containerRef.current;
    if (!node) return;
    const step = node.clientWidth / clamp(itemsPerView, 1, 3);
    node.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const node = containerRef.current;
    if (!node) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('a, button, input, textarea, select, label, [role="button"]')) {
      pointerState.current = {
        ...pointerState.current,
        isPointerDown: false,
        isDragging: false,
        pointerId: -1,
        hasCapture: false,
      };
      return;
    }

    pointerState.current = {
      ...pointerState.current,
      isPointerDown: true,
      isDragging: false,
      startX: event.clientX,
      scrollLeft: node.scrollLeft,
      pointerId: event.pointerId,
      hasCapture: false,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const node = containerRef.current;
    const state = pointerState.current;
    if (!node || !state.isPointerDown) return;
    const delta = event.clientX - state.startX;
    const dragThreshold = 6;
    if (!state.isDragging && Math.abs(delta) < dragThreshold) return;
    if (!state.isDragging) {
      state.isDragging = true;
    }
    if (!state.hasCapture) {
      node.setPointerCapture(event.pointerId);
      state.hasCapture = true;
    }
    event.preventDefault();
    const next = state.scrollLeft - delta;
    const maxScroll = node.scrollWidth - node.clientWidth;
    node.scrollLeft = clamp(next, 0, maxScroll);
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    const node = containerRef.current;
    const state = pointerState.current;
    if (!node || !state.isPointerDown) return;

    if (state.hasCapture && state.pointerId === event.pointerId) {
      node.releasePointerCapture(event.pointerId);
    }

    const shouldSuppressClick = state.isDragging;
    pointerState.current = {
      ...pointerState.current,
      isPointerDown: false,
      isDragging: false,
      pointerId: -1,
      hasCapture: false,
      suppressClick: shouldSuppressClick,
    };

    if (shouldSuppressClick) {
      window.setTimeout(() => {
        pointerState.current.suppressClick = false;
      }, 0);
    }
  };

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    stopDragging(event);
  };

  const trackStyle = useMemo<CSSProperties>(() => {
    const justifyContent = products.length <= itemsPerView ? 'center' : 'flex-start';
    return { justifyContent };
  }, [itemsPerView, products.length]);

  const cardStyle = useMemo<CSSProperties>(() => {
    const base = itemsPerView === 3 ? '33.333%' : '80%';
    const gutter = itemsPerView === 3 ? '1rem' : '0.5rem';
    return {
      flex: `0 0 calc(${base} - ${gutter})`
    };
  }, [itemsPerView]);

  const productIds = products.map((product) => product.id);

  if (products.length === 0) {
    return null;
  }

  const showNavigation = products.length > visibleItems;

  return (
    <div className="relative max-w-6xl mx-auto">
      {showNavigation && (
        <>
          <button
            type="button"
            aria-label="Vorherige Produkte"
            onClick={() => scrollBy(-1)}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full border bg-background text-foreground shadow ${
              canScrollLeft ? 'opacity-100' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Nächste Produkte"
            onClick={() => scrollBy(1)}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full border bg-background text-foreground shadow ${
              canScrollRight ? 'opacity-100' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div className="overflow-hidden px-6 sm:px-10">
        <div
          ref={containerRef}
          className="flex gap-4 py-4 overflow-x-auto select-none cursor-grab active:cursor-grabbing touch-pan-x"
          style={trackStyle}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerLeave={stopDragging}
          onPointerCancel={handlePointerCancel}
          onClickCapture={(event) => {
            if (pointerState.current.suppressClick) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
        >
          {products.map((product, index) => (
            <div key={product.id} className="flex-shrink-0" style={cardStyle}>
              <ProductCard product={product} productIds={productIds} productIndex={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
