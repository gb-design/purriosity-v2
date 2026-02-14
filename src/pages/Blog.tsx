import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, Calendar, User } from 'lucide-react';

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

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('*')
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

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-20 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
                    Das Purr-Magazin 🐾
                </h1>
                <p className="text-xl text-muted-foreground">
                    Geschichten, Tipps und Verrücktes aus der Welt der Katzen.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group flex flex-col bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-border"
                    >
                        {/* Image */}
                        <div className="aspect-[16/9] overflow-hidden bg-secondary">
                            <img
                                src={post.cover_image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 flex flex-col">
                            <div className="flex gap-2 mb-3">
                                {post.tags.slice(0, 2).map(tag => (
                                    <span key={tag} className="text-xs font-medium px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                {post.title}
                            </h2>

                            <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                                {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto border-t border-border pt-4">
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
                ))}
            </div>
        </div>
    );
}
