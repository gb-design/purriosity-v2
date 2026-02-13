import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductModal from './components/products/ProductModal';

// Lazy load ProductDetail page
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

function App() {
    const location = useLocation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const background = (location.state as any)?.background;

    return (
        <div className="min-h-screen flex flex-col bg-background text-text transition-colors duration-300">
            <Header />
            <main className="flex-1">
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <Routes location={background || location}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                    </Routes>
                </Suspense>

                {/* Show Modal only if we have a background location */}
                {background && (
                    <Routes>
                        <Route path="/product/:id" element={<ProductModal />} />
                    </Routes>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default App;
