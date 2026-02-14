import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../lib/supabase';
import { Loader2, Calendar, User, ArrowLeft, Tag, Share2, Facebook, Twitter, Mail, Link as LinkIcon, Check } from 'lucide-react';

interface BlogPost {
    id: string;
    title: string;
    content: string;
    cover_image: string;
    author_name: string;
    tags: string[];
    published_at: string;
}

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showCopyFeedback, setShowCopyFeedback] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;
            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (error) throw error;
                setPost(data);
            } catch (error) {
                console.error('Error loading post:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-20 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Artikel nicht gefunden 😿</h1>
                <Link to="/blog" className="text-primary hover:underline">
                    Zurück zur Übersicht
                </Link>
            </div>
        );
    }

    return (
        <article className="min-h-screen pb-20">
            {/* Hero Image */}
            <div className="w-full h-[40vh] md:h-[50vh] relative bg-secondary">
                <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90"></div>

                <div className="absolute bottom-0 left-0 w-full p-4 md:p-12">
                    <div className="container mx-auto max-w-3xl">
                        <Link to="/blog" className="inline-flex items-center text-sm text-primary/80 hover:text-primary mb-6 transition-colors font-medium backdrop-blur-sm bg-background/30 px-3 py-1 rounded-full">
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Zurück zum Magazin
                        </Link>

                        <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full backdrop-blur-md">
                                <User className="h-4 w-4" />
                                <span>{post.author_name}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full backdrop-blur-md">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(post.published_at).toLocaleDateString('de-DE')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 mt-12">
                <div className="max-w-3xl mx-auto">
                    <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-3xl font-display font-bold text-foreground mt-8 mb-4" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4 border-l-4 border-primary pl-4" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-xl font-display font-bold text-foreground mt-6 mb-3" {...props} />,
                                p: ({ node, ...props }) => <p className="text-lg leading-relaxed text-muted-foreground mb-6" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-6 ml-4 text-muted-foreground" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-6 ml-4 text-muted-foreground" {...props} />,
                                li: ({ node, ...props }) => <li className="pl-2" {...props} />,
                                blockquote: ({ node, ...props }) => (
                                    <blockquote className="border-l-4 border-secondary bg-secondary/10 p-6 rounded-r-xl my-8 italic text-xl text-foreground" {...props} />
                                ),
                                img: ({ node, ...props }) => (
                                    <span className="block my-8">
                                        <img className="rounded-2xl shadow-lg w-full object-cover max-h-[500px]" {...props} />
                                        {props.alt && <span className="block text-center text-sm text-muted-foreground mt-2 italic">{props.alt}</span>}
                                    </span>
                                ),
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>

                    {/* Share & Tags */}
                    <div className="mt-16 pt-8 border-t border-border">

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Share2 className="h-5 w-5 text-primary" />
                                Beitrag teilen
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        setShowCopyFeedback(true);
                                        setTimeout(() => setShowCopyFeedback(false), 2000);
                                    }}
                                    className={`p-3 rounded-full transition-all relative ${showCopyFeedback
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground'
                                        }`}
                                    title="Link kopieren"
                                >
                                    {showCopyFeedback ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        <LinkIcon className="h-5 w-5" />
                                    )}

                                    {/* Tooltip-style notification */}
                                    {showCopyFeedback && (
                                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap animate-in fade-in zoom-in duration-200">
                                            Kopiert!
                                        </span>
                                    )}
                                </button>
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-full bg-secondary hover:bg-[#1877F2]/10 hover:text-[#1877F2] transition-colors text-muted-foreground"
                                    title="Auf Facebook teilen"
                                >
                                    <Facebook className="h-5 w-5" />
                                </a>
                                <a
                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-full bg-secondary hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] transition-colors text-muted-foreground"
                                    title="Auf Twitter teilen"
                                >
                                    <Twitter className="h-5 w-5" />
                                </a>
                                <a
                                    href={`mailto:?subject=${encodeURIComponent(post.title)}&body=Schau dir diesen Artikel an: ${encodeURIComponent(window.location.href)}`}
                                    className="p-3 rounded-full bg-secondary hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                                    title="Per E-Mail senden"
                                >
                                    <Mail className="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                        {/* Tags Footer */}
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                                    <Tag className="h-3 w-3 mr-2" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
