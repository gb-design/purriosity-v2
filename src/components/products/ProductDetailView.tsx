import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Heart,
  Bookmark,
  BookmarkPlus,
  ExternalLink,
  Link as LinkIcon,
  LogIn,
  Mail,
  MessageCircle,
  Share2,
  UserPlus,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product';
import { formatPurrCount } from '../../lib/utils';
import { useProductPurr } from '../../hooks/useProductPurr';
import { useSavedProducts } from '../../hooks/useSavedProducts';
import { useAuth } from '../../hooks/useAuth';
import ProductCarousel from './ProductCarousel';

interface ProductDetailViewProps {
  product: Product;
  isModal?: boolean;
  relatedProducts?: Product[];
  relatedLoading?: boolean;
}

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=900&q=80';

type MenuItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  action?: () => void;
  href?: string;
  external?: boolean;
};

const normalizeLabel = (label: string) => label.trim().replace(/\s+/g, ' ');

const formatLabel = (label: string) => {
  const normalized = normalizeLabel(label);
  if (!normalized) return '';
  return normalized.replace(/(^|[\s-])([a-zäöüß])/g, (_, boundary: string, char: string) =>
    `${boundary}${char.toUpperCase()}`
  );
};

const getDisplayLabels = (labels?: (string | null | undefined)[]) => {
  if (!labels) return [];
  const seen = new Set<string>();
  const formatted: string[] = [];

  labels.forEach((label) => {
    if (!label) return;
    const normalized = normalizeLabel(label);
    if (!normalized) return;
    const key = normalized.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    formatted.push(formatLabel(normalized));
  });

  return formatted;
};

const buildGalleryImages = (product: Product) => {
  const validImages = (product.images || []).filter((img): img is string => Boolean(img));
  const candidates = validImages.length > 0 ? validImages : [PLACEHOLDER_IMAGE];
  return candidates.slice(0, 5);
};

export default function ProductDetailView({
    product,
    isModal = false,
    relatedProducts = [],
    relatedLoading = false,
}: ProductDetailViewProps) {
    const navigate = useNavigate();
    const location = useLocation();
  const { user } = useAuth();
    const { isSaved, toggleSave } = useSavedProducts();
    const saved = isSaved(product.id);
    const { isPurred, purrCount, togglePurr } = useProductPurr(product.id, product.purrCount);
  const [galleryImages, setGalleryImages] = useState<string[]>(buildGalleryImages(product));
  const [activeImage, setActiveImage] = useState<string>(buildGalleryImages(product)[0]);
  const categoryLabels = getDisplayLabels(product.categories);
  const tagLabels = getDisplayLabels(product.tags).slice(0, 10);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const optionsButtonRef = useRef<HTMLButtonElement>(null);
  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const nextImages = buildGalleryImages(product);
        setGalleryImages(nextImages);
        setActiveImage(nextImages[0]);
    }, [product]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}/product/${product.id}`);
    }
  }, [product.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (
        shareMenuOpen &&
        shareMenuRef.current &&
        !shareMenuRef.current.contains(target) &&
        shareButtonRef.current &&
        !shareButtonRef.current.contains(target)
      ) {
        setShareMenuOpen(false);
      }

      if (
        optionsMenuOpen &&
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(target) &&
        optionsButtonRef.current &&
        !optionsButtonRef.current.contains(target)
      ) {
        setOptionsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShareMenuOpen(false);
        setOptionsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [shareMenuOpen, optionsMenuOpen]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const resolvedShareUrl = shareUrl ||
    (typeof window !== 'undefined' ? `${window.location.origin}${location.pathname}${location.search}` : '');

  const mailSubject = encodeURIComponent(`Schau mal: ${product.title}`);
  const mailBody = encodeURIComponent(`${product.description || ''}\n\n${resolvedShareUrl}`);

  const handleCopyLink = async () => {
    if (!resolvedShareUrl) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(resolvedShareUrl);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = resolvedShareUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      setCopyStatus('copied');
    } catch (error) {
      console.error('Error copying link', error);
      setCopyStatus('error');
    }

    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const handleNavigateToAuth = (mode: 'login' | 'signup') => {
    const params = new URLSearchParams({ redirect: `${location.pathname}${location.search}` });
    if (mode === 'signup') {
      params.set('mode', 'signup');
    }
    navigate(`/login?${params.toString()}`);
  };

  const handleSaveFromMenu = async () => {
    const result = await toggleSave(product.id);
    if (result === 'auth_required') {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }
    setOptionsMenuOpen(false);
  };

  const shareItems: MenuItem[] = [
    {
      key: 'copy',
      label: copyStatus === 'copied' ? 'Link kopiert!' : copyStatus === 'error' ? 'Fehler beim Kopieren' : 'Link kopieren',
      icon: LinkIcon,
      action: handleCopyLink,
    },
    {
      key: 'mail',
      label: 'Per E-Mail teilen',
      icon: Mail,
      href: `mailto:?subject=${mailSubject}&body=${mailBody}`,
    },
    {
      key: 'whatsapp',
      label: 'Auf WhatsApp teilen',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${product.title} – ${resolvedShareUrl}`)}`,
      external: true,
    },
    {
      key: 'facebook',
      label: 'Auf Facebook teilen',
      icon: Share2,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(resolvedShareUrl)}`,
      external: true,
    },
  ];

  const optionItems: MenuItem[] = user
    ? [
        ...(!saved
          ? [
              {
                key: 'save',
                label: 'Produkt speichern',
                icon: BookmarkPlus,
                action: handleSaveFromMenu,
              },
            ]
          : []),
        {
          key: 'favorites',
          label: 'Zu meinen Favoriten',
          icon: Bookmark,
          action: () => {
            setOptionsMenuOpen(false);
            navigate('/favorites');
          },
        },
      ]
    : [
        {
          key: 'login',
          label: 'Einloggen',
          icon: LogIn,
          action: () => handleNavigateToAuth('login'),
        },
        {
          key: 'signup',
          label: 'Registrieren',
          icon: UserPlus,
          action: () => handleNavigateToAuth('signup'),
        },
      ];

  return (
    <div
      className={`bg-card w-full ${
        isModal ? 'rounded-xl overflow-hidden p-6 sm:p-8 lg:p-8' : 'min-h-screen'
      }`}
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Left Column: Image */}
        <div className={`flex flex-col ${isModal ? 'md:w-1/2' : 'w-full md:sticky md:top-20'}`}>
          <div
            className={`relative bg-black/5 flex items-center justify-center rounded-2xl overflow-hidden ${
              isModal ? 'min-h-[420px] max-h-[520px]' : 'w-full md:h-[70vh]'
            }`}
          >
            {isModal && (
              <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur transition-colors md:hidden"
              >
                <X className="w-6 h-6" />
              </button>
            )}

            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {galleryImages.length > 1 && (
            <div className="grid grid-cols-5 gap-3 mt-4">
              {galleryImages.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border transition-all ${
                    activeImage === img
                      ? 'border-primary ring-2 ring-primary/40'
                      : 'border-transparent hover:border-border'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} Ansicht ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div
          className={`flex flex-col p-6 md:p-8 lg:p-12 ${isModal ? 'md:w-1/2' : 'w-full max-w-2xl mx-auto'}`}
        >
          <div className="flex-1">
            {/* Header / Meta */}
            <div className="flex justify-end items-start gap-2 mb-4">
              <div className="flex gap-2 flex-shrink-0">
                <div className="relative">
                  <button
                    ref={shareButtonRef}
                    onClick={() => {
                      setShareMenuOpen((prev) => !prev);
                      setOptionsMenuOpen(false);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      shareMenuOpen ? 'bg-secondary text-primary' : 'text-text-secondary hover:bg-secondary'
                    }`}
                    aria-haspopup="menu"
                    aria-expanded={shareMenuOpen}
                    aria-label="Produkt teilen"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  {shareMenuOpen && (
                    <div
                      ref={shareMenuRef}
                      className="absolute right-0 mt-3 w-64 bg-card border border-border rounded-2xl shadow-2xl p-2 z-30"
                    >
                      <p className="text-xs uppercase tracking-wide text-muted-foreground px-2 pb-2">Teilen</p>
                      <div className="flex flex-col gap-1">
                        {shareItems.map(({ key, label, icon: Icon, action, href, external }) => {
                          const content = (
                            <div className="flex items-center gap-3">
                              <Icon className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium text-foreground">{label}</span>
                            </div>
                          );
                          return action ? (
                            <button
                              key={key}
                              onClick={() => {
                                action();
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary transition-colors"
                            >
                              {content}
                            </button>
                          ) : (
                            <a
                              key={key}
                              href={href}
                              target={external ? '_blank' : undefined}
                              rel={external ? 'noopener noreferrer' : undefined}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary transition-colors"
                            >
                              {content}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {isModal && (
                  <div className="relative hidden md:block">
                    <button
                      ref={optionsButtonRef}
                      onClick={() => {
                        setOptionsMenuOpen((prev) => !prev);
                        setShareMenuOpen(false);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        optionsMenuOpen ? 'bg-secondary text-primary' : 'text-text-secondary hover:bg-secondary'
                      }`}
                      aria-haspopup="menu"
                      aria-expanded={optionsMenuOpen}
                      aria-label="Optionen"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {optionsMenuOpen && (
                      <div
                        ref={optionsMenuRef}
                        className="absolute right-0 mt-3 w-60 bg-card border border-border rounded-2xl shadow-2xl p-2 z-30"
                      >
                        <p className="text-xs uppercase tracking-wide text-muted-foreground px-2 pb-2">Optionen</p>
                        <div className="flex flex-col gap-1">
                          {optionItems.map(({ key, label, icon: Icon, action, href, external }) => {
                            const content = (
                              <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium text-foreground">{label}</span>
                              </div>
                            );
                            return action ? (
                              <button
                                key={key}
                                onClick={() => {
                                  action();
                                }}
                                className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary transition-colors"
                              >
                                {content}
                              </button>
                            ) : (
                              <a
                                key={key}
                                href={href}
                                target={external ? '_blank' : undefined}
                                rel={external ? 'noopener noreferrer' : undefined}
                                className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary transition-colors"
                              >
                                {content}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Title & Price */}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              {product.title}
            </h1>

            <div className="mb-6" />

            {/* Description */}
            <div className="prose prose-stone dark:prose-invert max-w-none mb-8">
              <p className="text-lg leading-relaxed text-text-secondary">{product.description}</p>
            </div>

            {categoryLabels.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {categoryLabels.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-secondary text-text-secondary rounded-full border border-border/60 text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            {tagLabels.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {tagLabels.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-secondary text-text-secondary rounded-full border border-border/60 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-border my-8" />

            {/* Price & Affiliate */}
            <div className="bg-secondary/50 p-6 rounded-2xl border border-border/50 text-center space-y-4">
              <p className="text-sm text-text-secondary">
                Klick dich direkt zum Anbieter und entdecke alle Details rund um dieses Produkt.
              </p>
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-lg transition-all hover:scale-105 shadow-md shadow-primary/20"
              >
                Zum Produkt
                <ExternalLink className="w-5 h-5" />
              </a>
              <p className="text-xs text-text-secondary">* Enthält Affiliate-Links</p>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="sticky bottom-0 bg-card/80 backdrop-blur pt-4 pb-2 mt-8 flex gap-4 border-t border-border/50">
            <button
              onClick={async () => {
                const result = await togglePurr();
                if (result === 'auth_required') {
                  navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
                }
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 transition-all group ${
                isPurred
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/50 text-text'
              }`}
            >
              <Heart
                className={`w-6 h-6 transition-transform group-hover:scale-110 ${isPurred ? 'fill-primary stroke-primary' : 'stroke-current'}`}
              />
              <span className="font-bold text-lg">{formatPurrCount(purrCount)}</span>
            </button>

            <button
              onClick={async () => {
                const result = await toggleSave(product.id);
                if (result === 'auth_required') {
                  navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
                }
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 transition-all group ${
                saved ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-foreground/50 text-text'
              }`}
            >
              <Bookmark
                className={`w-6 h-6 transition-transform group-hover:scale-110 ${saved ? 'fill-primary stroke-primary' : 'stroke-current'}`}
              />
              <span className="font-bold text-lg">{saved ? 'Gespeichert' : 'Speichern'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {(relatedLoading || relatedProducts.length > 0) && (
        <div className="mt-10">
          <div className="w-2/3 max-w-lg h-px mx-auto bg-border/70" />
          <h2 className="font-display text-2xl md:text-3xl font-bold my-8 text-center">
            Mehr wie dieses 🐱
          </h2>
          {relatedLoading ? (
            <div className="flex justify-center py-10 text-muted-foreground">
              Lädt ähnliche Produkte...
            </div>
          ) : (
            <div className="px-2 sm:px-4">
              <ProductCarousel products={relatedProducts} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
