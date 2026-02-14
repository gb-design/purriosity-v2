import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../hooks/useAdmin';
import {
    Package,
    Heart,
    TrendingUp,
    Users,
    ArrowUpRight
} from 'lucide-react';

export default function AdminDashboard() {
    const { profile } = useAdmin();

    const stats = [
        { label: 'Produkte', value: '42', icon: Package, change: '+5', color: 'bg-blue-500' },
        { label: 'Purrs', value: '1.2k', icon: Heart, change: '+12%', color: 'bg-pink-500' },
        { label: 'Views', value: '8.4k', icon: TrendingUp, change: '+18%', color: 'bg-indigo-500' },
        { label: 'Admin Users', value: '1', icon: Users, change: '0', color: 'bg-amber-500' },
    ];

    return (
        <AdminLayout>
            <div className="mb-10">
                <h1 className="text-3xl font-display font-bold">Willkommen zurück, {profile?.email?.split('@')[0]}! 👋</h1>
                <p className="text-muted-foreground mt-2">Das passiert heute auf Purriosity.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 text-foreground`}>
                                <stat.icon className={`h-6 w-6`} />
                            </div>
                            <span className="text-xs font-bold text-green-500 flex items-center bg-green-500/10 px-2 py-1 rounded-full">
                                {stat.change}
                                <ArrowUpRight className="h-3 w-3 ml-1" />
                            </span>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                        <p className="text-3xl font-bold mt-1 font-mono tracking-tighter">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity / Next Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-6">Letzte Produkte</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-transparent hover:border-border transition-colors cursor-pointer group">
                                <div className="h-12 w-12 rounded-lg bg-secondary overflow-hidden">
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">📦</div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold group-hover:text-primary transition-colors">Abgefahrenes Katzen-Gadget #{i}</p>
                                    <p className="text-xs text-muted-foreground">Vor 2 Stunden hinzugefügt</p>
                                </div>
                                <span className="text-xs font-bold px-2 py-1 bg-background border border-border rounded-full">Edit</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-6">System Status</h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Supabase Connection</span>
                            <span className="flex items-center gap-2 text-sm font-bold text-green-500">
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                Online
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Storage (Media)</span>
                            <span className="text-sm font-bold">0.4 GB / 5 GB</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Letztes Backup</span>
                            <span className="text-sm font-bold">Heute, 02:00</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
