import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';
import AdminDashboard from '../components/admin/AdminDashboard';
import logoImg from '../assets/logo.png';
import { Lock, Mail, ArrowLeft, Loader2, AlertCircle, UserPlus, LogIn } from 'lucide-react';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(() => isFirebaseConfigured && Boolean(auth));

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Demo user for preview when Firebase is not configured yet
  const [isDemoUser, setIsDemoUser] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!email || !password) {
      setAuthError('Por favor, introduce tu correo y contraseña');
      return;
    }

    if (!isFirebaseConfigured || !auth) {
      // Si aún no está configurado Firebase en .env, permitir acceso demo
      if (email && password.length >= 6) {
        setIsDemoUser(true);
        setUser({ email, uid: 'demo-admin' });
        return;
      } else {
        setAuthError('Introduce un correo y contraseña de al menos 6 caracteres');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (isRegisterMode) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error('Error de autenticación:', err.code, err.message);
      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setAuthError('Correo o contraseña incorrectos.');
          break;
        case 'auth/email-already-in-use':
          setAuthError('Este correo ya está registrado. Selecciona "Iniciar sesión".');
          break;
        case 'auth/weak-password':
          setAuthError('La contraseña debe tener al menos 6 caracteres.');
          break;
        case 'auth/invalid-email':
          setAuthError('El formato de correo no es válido.');
          break;
        case 'auth/too-many-requests':
          setAuthError('Demasiados intentos fallidos. Inténtalo más tarde.');
          break;
        default:
          setAuthError(err.message || 'Error al autenticar.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    if (isDemoUser) {
      setIsDemoUser(false);
      setUser(null);
      return;
    }

    if (auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error('Error al cerrar sesión:', err);
      }
    }
    setUser(null);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-sans text-zinc-400">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si el usuario está autenticado, mostrar el Panel de Administración
  if (user) {
    return <AdminDashboard user={user} onSignOut={handleSignOut} />;
  }

  // Pantalla de Login / Registro de Administrador
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col justify-center items-center p-4 selection:bg-zinc-800 selection:text-white">
      {/* Resplandor ambiental de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center">
        <img
          src={logoImg}
          alt=""
          aria-hidden="true"
          className="w-[600px] h-[600px] object-contain blur-3xl opacity-10 mix-blend-screen pointer-events-none select-none"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Link de retorno */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-sans font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la Carta Digital</span>
          </Link>
        </div>

        {/* Tarjeta de Login */}
        <div className="rounded-2xl bg-[#121212] border border-zinc-800/90 p-7 sm:p-8 shadow-2xl backdrop-blur-sm">
          {/* Logo y Encabezado */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <img
                src={logoImg}
                alt="Dalí Bar"
                className="w-full h-full object-contain mix-blend-screen select-none"
              />
            </div>
            <h1 className="font-neon text-2xl sm:text-3xl text-white">
              Dalí Bar
            </h1>
            <p className="font-sans text-xs tracking-widest text-zinc-400 uppercase font-medium mt-1">
              Acceso Administración
            </p>
          </div>

          {/* Aviso si falta configurar Firebase */}
          {!isFirebaseConfigured && (
            <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-sans flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Firebase pendiente de configurar</p>
                <p className="text-[11px] text-amber-300/80 mt-0.5">
                  Puedes ingresar con cualquier correo y clave (mínimo 6 caracteres) para explorar el panel en modo demo.
                </p>
              </div>
            </div>
          )}

          {/* Mensaje de error */}
          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-sans flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block font-sans text-xs font-medium text-zinc-300">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dalibar.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0a0a0a] border border-zinc-800 text-zinc-100 placeholder-zinc-500 font-sans text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-sans text-xs font-medium text-zinc-300">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0a0a0a] border border-zinc-800 text-zinc-100 placeholder-zinc-500 font-sans text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-zinc-100 text-zinc-900 hover:bg-white text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all shadow-[0_4px_16px_rgba(255,255,255,0.08)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : isRegisterMode ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Crear Administrador</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Entrar al Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle entre Iniciar Sesión y Registrar Primer Admin */}
          {isFirebaseConfigured && (
            <div className="mt-5 pt-5 border-t border-zinc-800/80 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setAuthError('');
                }}
                className="font-sans text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {isRegisterMode
                  ? '¿Ya tienes una cuenta de admin? Inicia sesión aquí'
                  : '¿Primera vez? Crear cuenta de administrador'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
