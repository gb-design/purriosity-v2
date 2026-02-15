import { useState } from 'react';
import { Trash2, Plus, GripVertical, Check, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useSettings } from '../../hooks/useSettings';

export default function AdminSettings() {
  const {
    categories,
    loading,
    error,
    isUsingFallback,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  } = useSettings();
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmoji, setEditEmoji] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddCategory = async () => {
    if (!newName.trim() || !newEmoji.trim()) {
      showToast('Name und Emoji sind erforderlich');
      return;
    }

    const result = await addCategory(newName, newEmoji);
    if (result.success) {
      setNewName('');
      setNewEmoji('');
      showToast('Kategorie hinzugefügt ✓');
    } else {
      showToast(`Fehler: ${result.error}`);
    }
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editName.trim() || !editEmoji.trim()) {
      showToast('Name und Emoji sind erforderlich');
      return;
    }

    const result = await updateCategory(id, editName, editEmoji);
    if (result.success) {
      setEditingId(null);
      showToast('Kategorie aktualisiert ✓');
    } else {
      showToast(`Fehler: ${result.error}`);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Diese Kategorie wirklich löschen?')) {
      const result = await deleteCategory(id);
      if (result.success) {
        showToast('Kategorie gelöscht ✓');
      } else {
        showToast(`Fehler: ${result.error}`);
      }
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropReorder = async (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = categories.findIndex((c) => c.id === draggedId);
    const targetIndex = categories.findIndex((c) => c.id === targetId);

    const newCategories = [...categories];
    [newCategories[draggedIndex], newCategories[targetIndex]] = [
      newCategories[targetIndex],
      newCategories[draggedIndex],
    ];

    await reorderCategories(newCategories);
    setDraggedId(null);
    showToast('Reihenfolge aktualisiert ✓');
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Einstellungen</h1>
        <p className="text-muted-foreground mt-2">
          Verwalte die Filterkategorien für deine Produkte
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {isUsingFallback && (
        <div className="bg-blue-500/10 border border-blue-500/30 text-blue-700 p-4 rounded-lg mb-6">
          💾 Du verwendest Standard-Kategorien. Um Änderungen persistent zu speichern, führe bitte
          die <code className="bg-blue-500/20 px-2 py-1 rounded">supabase_tags_settings.sql</code>{' '}
          in Supabase aus!
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
          {toastMessage}
        </div>
      )}

      {/* Add New Category */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-6">Neue Kategorie hinzufügen</h2>
        <div className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-muted-foreground block mb-2">
              Kategoriename
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="z.B. Spielzeug"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
          </div>
          <div className="min-w-[80px]">
            <label className="text-sm font-medium text-muted-foreground block mb-2">Emoji</label>
            <input
              type="text"
              value={newEmoji}
              onChange={(e) => setNewEmoji(e.target.value)}
              placeholder="🎾"
              maxLength={2}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl"
            />
          </div>
          <button
            onClick={handleAddCategory}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Hinzufügen
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">Kategorien ({categories.length})</h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">⏳</div>
            <p className="text-muted-foreground mt-2">Kategorien werden geladen...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Keine Kategorien vorhanden</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                draggable
                onDragStart={() => handleDragStart(category.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDropReorder(category.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  draggedId === category.id
                    ? 'bg-primary/10 border-primary/50 opacity-50'
                    : 'bg-muted/50 border-transparent hover:border-border'
                } cursor-grab active:cursor-grabbing`}
              >
                <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />

                {editingId === category.id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-3 py-1 border border-border rounded bg-background text-sm"
                    />
                    <input
                      type="text"
                      value={editEmoji}
                      onChange={(e) => setEditEmoji(e.target.value)}
                      maxLength={2}
                      className="w-12 px-3 py-1 border border-border rounded bg-background text-center text-lg"
                    />
                    <button
                      onClick={() => handleUpdateCategory(category.id)}
                      className="p-2 text-green-600 hover:bg-green-600/10 rounded-lg transition-colors"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-2xl min-w-[2.5rem] text-center">{category.emoji}</div>
                    <div className="flex-1">
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Position: {category.display_order + 1}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingId(category.id);
                        setEditName(category.name);
                        setEditEmoji(category.emoji);
                      }}
                      className="px-3 py-1 text-sm bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-red-600 hover:bg-red-600/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        💡 Tipp: Ziehe Kategorien per Drag & Drop, um die Reihenfolge zu ändern
      </p>
    </AdminLayout>
  );
}
