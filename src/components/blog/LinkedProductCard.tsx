import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { mapDbProductToProduct } from '../../lib/productMapper';
import type { Product } from '../../types/product';

interface LinkedProductCardProps {
  slug: string;
}

export default function LinkedProductCard({ slug }: LinkedProductCardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchLinkedProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('blog_article_url', `/blog/${slug}`)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching linked products:', error);
        return;
      }

      if (data && data.length > 0) {
        setProducts(data.map((item: Record<string, unknown>) => mapDbProductToProduct(item)));
      }
    };

    if (slug) {
      fetchLinkedProducts();
    }
  }, [slug]);

  if (products.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="my-12"
    >
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] via-transparent to-primary/[0.03]">
        {/* Subtle decorative element */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/[0.06] rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary/[0.04] rounded-full blur-xl pointer-events-none" />

        <div className="relative p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/15">
              <ShoppingBag className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary/70">
              {products.length === 1 ? 'Produkt aus diesem Artikel' : 'Produkte aus diesem Artikel'}
            </span>
          </div>

          {/* Product(s) */}
          <div className={`flex flex-col ${products.length > 1 ? 'gap-3' : ''}`}>
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                state={{ background: location }}
                className="group flex items-center gap-4 rounded-xl transition-all duration-300 hover:bg-primary/[0.06] -mx-2 px-2 py-2"
              >
                {/* Product Image */}
                {product.images?.[0] && (
                  <div className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-border/60 bg-secondary/30">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-bold text-foreground text-sm sm:text-base leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {product.title}
                  </h4>
                  {product.shortDescription && (
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                      {product.shortDescription}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:scale-105">
                  <ArrowRight className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
