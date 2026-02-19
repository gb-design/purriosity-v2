import { useRef, useState, useEffect } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { X } from 'lucide-react';

interface TagFilterProps {
  selectedCategories: string[];
  onToggle: (tag: string) => void;
}

export default function TagFilter({ selectedCategories, onToggle }: TagFilterProps) {
  const { categories, loading } = useCategories();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragData = useRef<{ startX: number; scrollLeft: number; hasMoved: boolean } | null>(null);
  const suppressClickRef = useRef(false);

  const hasAllCategory = categories.some((category) => category.name === 'Alle');
  const options = hasAllCategory
    ? categories
    : [
        {
          id: 'all',
          name: 'Alle',
          emoji: '✨',
        },
        ...categories,
      ];

  const updateShadows = () => {
    const container = scrollRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftShadow(scrollLeft > 8);
    setShowRightShadow(scrollLeft + clientWidth < scrollWidth - 8);
  };

  useEffect(() => {
    updateShadows();
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener('scroll', updateShadows);
    window.addEventListener('resize', updateShadows);
    return () => {
      container.removeEventListener('scroll', updateShadows);
      window.removeEventListener('resize', updateShadows);
    };
  }, [categories, loading]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) return;
    dragData.current = { startX: event.clientX, scrollLeft: container.scrollLeft, hasMoved: false };
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    const data = dragData.current;
    if (!container || !data) return;
    const dx = event.clientX - data.startX;
    if (Math.abs(dx) > 2) {
      data.hasMoved = true;
      suppressClickRef.current = true;
    }
    if (data.hasMoved) {
      event.preventDefault();
    }
    container.scrollLeft = data.scrollLeft - dx;
  };

  const endDrag = (event?: React.PointerEvent<HTMLDivElement>) => {
    if (!dragData.current) return;
    if (dragData.current.hasMoved && event) {
      event.preventDefault();
      event.stopPropagation();
    }
    dragData.current = null;
    setIsDragging(false);
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
    }
  };

  if (loading) {
    return (
      <div className="sticky top-[112px] md:top-[63px] z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            <div className="animate-pulse text-muted-foreground">Kategorien werden geladen...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-[112px] md:top-[63px] z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border py-4 transition-[top] duration-300">
      <div className="container mx-auto px-4">
        <div className="relative">
          {showLeftShadow && (
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent" />
          )}
          {showRightShadow && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent" />
          )}
          <div
            ref={scrollRef}
            className={`flex gap-2 overflow-x-auto scrollbar-hide pb-2 md:flex-nowrap ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={handleClickCapture}
          >
            {options.map((category) => {
              const isAll = category.name === 'Alle';
              const isSelected = isAll
                ? selectedCategories.length === 0
                : selectedCategories.includes(category.name);
              return (
                <button
                  key={category.id}
                  onClick={() => onToggle(category.name)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium flex-shrink-0 ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-background border-2 border-primary text-primary hover:bg-primary/10'
                  }`}
                >
                  <span className="text-base">{category.emoji}</span>
                  <span>{category.name}</span>
                  {category.name !== 'Alle' && selectedCategories.includes(category.name) && (
                    <X className="h-3 w-3" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
