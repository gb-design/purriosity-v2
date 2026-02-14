import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../lib/supabase';
import { Loader2, Calendar, User, ArrowLeft, Tag } from 'lucide-react';

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
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>

                    {/* Tags Footer */}
                    <div className="mt-16 pt-8 border-t border-border">
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
