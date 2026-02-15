import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Mail, Lock, LogIn, UserPlus, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const redirectParam = params.get('redirect');
  const fallbackRedirect = (location.state as { from?: string } | null)?.from;
  const redirectTo = redirectParam || fallbackRedirect || '/';

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, loading, navigate, redirectTo]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    if (mode === 'login') {
      const result = await signInWithEmail(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Willkommen zurück! Du wirst weitergeleitet.');
        navigate(redirectTo, { replace: true });
      }
    } else {
      const result = await signUpWithEmail(email, password);
      if (result.error) {
        setError(result.error);
      } else if (result.confirmationSent) {
        setSuccess('Bitte bestätige deine E-Mail. Danach kannst du dich einloggen.');
      } else {
        setSuccess('Account erstellt. Du wirst weitergeleitet.');
        navigate(redirectTo, { replace: true });
      }
    }

    setIsSubmitting(false);
  };

  const handleGoogle = async () => {
    setError(null);
    await signInWithGoogle(redirectTo);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-card border border-border rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">
        <div className="bg-gradient-to-br from-primary to-rose-500 text-white p-8 flex flex-col gap-6">
          <Sparkles className="w-10 h-10" />
          <div>
            <p className="uppercase tracking-[0.4em] text-sm">Purriosity</p>
            <h1 className="text-3xl font-display font-bold mt-4">Willkommen im Katzenclub</h1>
            <p className="text-white/80 mt-3">
              Speichere Favoriten, vergib Purrs und entdecke exklusive Drops. Melde dich mit einem Klick an.
            </p>
          </div>
          <div className="mt-auto text-sm text-white/70">
            <p>Bonus: Mit deinem Account siehst du bald noch mehr personalisierte Cat-Power.</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" /> Zurück
          </button>

          <div>
            <h2 className="text-2xl font-display font-bold">{mode === 'login' ? 'Einloggen' : 'Account erstellen'}</h2>
            <p className="text-text-secondary text-sm mt-1">Mit Google oder deiner E-Mail fortfahren.</p>
          </div>

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-2 border border-border rounded-xl py-3 font-semibold hover:bg-muted transition-colors"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Mit Google anmelden
          </button>

          <div className="flex items-center gap-3 text-text-secondary text-xs uppercase tracking-[0.3em]">
            <span className="flex-1 h-px bg-border" />
            oder
            <span className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <label className="block text-sm font-semibold text-text-secondary">E-Mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none"
                placeholder="catlover@example.com"
              />
            </div>

            <label className="block text-sm font-semibold text-text-secondary">Passwort</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-xl p-3">{error}</p>}
            {success && <p className="text-sm text-green-600 bg-green-500/10 border border-green-500/30 rounded-xl p-3">{success}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-colors bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === 'login' ? (
                <LogIn className="w-4 h-4" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {mode === 'login' ? 'Einloggen' : 'Registrieren'}
            </button>
          </form>

          <p className="text-sm text-text-secondary text-center">
            {mode === 'login' ? 'Noch keinen Account?' : 'Schon ein Konto?'}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError(null);
                setSuccess(null);
              }}
              className="text-primary font-semibold ml-2"
            >
              {mode === 'login' ? 'Jetzt registrieren' : 'Zum Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
