import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { useCategories } from '../../hooks/useCategories';

// Prevent body scroll when modal is open
const handleBodyScroll = (isOpen: boolean) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
};
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2,
  Image as ImageIcon,
  Check,
  X,
  Star,
  Trash,
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  short_description: string;
  images: string[];
  affiliate_url: string;
  tags: string[];
  categories: string[];
  featured_image_url: string;
  is_active: boolean;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const tagsDropdownRef = useRef<HTMLInputElement>(null);
  const [tagsDropdownPosition, setTagsDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isActiveSupported, setIsActiveSupported] = useState(true);
  const { categories: availableCategories, loading: categoriesLoading } = useCategories();

  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    description: '',
    short_description: '',
    affiliate_url: '',
    tags: [],
    categories: [],
    images: [],
    featured_image_url: '',
    is_active: true,
  });

  useEffect(() => {
    fetchProducts();
    fetchAllTags();
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
      if (data && data.length > 0) {
        const hasIsActive = data.some((item: Record<string, unknown>) =>
          Object.prototype.hasOwnProperty.call(item, 'is_active')
        );
        setIsActiveSupported(hasIsActive);
      } else {
        setIsActiveSupported(true);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllTags = async () => {
    try {
      const { data, error } = await supabase.from('products').select('tags');
      if (error) throw error;

      const tagSet = new Set<string>();
      data?.forEach((product: { tags: string[] | null }) => {
        product.tags?.forEach((tag: string) => {
          tagSet.add(tag.toLowerCase().trim());
        });
      });

      setAllTags(Array.from(tagSet).sort());
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const calculateDropdownPosition = (ref: React.RefObject<HTMLInputElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    return {
      top: rect.bottom - 4,
      left: rect.left,
      width: rect.width,
    };
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
        affiliate_url: '',
        tags: [],
        categories: [],
        images: [],
        featured_image_url: '',
        is_active: true,
      });
    }
    setShowTagsDropdown(false);
    setIsFormOpen(true);
    handleBodyScroll(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    handleBodyScroll(false);
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
        const { error } = await supabase.from('products').insert([formData]);
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
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Fehler beim Löschen des Produkts.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('media').getPublicUrl(filePath);

      const newImages = [...(formData.images || [])];
      newImages[index] = publicUrl;
      setFormData({ ...formData, images: newImages });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Fehler beim Bild-Upload.');
    } finally {
      setIsUploading(false);
    }
  };
  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold">Produkte</h1>
          <p className="text-muted-foreground mt-1">
            Verwalte deine Affiliate-Produkte und kuratierten Fundstücke.
          </p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="h-5 w-5" />
          Produkt hinzufügen
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 mb-8">
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

      {!isActiveSupported && (
        <div className="bg-blue-500/10 border border-blue-500/30 text-blue-700 p-4 rounded-2xl mb-8">
          ⚠️ Deine Supabase-Tabelle{' '}
          <code className="bg-blue-500/20 px-1.5 py-0.5 rounded">products</code>{' '}
          hat noch keine{' '}
          <code className="bg-blue-500/20 px-1.5 py-0.5 rounded">is_active</code>-Spalte. Bitte führe{' '}
          <code className="bg-blue-500/20 px-1.5 py-0.5 rounded">supabase_products_activation.sql</code>{' '}
          aus, um die Aktiv-Logik zu aktivieren – bis dahin gelten alle Produkte als aktiv.
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Produkt
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Tags
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    Keine Produkte gefunden.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                          {product.featured_image_url ? (
                            <img
                              src={product.featured_image_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm line-clamp-1">{product.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {product.short_description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          product.is_active !== false
                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                            : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                        }`}
                      >
                        {product.is_active !== false ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-1.5 py-0.5 bg-secondary rounded-md border border-border"
                          >
                            {tag}
                          </span>
                        ))}
                        {product.tags.length > 2 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{product.tags.length - 2}
                          </span>
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

      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={handleCloseForm}
          />
          <div className="relative bg-card border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
            <header className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
              <div>
                <h2 className="text-xl font-bold">
                  {editingProduct ? 'Produkt bearbeiten' : 'Neues Produkt hinzufügen'}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {editingProduct
                    ? 'Ändere die Details deines Produkts.'
                    : 'Erstelle ein neues Highlight für deine Community.'}
                </p>
              </div>
              <button
                onClick={handleCloseForm}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </header>

            <form onSubmit={handleSave} className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    <label className="block text-sm font-bold mb-2">Kurzbeschreibung</label>
                    <input
                      required
                      type="text"
                      value={formData.short_description}
                      onChange={(e) =>
                        setFormData({ ...formData, short_description: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                      placeholder="z.B. Der leiseste Trinkbrunnen der Welt."
                    />
                  </div>
                </div>

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
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_active !== false}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-4 h-4 rounded border-border cursor-pointer"
                      />
                      <span className="text-sm font-bold">Produkt aktiv</span>
                    </label>
                    <p className="text-xs text-muted-foreground mt-1 ml-7">
                      Inaktive Produkte erscheinen nicht im Shop
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags with Autocomplete */}
              <div className="relative z-0">
                <label className="block text-sm font-bold mb-2">Tags</label>
                <input
                  ref={tagsDropdownRef}
                  type="text"
                  placeholder="Tippen oder Enter..."
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  onFocus={() => {
                    const pos = calculateDropdownPosition(tagsDropdownRef);
                    if (pos) setTagsDropdownPosition(pos);
                    setShowTagsDropdown(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget;
                      const value = input.value.trim().toLowerCase();
                      if (value && !(formData.tags || []).includes(value)) {
                        setFormData({ ...formData, tags: [...(formData.tags || []), value] });
                        input.value = '';
                      }
                    }
                  }}
                  onBlur={() => setTimeout(() => setShowTagsDropdown(false), 200)}
                  onChange={(e) => {
                    if (e.currentTarget.value.includes(',')) {
                      const tags = e.currentTarget.value
                        .split(',')
                        .map((t) => t.trim().toLowerCase())
                        .filter((t) => t);
                      const newTags = [...new Set([...(formData.tags || []), ...tags])];
                      setFormData({ ...formData, tags: newTags });
                      e.currentTarget.value = '';
                    }
                  }}
                />

                {formData.tags && formData.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-secondary text-foreground text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tags: formData.tags?.filter((t) => t !== tag),
                            })
                          }
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {showTagsDropdown && (
                  <div
                    className={`fixed bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto z-[109]`}
                    style={{
                      top: `${tagsDropdownPosition.top}px`,
                      left: `${tagsDropdownPosition.left}px`,
                      width: `${tagsDropdownPosition.width}px`,
                    }}
                  >
                    {allTags.length > 0 ? (
                      allTags.map((tag) => {
                        const isSelected = formData.tags?.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const currentTags = formData.tags || [];
                              setFormData({
                                ...formData,
                                tags: isSelected
                                  ? currentTags.filter((t) => t !== tag)
                                  : [...currentTags, tag],
                              });
                            }}
                            className={`w-full text-left px-4 py-2 transition-all border-b border-border last:border-b-0 ${isSelected ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted'}`}
                          >
                            {tag}
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-4 py-2 text-xs text-muted-foreground">
                        Keine Tags vorhanden
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold">Kategorien</label>
                <p className="text-xs text-muted-foreground">
                  Wähle die passenden Filterkategorien aus (Mehrfachauswahl möglich).
                </p>
                {categoriesLoading ? (
                  <p className="text-xs text-muted-foreground">Kategorien werden geladen...</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map((category) => {
                      const selected = (formData.categories || []).includes(category.name);
                      return (
                        <button
                          type="button"
                          key={category.id}
                          onClick={() => {
                            const current = formData.categories || [];
                            const next = selected
                              ? current.filter((c) => c !== category.name)
                              : [...current, category.name];
                            setFormData({ ...formData, categories: next });
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                            selected
                              ? 'bg-primary text-primary-foreground border-primary shadow'
                              : 'bg-background border-border text-foreground hover:border-primary'
                          }`}
                        >
                          <span>{category.emoji}</span>
                          <span>{category.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
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

              {/* Images Management */}
              <div className="space-y-6">
                <label className="block text-sm font-bold">Bilder (bis zu 5)</label>
                <div className="space-y-4">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.images?.[index] || ''}
                          onChange={(e) => {
                            const newImages = [...(formData.images || [])];
                            newImages[index] = e.target.value;
                            setFormData({ ...formData, images: newImages });
                          }}
                          className="flex-1 px-4 py-2 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all font-mono text-xs"
                          placeholder={`Bild ${index + 1} URL...`}
                        />
                        <label className="relative cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, index)}
                            disabled={isUploading}
                            className="hidden"
                          />
                          <div className="p-2 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-all flex items-center justify-center">
                            {isUploading ? (
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            ) : (
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </label>
                        {formData.images?.[index] && (
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  featured_image_url: formData.images?.[index] || '',
                                })
                              }
                              title="Als Hauptbild setzen"
                              className={`p-2 rounded-lg transition-all ${formData.featured_image_url === formData.images?.[index] ? 'bg-primary/20 text-primary border border-primary' : 'bg-muted border border-border hover:bg-muted/80'}`}
                            >
                              <Star className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const newImages =
                                  formData.images?.filter((_, i) => i !== index) || [];
                                setFormData({ ...formData, images: newImages });
                              }}
                              className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-all"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      {formData.images?.[index] && (
                        <div className="w-full h-24 rounded-lg bg-muted border border-border overflow-hidden">
                          <img
                            src={formData.images[index]}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {formData.featured_image_url && (
                  <div className="p-4 bg-muted rounded-xl border border-border">
                    <p className="text-xs font-bold mb-3 text-muted-foreground">
                      Hauptbild Vorschau:
                    </p>
                    <img
                      src={formData.featured_image_url}
                      alt="Featured"
                      className="w-full max-h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
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
                  {isSaving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Check className="h-5 w-5" />
                  )}
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
