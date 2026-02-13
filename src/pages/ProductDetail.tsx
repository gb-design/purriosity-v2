import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types/product';
import { Loader2, ArrowLeft, Share2, Heart } from 'lucide-react';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState<string>('');

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                const productData = data as Product;
                setProduct(productData);
                if (productData.images && productData.images.length > 0) {
                    setActiveImage(productData.images[0]);
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to load product details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Oops!</h2>
                <p className="text-muted-foreground mb-8">{error || 'Product not found.'}</p>
                <Link to="/" className="text-primary hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            {/* Breadcrumb / Back Navigation */}
            <div className="mb-8">
                <Link to="/" className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Discovery
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
                {/* Left Column: Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-[4/5] w-full bg-secondary/30 rounded-2xl overflow-hidden shadow-sm relative group">
                        <img
                            src={activeImage}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* Thumbnails (only if more than 1 image) */}
                    {product.images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(img)}
                                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-border'
                                        }`}
                                >
                                    <img src={img} alt={`${product.title} view ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Product Info */}
                <div className="flex flex-col">
                    <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="flex flex-wrap gap-2">
                            {product.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" aria-label="Share">
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
                        {product.title}
                    </h1>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="text-3xl font-bold text-accent">
                            {product.price} {product.currency}
                        </div>
                        <div className="h-6 w-px bg-border"></div>
                        <div className="flex items-center gap-1 text-primary font-medium">
                            <span className="text-lg">🐾 {product.purrCount || 0}</span>
                            <span className="text-sm text-muted-foreground">Purrs</span>
                        </div>
                    </div>

                    <div className="prose prose-lg text-muted-foreground mb-10 max-w-none">
                        <p>{product.description}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                        <a
                            href={product.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-lg px-8 py-4 rounded-full hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-lg shadow-primary/20"
                        >
                            Zum Produkt ↗
                        </a>
                        <button className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-bold text-lg px-8 py-4 rounded-full hover:bg-secondary/80 transition-all hover:scale-[1.02]">
                            <Heart className="h-5 w-5" />
                            Purr This
                        </button>
                    </div>

                    <p className="text-xs text-muted-foreground mt-6 text-center sm:text-left">
                        *Wir erhalten möglicherweise eine Provision für Käufe über diesen Link.
                    </p>
                </div>
            </div>
        </div>
    );
}
