import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getSafeExternalUrl } from '../lib/security';
import { Loader2, Calendar, User, LayoutGrid, List, Search, ArrowDownUp, X } from 'lucide-react';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    cover_image: string;
    author_name: string;
    tags: string[];
    published_at: string;
}

export default function Blog() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState('Alle');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title-asc' | 'title-desc'>('newest');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('id,title,slug,excerpt,cover_image,author_name,tags,published_at')
                    .order('published_at', { ascending: false });

                if (error) throw error;
                setPosts(data || []);
            } catch (error) {
                console.error('Error loading blog posts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        posts.forEach((post) => {
            post.tags?.forEach((tag) => tags.add(tag));
        });
        return ['Alle', ...Array.from(tags).sort((a, b) => a.localeCompare(b, 'de-DE'))];
    }, [posts]);

    const visiblePosts = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        const filtered = posts.filter((post) => {
            const matchesTag = selectedTag === 'Alle' || post.tags?.includes(selectedTag);
            if (!matchesTag) return false;

            if (!normalizedQuery) return true;

            const searchableText = `${post.title} ${post.excerpt} ${post.author_name} ${(post.tags || []).join(' ')}`.toLowerCase();
            return searchableText.includes(normalizedQuery);
        });

        const sorted = [...filtered];
        sorted.sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
            }
            if (sortBy === 'oldest') {
                return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
            }
            if (sortBy === 'title-asc') {
                return a.title.localeCompare(b.title, 'de-DE');
            }
            return b.title.localeCompare(a.title, 'de-DE');
        });

        return sorted;
    }, [posts, query, selectedTag, sortBy]);

    const featuredPost = visiblePosts[0];
    const restPosts = visiblePosts.slice(1);
    const isSingleResult = visiblePosts.length === 1;

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-20 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="relative isolate overflow-hidden">
            <div className="bg-pattern-overlay opacity-35" />

            <div className="relative z-10 container mx-auto px-4 py-10 md:py-14">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="inline-flex rounded-full border border-primary/35 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        Magazin
                    </p>
                    <h1 className="mt-4 text-4xl md:text-6xl font-display font-bold text-foreground text-balance">
                        Das Purr-Magazin
                    </h1>
                    <p className="mt-4 text-base md:text-xl text-text-secondary max-w-3xl mx-auto">
                        Geschichten, Tipps und Verruecktes aus der Welt der Katzen. Finde schneller die passenden Artikel mit Sortierung, Filter und Ansichtswahl.
                    </p>
                </div>
            </div>

            <div className="relative z-10 container mx-auto px-4 pb-16">
                <div className="rounded-3xl border border-border bg-card/85 backdrop-blur-sm p-4 md:p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1 flex flex-col gap-3 md:flex-row">
                            <div className="relative flex-1">
                                <Search className="h-4 w-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Titel, Autor oder Tags suchen..."
                                    className="w-full h-11 rounded-full border border-input bg-background pl-10 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                                {query && (
                                    <button
                                        onClick={() => setQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-foreground"
                                        aria-label="Suche zurücksetzen"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <div className="relative md:w-60">
                                <ArrowDownUp className="h-4 w-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                    className="w-full h-11 rounded-full border border-input bg-background pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                                >
                                    <option value="newest">Neueste zuerst</option>
                                    <option value="oldest">Aelteste zuerst</option>
                                    <option value="title-asc">Titel A-Z</option>
                                    <option value="title-desc">Titel Z-A</option>
                                </select>
                            </div>
                        </div>

                        <div className="inline-flex rounded-full border border-border bg-background p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'grid'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-text-secondary hover:text-foreground'
                                    }`}
                            >
                                <LayoutGrid className="h-4 w-4" />
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'list'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-text-secondary hover:text-foreground'
                                    }`}
                            >
                                <List className="h-4 w-4" />
                                Liste
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors border ${selectedTag === tag
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background text-text-secondary border-border hover:text-foreground'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 text-sm text-text-secondary">
                        {visiblePosts.length} {visiblePosts.length === 1 ? 'Artikel' : 'Artikel'} gefunden
                    </div>
                </div>

                {visiblePosts.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-border bg-card mt-8 p-10 text-center">
                        <h2 className="text-xl font-semibold text-foreground">Keine Treffer</h2>
                        <p className="mt-2 text-text-secondary">
                            Passe Suche oder Filter an, um mehr Artikel zu sehen.
                        </p>
                        <button
                            onClick={() => {
                                setQuery('');
                                setSelectedTag('Alle');
                                setSortBy('newest');
                            }}
                            className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Filter zuruecksetzen
                        </button>
                    </div>
                ) : (
                    <>
                        {featuredPost && (
                            <Link
                                to={`/blog/${featuredPost.slug}`}
                                className={`group mt-8 block overflow-hidden rounded-3xl border border-border bg-card shadow-sm hover:shadow-md transition-all ${isSingleResult ? 'lg:max-h-[460px]' : ''
                                    }`}
                            >
                                <div className={`grid lg:grid-cols-[1.2fr_1fr] ${isSingleResult ? 'lg:h-[460px]' : ''}`}>
                                    <div className="aspect-[16/10] md:aspect-[16/9] lg:aspect-auto lg:h-full overflow-hidden bg-secondary">
                                        {getSafeExternalUrl(featuredPost.cover_image) ? (
                                            <img
                                                src={getSafeExternalUrl(featuredPost.cover_image) || ''}
                                                alt={featuredPost.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-secondary" aria-hidden="true" />
                                        )}
                                    </div>
                                    <div className="p-6 md:p-8 flex flex-col overflow-hidden">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="inline-flex rounded-full bg-primary/12 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                                                Featured
                                            </span>
                                            {featuredPost.tags?.slice(0, 1).map((tag) => (
                                                <span key={tag} className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground group-hover:text-primary transition-colors text-balance">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="mt-3 text-text-secondary line-clamp-4">
                                            {featuredPost.excerpt}
                                        </p>
                                        <div className="mt-auto pt-6 flex items-center justify-between text-xs text-text-secondary border-t border-border">
                                            <div className="flex items-center gap-2">
                                                <User className="h-3 w-3" />
                                                <span>{featuredPost.author_name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3 w-3" />
                                                <span>{new Date(featuredPost.published_at).toLocaleDateString('de-DE')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {restPosts.length > 0 && viewMode === 'grid' && (
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {restPosts.map((post) => {
                                    const safeCoverImage = getSafeExternalUrl(post.cover_image);
                                    return (
                                        <Link
                                            key={post.id}
                                            to={`/blog/${post.slug}`}
                                            className="group flex flex-col bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-border"
                                        >
                                            <div className="aspect-[16/9] overflow-hidden bg-secondary">
                                                {safeCoverImage ? (
                                                    <img
                                                        src={safeCoverImage}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-secondary" aria-hidden="true" />
                                                )}
                                            </div>
                                            <div className="flex-1 p-5 flex flex-col">
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {post.tags.slice(0, 2).map((tag) => (
                                                        <span key={tag} className="text-xs font-medium px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                    {post.title}
                                                </h3>
                                                <p className="text-text-secondary text-sm line-clamp-3 mb-5 flex-1">{post.excerpt}</p>
                                                <div className="flex items-center justify-between text-xs text-text-secondary mt-auto border-t border-border pt-3">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-3 w-3" />
                                                        <span>{post.author_name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>{new Date(post.published_at).toLocaleDateString('de-DE')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}

                        {restPosts.length > 0 && viewMode === 'list' && (
                            <div className="mt-8 space-y-4">
                                {restPosts.map((post) => {
                                    const safeCoverImage = getSafeExternalUrl(post.cover_image);
                                    return (
                                        <Link
                                            key={post.id}
                                            to={`/blog/${post.slug}`}
                                            className="group grid grid-cols-[120px_1fr] md:grid-cols-[200px_1fr] gap-4 rounded-2xl border border-border bg-card p-3 md:p-4 hover:shadow-md transition-all"
                                        >
                                            <div className="overflow-hidden rounded-xl bg-secondary h-full min-h-[90px] md:min-h-[120px]">
                                                {safeCoverImage ? (
                                                    <img
                                                        src={safeCoverImage}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-secondary" aria-hidden="true" />
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <h3 className="text-base md:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                    {post.title}
                                                </h3>
                                                <p className="mt-2 text-sm text-text-secondary line-clamp-2 md:line-clamp-3">{post.excerpt}</p>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {post.tags.slice(0, 3).map((tag) => (
                                                        <span key={tag} className="text-xs font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="mt-auto pt-3 flex items-center gap-4 text-xs text-text-secondary">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <User className="h-3 w-3" />
                                                        {post.author_name}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(post.published_at).toLocaleDateString('de-DE')}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
