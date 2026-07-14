import { useState, useRef, useEffect } from 'react';
import { PenLine, Check, Lock, X, LogOut } from 'lucide-react';
import StatusBar from './components/StatusBar';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import AboutPage from './pages/AboutPage';
import MusicPage from './pages/MusicPage';
import { ContentProvider, useContent } from './contexts/ContentContext';

type Page = 'home' | 'menu' | 'about' | 'music';

function LoginModal({ onClose }: { onClose: () => void }) {
  const { signIn } = useContent();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const err = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError('Invalid email or password.');
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-xs mx-4 rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: '#1a2a18', border: '1px solid rgba(205,217,164,0.15)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-lcd-text-mid hover:text-lcd-text transition-colors"
        >
          <X size={14} />
        </button>

        <div className="flex flex-col items-center gap-1">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center mb-1"
            style={{ background: 'rgba(205,217,164,0.08)', border: '1px solid rgba(205,217,164,0.15)' }}
          >
            <Lock size={15} style={{ color: '#cdd9a4' }} />
          </div>
          <span className="font-mono text-sm tracking-widest" style={{ color: '#cdd9a4' }}>ADMIN LOGIN</span>
          <span className="font-mono text-xs" style={{ color: '#7a9060' }}>Sign in to edit site content</span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            ref={emailRef}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg font-mono text-xs outline-none"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(205,217,164,0.2)',
              color: '#cdd9a4',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg font-mono text-xs outline-none"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(205,217,164,0.2)',
              color: '#cdd9a4',
            }}
          />
          {error && (
            <span className="font-mono text-xs text-center" style={{ color: '#e06060' }}>{error}</span>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg font-mono text-xs tracking-widest transition-opacity"
            style={{ background: '#3a9888', color: '#cdd9a4', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminControls() {
  const { isAdmin, isEditMode, setEditMode, signOut } = useContent();
  const [showLogin, setShowLogin] = useState(false);

  if (!isAdmin) {
    return (
      <>
        <button
          onClick={() => setShowLogin(true)}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-1.5 font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-all"
          style={{
            background: 'rgba(30,50,28,0.85)',
            color: 'rgba(205,217,164,0.45)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(205,217,164,0.08)',
          }}
          title="Admin login"
        >
          <Lock size={11} strokeWidth={2} />
        </button>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
      <button
        onClick={() => { signOut(); setEditMode(false); }}
        className="flex items-center gap-1.5 font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-all"
        style={{
          background: 'rgba(30,50,28,0.85)',
          color: 'rgba(205,217,164,0.45)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(205,217,164,0.08)',
        }}
        title="Sign out"
      >
        <LogOut size={11} strokeWidth={2} />
      </button>
      <button
        onClick={() => setEditMode(!isEditMode)}
        className="flex items-center gap-1.5 font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-all"
        style={{
          background: isEditMode ? '#1c2810' : 'rgba(58,152,136,0.9)',
          color: '#cdd9a4',
          boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(205,217,164,0.2)',
        }}
      >
        {isEditMode ? (
          <><Check size={11} strokeWidth={2.5} />DONE</>
        ) : (
          <><PenLine size={11} strokeWidth={2} />EDIT</>
        )}
      </button>
    </div>
  );
}

function AppContent() {
  const [page, setPage] = useState<Page>('home');
  const { isEditMode } = useContent();
  const navigate = (p: Page) => setPage(p);

  return (
    <div className="h-dvh flex items-center justify-center px-4 overflow-hidden" style={{ background: 'linear-gradient(160deg, #1a3a30 0%, #0d2018 50%, #1a3028 100%)' }}>
      <div
        className="absolute w-80 h-[700px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: '#5ab8a8' }}
      />

      {/* Bezel — fills available height with safe padding, capped at max-w-sm */}
      <div
        className="relative w-full max-w-sm shell-plastic p-3 flex flex-col"
        style={{
          borderRadius: '12px 12px 24px 24px',
          paddingBottom: '12px',
          height: 'calc(100dvh - 32px)',
          maxHeight: '760px',
        }}
      >
        {/* Top brand strip */}
        <div className="flex items-center justify-between px-4 py-2 mb-2 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(0,0,0,0.3)' }} />
            <div className="shell-side-texture h-3 w-8 rounded" />
          </div>
          <div className="flex items-baseline gap-0.5 opacity-80 select-none" style={{ color: '#4a4035' }}>
            <span style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic', fontWeight: 700, fontSize: '14px', letterSpacing: '0.02em' }}>Fog</span>
            <span style={{ fontFamily: '"Arial Narrow", Arial, sans-serif', fontWeight: 900, fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Pilot</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="shell-side-texture h-3 w-8 rounded" />
            <div className="w-2 h-2 rounded-full opacity-50" style={{ background: '#8a8070' }} />
          </div>
        </div>

        {/* Screen — grows to fill remaining bezel height */}
        <div className="screen-bezel rounded-2xl p-2 mb-3 flex-1 min-h-0 flex flex-col">
          <div className="lcd-screen rounded-xl overflow-hidden relative flex-1 min-h-0 flex flex-col">
            <div className="lcd-scanlines absolute inset-0 z-10 pointer-events-none rounded-xl" />

            {isEditMode && (
              <div
                className="absolute top-0 right-0 z-30 font-mono px-2 py-0.5 rounded-bl-lg pointer-events-none"
                style={{ background: '#1c2810', color: '#cdd9a4', fontSize: '8px', letterSpacing: '0.1em' }}
              >
                EDIT MODE
              </div>
            )}

            <div className="relative z-0 flex flex-col flex-1 min-h-0">
              <StatusBar />
              <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
                {page === 'home' && <HomePage onNavigate={(p) => navigate(p)} />}
                {page === 'menu' && <MenuPage />}
                {page === 'music' && <MusicPage />}
                {page === 'about' && <AboutPage />}
              </div>
            </div>

            <div
              className="absolute top-0 left-0 right-0 h-16 rounded-t-xl pointer-events-none z-20"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)' }}
            />
          </div>
        </div>

        {/* Button area — sits in the rounded bottom dome */}
        <div className="flex-shrink-0">
          <NavBar current={page} onNavigate={navigate} />
        </div>
      </div>

      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs opacity-30 tracking-widest pointer-events-none hidden md:block"
        style={{ color: '#7dd4c4' }}
      >
        LARK FINE FOODS &copy; 1997
      </div>

      <AdminControls />
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <AppContent />
    </ContentProvider>
  );
}
