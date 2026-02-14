import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ExternalLink,
    Loader2,
    Image as ImageIcon,
    Check,
    X
} from 'lucide-react';

interface Product {
    id: string;
    title: string;
    description: string;
    short_description: string;
    price: number;
    currency: string;
    images: string[];
    affiliate_url: string;
    tags: string[];
}

export default function ProductManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Product>>({
        title: '',
        description: '',
        short_description: '',
        price: 0,
        currency: 'EUR',
        affiliate_url: '',
        tags: [],
        images: []
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenForm = (product: Product | null = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData(product);
        } else {
            setEditingProduct(null);
            setFormData({
                title: '',
                description: '',
                short_description: '',
                price: 0,
                currency: 'EUR',
                affiliate_url: '',
                tags: [],
                images: []
            });
        }
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (editingProduct) {
                const { error } = await supabase
                    .from('products')
                    .update(formData)
                    .eq('id', editingProduct.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([formData]);
                if (error) throw error;
            }
            await fetchProducts();
            handleCloseForm();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Fehler beim Speichern des Produkts.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bist du sicher, dass du dieses Produkt löschen möchtest?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);
            if (error) throw error;
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Fehler beim Löschen des Produkts.');
        }
    };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-display font-bold">Produkte</h1>
                    <p className="text-muted-foreground mt-1">Verwalte deine Affiliate-Produkte und kuratierten Fundstücke.</p>
                </div>
                <button
                    onClick={() => handleOpenForm()}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="h-5 w-5" />
                    Produkt hinzufügen
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-card border border-border rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Produkte durchsuchen..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Produkt</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Preis</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Tags</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Aktionen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        Keine Produkte gefunden.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                            <ImageIcon className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm line-clamp-1">{product.title}</p>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">{product.short_description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
                                                Aktiv
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-mono font-medium">
                                                {product.price.toFixed(2)} {product.currency}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {product.tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-secondary rounded-md border border-border">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {product.tags.length > 2 && (
                                                    <span className="text-[10px] text-muted-foreground">+{product.tags.length - 2}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <a
                                                    href={product.affiliate_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-all"
                                                    title="Provider Link"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                                <button
                                                    onClick={() => handleOpenForm(product)}
                                                    className="p-2 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-all"
                                                    title="Bearbeiten"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-all"
                                                    title="Löschen"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleCloseForm} />
                    <div className="relative bg-card border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
                        <header className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
                            <div>
                                <h2 className="text-xl font-bold">
                                    {editingProduct ? 'Produkt bearbeiten' : 'Neues Produkt hinzufügen'}
                                </h2>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {editingProduct ? 'Ändere die Details deines Produkts.' : 'Erstelle ein neues Highlight für deine Community.'}
                                </p>
                            </div>
                            <button onClick={handleCloseForm} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </header>

                        <form onSubmit={handleSave} className="p-6 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Basic Info */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Titel</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                            placeholder="z.B. Purriosity Trinkbrunnen Platinum"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Kurzbeschreibung (für Karten)</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.short_description}
                                            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                                            className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                            placeholder="z.B. Der leiseste Trinkbrunnen der Welt."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Preis</label>
                                            <input
                                                required
                                                type="number"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                                className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Währung</label>
                                            <select
                                                value={formData.currency}
                                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                                className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                            >
                                                <option value="EUR">EUR (€)</option>
                                                <option value="USD">USD ($)</option>
                                                <option value="GBP">GBP (£)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Links & Media */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Affiliate Link</label>
                                        <input
                                            required
                                            type="url"
                                            value={formData.affiliate_url}
                                            onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value })}
                                            className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all font-mono text-sm"
                                            placeholder="https://amazon.de/..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Bild URL</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={formData.images?.[0] || ''}
                                                onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                                                className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all font-mono text-xs"
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </div>
                                        {formData.images?.[0] && (
                                            <div className="mt-2 h-32 w-full rounded-xl overflow-hidden border border-border">
                                                <img src={formData.images[0]} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Ausführliche Beschreibung</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                                    placeholder="Beschreibe das Produkt im Detail..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Tags (Komma-getrennt)</label>
                                <input
                                    type="text"
                                    value={formData.tags?.join(', ')}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t !== '') })}
                                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="Smart, Budget, Weird, Funny"
                                />
                            </div>

                            <footer className="pt-6 border-t border-border flex justify-end gap-3 sticky bottom-0 bg-card">
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-all"
                                >
                                    Abbrechen
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                                    {editingProduct ? 'Änderungen speichern' : 'Produkt erstellen'}
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
