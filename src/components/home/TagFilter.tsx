import type { TagType } from '../../types/product';

const tags: { name: TagType; emoji: string }[] = [
    { name: 'Alle', emoji: '✨' },
    { name: 'Cute', emoji: '🥰' },
    { name: 'Weird', emoji: '🤪' },
    { name: 'Gift', emoji: '🎁' },
    { name: 'Budget', emoji: '💰' },
    { name: 'Minimal', emoji: '✨' },
    { name: 'Luxury', emoji: '👑' },
    { name: 'Funny', emoji: '😂' },
    { name: 'Practical', emoji: '🛠️' },
];

interface TagFilterProps {
    selectedTag: TagType;
    onTagChange: (tag: TagType) => void;
}

export default function TagFilter({ selectedTag, onTagChange }: TagFilterProps) {
    return (
        <div className="sticky top-[112px] md:top-[63px] z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border py-4 transition-[top] duration-300">
            <div className="container mx-auto px-4">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {tags.map((tag) => (
                        <button
                            key={tag.name}
                            onClick={() => onTagChange(tag.name)}
                            className={`
                flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all
                ${selectedTag === tag.name
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'bg-background border-2 border-primary text-primary hover:bg-primary/10'
                                }
              `}
                        >
                            <span>{tag.emoji}</span>
                            <span className="font-medium">{tag.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
