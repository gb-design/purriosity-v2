import { useCategories } from '../../hooks/useCategories';
import type { TagType } from '../../types/product';

interface TagFilterProps {
  selectedTag: TagType;
  onTagChange: (tag: TagType) => void;
}

export default function TagFilter({ selectedTag, onTagChange }: TagFilterProps) {
  const { categories, loading } = useCategories();

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
        <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide pb-2 justify-center md:justify-start md:flex-nowrap">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onTagChange(category.name as TagType)}
              className={`
                flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium flex-shrink-0
                ${
                  selectedTag === category.name
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-background border-2 border-primary text-primary hover:bg-primary/10'
                }
              `}
            >
              <span className="text-base">{category.emoji}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
