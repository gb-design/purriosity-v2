import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../lib/supabase';
import { getSafeExternalUrl } from '../lib/security';
import { parseImageFocus } from '../lib/imageFocus';
import { Loader2, Calendar, User, ArrowLeft, Tag, Share2, Facebook, Twitter, Mail, Link as LinkIcon, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { RevealItem, RevealSection } from '../components/motion/ScrollReveal';
import LinkedProductCard from '../components/blog/LinkedProductCard';

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
                    .select('id,title,content,cover_image,author_name,tags,published_at')
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

    const parsedCoverImage = parseImageFocus(post.cover_image);
    const safeCoverImage = getSafeExternalUrl(parsedCoverImage.cleanUrl);

    return (
        <article className="min-h-screen pb-20">
            {/* Hero Image */}
            <div className="w-full h-[40vh] md:h-[50vh] relative bg-secondary">
                {safeCoverImage ? (
                    <img
                        src={safeCoverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: `${parsedCoverImage.focusX}% ${parsedCoverImage.focusY}%` }}
                    />
                ) : (
                    <div className="w-full h-full bg-secondary" aria-hidden="true" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-4 md:p-12">
                    <RevealSection className="container mx-auto max-w-3xl" amount={0.05}>
                        <RevealItem>
                            <Link to="/blog" className="inline-flex items-center text-sm text-primary/80 hover:text-primary mb-6 transition-colors font-medium backdrop-blur-sm bg-background/30 px-3 py-1 rounded-full">
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Zurück zum Magazin
                            </Link>
                        </RevealItem>

                        <RevealItem>
                            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
                                {post.title}
                            </h1>
                        </RevealItem>

                        <RevealItem soft className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full backdrop-blur-md">
                                <User className="h-4 w-4" />
                                <span>{post.author_name}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full backdrop-blur-md">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(post.published_at).toLocaleDateString('de-DE')}</span>
                            </div>
                        </RevealItem>
                    </RevealSection>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 mt-12">
                <div className="max-w-3xl mx-auto">
                    <RevealSection className="prose prose-lg prose-neutral dark:prose-invert max-w-none [&_img]:!rounded-2xl [&_img]:block [&_img]:h-auto [&_img]:max-w-full [&_img]:object-contain">
                        <ReactMarkdown
                            components={{
                                h1: ({ children, ...props }) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.85 }}
                                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <h1 className="text-3xl font-display font-bold text-foreground mt-8 mb-4" {...props}>
                                            {children}
                                        </h1>
                                    </motion.div>
                                ),
                                h2: ({ children, ...props }) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.85 }}
                                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4 border-l-4 border-primary pl-4" {...props}>
                                            {children}
                                        </h2>
                                    </motion.div>
                                ),
                                h3: ({ children, ...props }) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 16 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.85 }}
                                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <h3 className="text-xl font-display font-bold text-foreground mt-6 mb-3" {...props}>
                                            {children}
                                        </h3>
                                    </motion.div>
                                ),
                                p: ({ children, ...props }) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 14 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.8 }}
                                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <p className="text-lg leading-relaxed text-muted-foreground mb-6" {...props}>
                                            {children}
                                        </p>
                                    </motion.div>
                                ),
                                ul: ({ ...props }) => <ul className="list-disc list-inside space-y-2 mb-6 ml-4 text-muted-foreground" {...props} />,
                                ol: ({ ...props }) => <ol className="list-decimal list-inside space-y-2 mb-6 ml-4 text-muted-foreground" {...props} />,
                                li: ({ ...props }) => <li className="pl-2" {...props} />,
                                blockquote: ({ ...props }) => (
                                    <blockquote className="border-l-4 border-secondary bg-secondary/10 p-6 rounded-r-xl my-8 italic text-xl text-foreground" {...props} />
                                ),
                                a: ({ href, ...props }) => {
                                    const safeHref = getSafeExternalUrl(href || '');
                                    if (!safeHref) {
                                        return <span {...props} />;
                                    }
                                    return (
                                        <a
                                            {...props}
                                            href={safeHref}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        />
                                    );
                                },
                                img: ({ src, alt }) => {
                                    const safeSrc = getSafeExternalUrl(src || '');
                                    if (!safeSrc) {
                                        return alt ? (
                                            <span className="block my-8 text-center text-sm text-muted-foreground italic">{alt}</span>
                                        ) : null;
                                    }
                                    return (
                                        <figure className="block my-8">
                                            <img
                                                className="block w-full h-auto max-h-[70vh] object-contain !rounded-2xl shadow-lg bg-secondary/20"
                                                src={safeSrc}
                                                alt={alt || ''}
                                            />
                                            {alt && <figcaption className="block text-center text-sm text-muted-foreground mt-2 italic">{alt}</figcaption>}
                                        </figure>
                                    );
                                },
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </RevealSection>

                    {/* Linked Product(s) */}
                    {slug && <LinkedProductCard slug={slug} />}

                    {/* Share & Tags */}
                    <RevealSection className="mt-16 pt-8 border-t border-border">

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
                            <RevealItem className="text-lg font-bold flex items-center gap-2">
                                <Share2 className="h-5 w-5 text-primary" />
                                <span>Beitrag teilen</span>
                            </RevealItem>
                            <div className="flex gap-2">
                                <motion.button
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
                                    whileHover={{ y: -2, scale: 1.03 }}
                                    whileTap={{ scale: 0.96 }}
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
                                </motion.button>
                                <motion.a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-full bg-secondary hover:bg-[#1877F2]/10 hover:text-[#1877F2] transition-colors text-muted-foreground"
                                    title="Auf Facebook teilen"
                                    whileHover={{ y: -2, scale: 1.03 }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    <Facebook className="h-5 w-5" />
                                </motion.a>
                                <motion.a
                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-full bg-secondary hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] transition-colors text-muted-foreground"
                                    title="Auf Twitter teilen"
                                    whileHover={{ y: -2, scale: 1.03 }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    <Twitter className="h-5 w-5" />
                                </motion.a>
                                <motion.a
                                    href={`mailto:?subject=${encodeURIComponent(post.title)}&body=Schau dir diesen Artikel an: ${encodeURIComponent(window.location.href)}`}
                                    className="p-3 rounded-full bg-secondary hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                                    title="Per E-Mail senden"
                                    whileHover={{ y: -2, scale: 1.03 }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    <Mail className="h-5 w-5" />
                                </motion.a>
                            </div>
                        </div>

                        {/* Tags Footer */}
                        <RevealSection className="flex flex-wrap gap-2" amount={0.25}>
                            {post.tags?.map(tag => (
                                <RevealItem key={tag} soft className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                                    <Tag className="h-3 w-3 mr-2" />
                                    {tag}
                                </RevealItem>
                            ))}
                        </RevealSection>

                        <RevealItem className="mt-8">
                            <Link
                                to="/blog"
                                className="inline-flex items-center text-sm text-primary/80 hover:text-primary transition-colors font-medium backdrop-blur-sm bg-background/30 px-3 py-1 rounded-full"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Zurück zum Magazin
                            </Link>
                        </RevealItem>
                    </RevealSection>
                </div>
            </div>
        </article>
    );
}
