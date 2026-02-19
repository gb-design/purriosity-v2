import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../hooks/useAdmin';
import { supabase } from '../../lib/supabase';
import { mapDbProductToProduct } from '../../lib/productMapper';
import type { Product } from '../../types/product';
import { Package, Heart, TrendingUp, Users, ArrowUpRight } from 'lucide-react';

interface StatShape {
    label: string;
    value: string;
    icon: typeof Package;
    color: string;
    badge?: string;
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat('de-DE', { numeric: 'auto' });

const formatRelativeTime = (baseDate: Date, input: string) => {
    const date = new Date(input);
    const diffSeconds = Math.round((date.getTime() - baseDate.getTime()) / 1000);
    const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
        { unit: 'year', seconds: 60 * 60 * 24 * 365 },
        { unit: 'month', seconds: 60 * 60 * 24 * 30 },
        { unit: 'week', seconds: 60 * 60 * 24 * 7 },
        { unit: 'day', seconds: 60 * 60 * 24 },
        { unit: 'hour', seconds: 60 * 60 },
        { unit: 'minute', seconds: 60 },
    ];

    for (const { unit, seconds } of units) {
        if (Math.abs(diffSeconds) >= seconds) {
            return relativeTimeFormatter.format(Math.round(diffSeconds / seconds), unit);
        }
    }

    return relativeTimeFormatter.format(diffSeconds, 'second');
};

export default function AdminDashboard() {
    const { profile } = useAdmin();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [adminUserCount, setAdminUserCount] = useState(0);
    const [statsError, setStatsError] = useState<string | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [now, setNow] = useState(() => new Date());

    const activeProductCount = useMemo(
        () => products.filter((item) => item.isActive !== false).length,
        [products]
    );
    const inactiveProductCount = useMemo(
        () => products.filter((item) => item.isActive === false).length,
        [products]
    );

    const stats = useMemo(() => {
        const totalProducts = products.length;
        const totalPurrs = products.reduce((sum, item) => sum + (item.purrCount ?? 0), 0);
        const totalViews = products.reduce((sum, item) => sum + (item.viewCount ?? 0), 0);

        const base: StatShape[] = [
            {
                label: 'Produkte',
                value: totalProducts.toLocaleString('de-DE'),
                icon: Package,
                color: 'bg-blue-500',
                badge: `${activeProductCount.toLocaleString('de-DE')} aktiv · ${inactiveProductCount.toLocaleString('de-DE')} inaktiv`,
            },
            {
                label: 'Purrs',
                value: totalPurrs.toLocaleString('de-DE'),
                icon: Heart,
                color: 'bg-pink-500',
                badge: 'Live Daten',
            },
            {
                label: 'Views',
                value: totalViews.toLocaleString('de-DE'),
                icon: TrendingUp,
                color: 'bg-indigo-500',
                badge: 'Live Daten',
            },
            {
                label: 'Admin Users',
                value: adminUserCount.toLocaleString('de-DE'),
                icon: Users,
                color: 'bg-amber-500',
                badge: 'Verifiziert',
            },
        ];

        return base;
    }, [products, adminUserCount, activeProductCount, inactiveProductCount]);

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 60_000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoadingStats(true);
            setStatsError(null);
            try {
                const [productsResponse, adminResponse] = await Promise.all([
                    supabase
                        .from('products')
                        .select(
                            'id, title, description, short_description, tags, categories, images, featured_image_url, affiliate_url, purr_count, view_count, is_active, created_at'
                        )
                        .order('created_at', { ascending: false }),
                    supabase
                        .from('profiles')
                        .select('id', { count: 'exact', head: true })
                        .eq('is_admin', true),
                ]);

                if (productsResponse.error) throw productsResponse.error;
                if (adminResponse.error) throw adminResponse.error;

                const mappedProducts = (productsResponse.data ?? []).map((row) => mapDbProductToProduct(row));
                setProducts(mappedProducts);
                setAdminUserCount(adminResponse.count ?? 0);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
                setStatsError('Live-Daten konnten nicht geladen werden. Bitte später erneut versuchen.');
            } finally {
                setLoadingStats(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formattedNow = new Intl.DateTimeFormat('de-DE', {
        dateStyle: 'full',
        timeStyle: 'short',
    }).format(now);

    return (
        <AdminLayout>
            <div className="mb-10">
                <h1 className="text-3xl font-display font-bold">Willkommen zurück, {profile?.email?.split('@')[0]}! 👋</h1>
                <p className="text-muted-foreground mt-2">Das passiert heute auf Purriosity.</p>
                <p className="text-xs text-muted-foreground mt-1">Stand: {formattedNow}</p>
            </div>

            {statsError && (
                <div className="mb-6 rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                    {statsError}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 text-foreground`}>
                                <stat.icon className={`h-6 w-6`} />
                            </div>
                            <span className="text-xs font-bold text-green-500 flex items-center bg-green-500/10 px-2 py-1 rounded-full">
                                Live
                                <ArrowUpRight className="h-3 w-3 ml-1" />
                            </span>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                        <p className="text-3xl font-bold mt-1 font-mono tracking-tighter">{loadingStats ? '…' : stat.value}</p>
                        {stat.badge && (
                            <p className="text-xs text-muted-foreground mt-2">{stat.badge}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Recent Activity / Next Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-6">Letzte Produkte</h2>
                    <div className="space-y-4">
                        {loadingStats ? (
                            <p className="text-sm text-muted-foreground">Lade aktuelle Produkte...</p>
                        ) : products.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Noch keine Produkte vorhanden.</p>
                        ) : (
                            products.slice(0, 4).map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-transparent hover:border-border transition-colors group"
                                >
                                    <div className="h-12 w-12 rounded-lg bg-secondary overflow-hidden">
                                        {product.images?.[0] ? (
                                            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">📦</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{product.title}</p>
                                        <p className="text-xs text-muted-foreground">{formatRelativeTime(now, product.createdAt)}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/admin/products')}
                                        className="text-xs font-bold px-2 py-1 bg-background border border-border rounded-full"
                                    >
                                        Verwalten
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-6">System Status</h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Supabase Connection</span>
                            <span
                                className={`flex items-center gap-2 text-sm font-bold ${
                                    statsError ? 'text-amber-600' : 'text-green-500'
                                }`}
                            >
                                <span
                                    className={`h-2 w-2 rounded-full ${statsError ? 'bg-amber-500' : 'bg-green-500'} animate-pulse`}
                                />
                                {statsError ? 'Eingeschränkt' : 'Online'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Storage (Media)</span>
                            <span className="text-sm font-bold">0.4 GB / 5 GB</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Aktive Produkte</span>
                            <span className="text-sm font-bold">
                                {loadingStats
                                    ? '…'
                                    : `${activeProductCount.toLocaleString('de-DE')} aktiv`}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Inaktive Produkte</span>
                            <span className="text-sm font-bold">
                                {loadingStats
                                    ? '…'
                                    : `${inactiveProductCount.toLocaleString('de-DE')} inaktiv`}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Letztes Backup</span>
                            <span className="text-sm font-bold">{formattedNow}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
