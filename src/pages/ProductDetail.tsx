import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types/product';
import { Loader2, ArrowLeft } from 'lucide-react';
import { mapDbProductToProduct } from '../lib/productMapper';
import { fetchRelatedProducts } from '../lib/productService';
import ProductDetailView from '../components/products/ProductDetailView';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [relatedLoading, setRelatedLoading] = useState(false);

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

                const productData = mapDbProductToProduct(data as Record<string, unknown>);
                setProduct(productData);
                setRelatedLoading(true);
                const related = await fetchRelatedProducts(productData, 6);
                setRelatedProducts(related);
                setRelatedLoading(false);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to load product details.');
                setRelatedProducts([]);
            } finally {
                setIsLoading(false);
                setRelatedLoading(false);
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

            <ProductDetailView
                product={product}
                relatedProducts={relatedProducts}
                relatedLoading={relatedLoading}
            />
        </div>
    );
}
