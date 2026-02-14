import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import { Loader2 } from 'lucide-react';

export default function AdminRoute() {
    const { isAdmin, loading } = useAdmin();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
}
