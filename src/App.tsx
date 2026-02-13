import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductModal from './components/products/ProductModal';

function App() {
    const location = useLocation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const background = (location.state as any)?.background;

    return (
        <div className="min-h-screen flex flex-col bg-background text-text transition-colors duration-300">
            <Header />
            <main className="flex-1">
                <Routes location={background || location}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                </Routes>

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
