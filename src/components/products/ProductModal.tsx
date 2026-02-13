import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import ProductDetailView from './ProductDetailView';
import { mockProducts } from '../../data/mockProducts';

export default function ProductModal() {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = mockProducts.find((p) => p.id === id);

    useEffect(() => {
        // Disable body scroll when modal is open
        document.body.style.overflow = 'hidden';

        // Handle Escape key
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                navigate(-1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [navigate]);

    if (!product) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => navigate(-1)}
        >
            <div
                className="relative w-full max-w-5xl h-[90vh] bg-card rounded-2xl shadow-2xl overflow-y-auto overflow-x-hidden animate-in zoom-in-50 duration-300 slide-in-from-bottom-10"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 right-4 z-50 p-2 bg-background/50 hover:bg-background rounded-full transition-colors backdrop-blur text-foreground"
                >
                    <X className="w-6 h-6" />
                </button>
                <ProductDetailView product={product} isModal={true} />
            </div>
        </div>
    );
}
