import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  FileText,
  Check,
  X,
  Calendar,
  User as UserIcon,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author_name: string;
  published_at: string;
  tags: string[];
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    author_name: 'Dr. Mauz',
    published_at: new Date().toISOString(),
    tags: [],
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenForm = (post: BlogPost | null = null) => {
    if (post) {
      setEditingPost(post);
      setFormData(post);
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        cover_image: '',
        author_name: 'Dr. Mauz',
        published_at: new Date().toISOString(),
        tags: [],
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPost(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Auto-generate slug if missing
      const finalData = {
        ...formData,
        slug:
          formData.slug ||
          formData.title
            ?.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, ''),
      };

      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(finalData)
          .eq('id', editingPost.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert([finalData]);
        if (error) throw error;
      }
      await fetchPosts();
      handleCloseForm();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Fehler beim Speichern des Beitrags.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bist du sicher, dass du diesen Beitrag löschen möchtest?')) return;

    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Fehler beim Löschen des Beitrags.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('media').getPublicUrl(filePath);

      setFormData({ ...formData, cover_image: publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Fehler beim Bild-Upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mdeOptions = useMemo(
    () => ({
      spellChecker: false,
      placeholder: 'Schreibe deinen Beitrag in Markdown...',
      status: false,
      minHeight: '300px',
      autofocus: false,
    }),
    []
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold">Magazin</h1>
          <p className="text-muted-foreground mt-1">Erstelle und verwalte deine Blog-Beiträge.</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="h-5 w-5" />
          Beitrag schreiben
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Beiträge durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Posts Grid */}
      <div className={`grid grid-cols-1 gap-6 ${isLoading ? 'opacity-50' : ''}`}>
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
            Keine Beiträge gefunden.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all group"
            >
              <div className="w-full md:w-48 h-32 rounded-xl bg-muted overflow-hidden flex-shrink-0 border border-border">
                {post.cover_image ? (
                  <img
                    src={post.cover_image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <FileText className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />{' '}
                    {new Date(post.published_at).toLocaleDateString('de-DE')}
                  </span>
                  <span className="flex items-center gap-1">
                    <UserIcon className="h-3 w-3" /> {post.author_name}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors truncate">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 bg-secondary rounded-full border border-border uppercase font-bold tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                <button
                  onClick={() => handleOpenForm(post)}
                  className="flex-1 md:flex-none p-3 hover:bg-primary/10 rounded-xl text-primary transition-all flex items-center justify-center gap-2 font-bold text-sm"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="flex-1 md:flex-none p-3 hover:bg-destructive/10 rounded-xl text-destructive transition-all flex items-center justify-center gap-2 font-bold text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  Löschen
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Post Editor Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={handleCloseForm}
          />
          <div className="relative bg-card border border-border w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
            <header className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-20">
              <div>
                <h2 className="text-2xl font-display font-bold">
                  {editingPost ? 'Beitrag bearbeiten' : 'Neuer Magazin-Beitrag'}
                </h2>
              </div>
              <button
                onClick={handleCloseForm}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </header>

            <form onSubmit={handleSave} className="p-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  <div>
                    <label className="block text-sm font-bold mb-3">Titel</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-6 py-4 bg-muted border border-border rounded-2xl text-xl font-bold focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                      placeholder="Der ultimative Guide für Katzenbesitzer..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-3">Inhalt (Markdown)</label>
                    <div className="prose-editor">
                      <SimpleMDE
                        value={formData.content}
                        onChange={(val) => setFormData({ ...formData, content: val })}
                        options={mdeOptions}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-bold mb-3">Vorschaubild</label>
                    <div className="space-y-4">
                      <div className="aspect-video rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative group">
                        {formData.cover_image ? (
                          <img
                            src={formData.cover_image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground">Kein Bild ausgewählt</p>
                          </div>
                        )}
                        <label className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                          {isUploading ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                          ) : (
                            <Upload className="h-8 w-8" />
                          )}
                        </label>
                      </div>
                      <input
                        type="text"
                        value={formData.cover_image}
                        onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                        className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-xs font-mono"
                        placeholder="Oder Bild-URL einfügen..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-3">
                      Zusammenfassung (Excerpt)
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full px-4 py-3 bg-muted border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-sm"
                      placeholder="Kurze Teaser-Beschreibung für die Blog-Übersicht..."
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Slug</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-4 py-2 bg-muted border border-border rounded-xl font-mono text-xs"
                        placeholder="beitrags-überschrift-hier"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Veröffentlichungsdatum</label>
                      <input
                        type="datetime-local"
                        value={formData.published_at?.slice(0, 16)}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            published_at: new Date(e.target.value).toISOString(),
                          })
                        }
                        className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Tags</label>
                    <input
                      type="text"
                      value={formData.tags?.join(', ')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tags: e.target.value
                            .split(',')
                            .map((t) => t.trim())
                            .filter((t) => t !== ''),
                        })
                      }
                      className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-xs"
                      placeholder="Health, Fun, Lifestyle"
                    />
                  </div>
                </div>
              </div>

              <footer className="pt-8 border-t border-border flex justify-end gap-3 sticky bottom-0 bg-card pb-2">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-8 py-4 rounded-2xl font-bold hover:bg-secondary transition-all"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="bg-primary text-primary-foreground px-12 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Check className="h-6 w-6" />
                  )}
                  {editingPost ? 'Beitrag aktualisieren' : 'Beitrag veröffentlichen'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
