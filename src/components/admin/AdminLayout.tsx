import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import {
    LayoutDashboard,
    Package,
    FileText,
    Settings,
    LogOut,
    ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { profile, signOut } = useAdmin();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignOut = async () => {
        await signOut();
        navigate('/admin/login');
    };

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { label: 'Produkte', icon: Package, path: '/admin/products' },
        { label: 'Magazin', icon: FileText, path: '/admin/blog' },
        { label: 'Einstellungen', icon: Settings, path: '/admin/settings' },
    ];

    return (
        <div className="flex min-h-screen bg-muted/30">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border sticky top-0 h-screen hidden lg:flex flex-col">
                <div className="p-6">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="font-display text-2xl font-bold text-primary">Purriosity</span>
                        <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">Admin</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group ${location.pathname === item.path
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </div>
                            {location.pathname === item.path && <ChevronRight className="h-4 w-4" />}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-secondary/50">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                                {profile?.email?.[0].toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{profile?.email}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Administrator</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Abmelden
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 flex flex-col">
                {/* Topbar (Mobile) */}
                <header className="lg:hidden bg-card border-b border-border h-16 flex items-center justify-between px-4 sticky top-0 z-50">
                    <span className="font-display font-bold text-primary">Purriosity Admin</span>
                    <button className="p-2 text-foreground">Menu</button>
                </header>

                <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
