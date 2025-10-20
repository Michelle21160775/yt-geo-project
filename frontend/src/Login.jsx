import { useState } from "react";
import axios from "axios";

// --- Funciones de Iconos ---

// Icono para Google
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.132,44,29.89,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
  </svg>
);

// Icono para mostrar la contraseña (Eye)
const EyeIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

// Icono para ocultar la contraseña (Eye-Off)
const EyeOffIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a18.06 18.06 0 0 1 5-5.17M12 5c5 0 9 5 9 5a17.94 17.94 0 0 1-1.35 1.63"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

// Iconos Decorativos (se mantienen igual)
const WifiIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
    <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
    <circle cx="12" cy="20" r="1"></circle>
  </svg>
);
const PhoneIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);
const SmileIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
    <line x1="9" y1="9" x2="9.01" y2="9"></line>
    <line x1="15" y1="9" x2="15.01" y2="9"></line>
  </svg>
);
const SettingsIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6M5.636 5.636l4.243 4.243m4.242 4.242l4.243 4.243M1 12h6m6 0h6M5.636 18.364l4.243-4.243m4.242-4.242l4.243-4.243"></path>
  </svg>
);
const ClockIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const MoonIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);
const BluetoothIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m7 7 10 10-5 5V2l5 5L7 17"></path>
  </svg>
);
const SkipIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="5 4 15 12 5 20 5 4"></polygon>
    <line x1="19" y1="5" x2="19" y2="19"></line>
  </svg>
);
const PauseIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);
const MessageIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);
const TabletIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12.01" y2="18"></line>
  </svg>
);
const MountainIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
  </svg>
);

// --- Lógica de Validación de Contraseña ---
/**
 * Valida la contraseña según las reglas de seguridad.
 * Retorna un mensaje de error (string) si falla, o null si es válida.
 */
const validatePassword = (password) => {
  // 1. Longitud mínima de 8 caracteres
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }

  // 2. Al menos una mayúscula
  if (!/[A-Z]/.test(password)) {
    return "La contraseña debe contener al menos una letra mayúscula.";
  }

  // 3. Al menos un número
  if (!/[0-9]/.test(password)) {
    return "La contraseña debe contener al menos un número.";
  }

  // 4. Al menos un símbolo especial (-+}?_)
  const specialCharRegex = /[-+}?_]/.test(password);
  if (!specialCharRegex) {
    return "La contraseña debe contener al menos un símbolo especial: - + } ? _";
  }

  // 5. No contenga números consecutivos (tres o más, ascendentes o descendentes)
  const checkConsecutive = (s) => {
    for (let i = 0; i < s.length - 2; i++) {
      const char1 = parseInt(s[i]);
      const char2 = parseInt(s[i + 1]);
      const char3 = parseInt(s[i + 2]);

      // Solo comprueba si son números
      if (!isNaN(char1) && !isNaN(char2) && !isNaN(char3)) {
        // Secuencia Ascendente: 1, 2, 3
        if (char2 === char1 + 1 && char3 === char2 + 1) {
          return true;
        }
        // Secuencia Descendente: 3, 2, 1
        if (char2 === char1 - 1 && char3 === char2 - 1) {
          return true;
        }
      }
    }
    return false;
  };

  if (checkConsecutive(password)) {
    return "La contraseña no debe contener números consecutivos (ej. 123 o 321).";
  }

  // Opcional: Prohibir repeticiones de tres caracteres idénticos (ej. aaa, 111)
  if (/(.)\1\1/.test(password)) {
    return "La contraseña no debe contener tres caracteres idénticos consecutivos.";
  }

  return null; // Contraseña válida
};

// --- Componente Principal ---

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    // VALIDACIÓN de contraseña (solo se ejecuta al registrarse)
    if (isRegister) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        return;
      }
    }

    setIsLoading(true);
    try {
      // NOTA: Esta URL debe apuntar a tu backend de Node.js
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const response = await axios.post(`http://localhost:3001${endpoint}`, {
        email,
        password,
      });

      // NOTA: En un entorno de Canvas, deberías usar Firestore o Context/Zustand
      // para la persistencia de estado en lugar de localStorage, pero mantenemos
      // el localStorage por simplicidad en este ejemplo de código.
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (onLoginSuccess) {
        onLoginSuccess(response.data.user);
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Error al autenticar. Verifica tus credenciales o intenta registrarte."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3001/api/auth/google";
  };

  const handleGuestLogin = () => {
    // Crear un usuario invitado temporal
    const guestUser = {
      id: "guest",
      email: "guest@visitor.com",
      isGuest: true,
      displayName: "Invitado",
    };

    // Guardar en localStorage
    localStorage.setItem("token", "guest-token");
    localStorage.setItem("user", JSON.stringify(guestUser));

    if (onLoginSuccess) {
      onLoginSuccess(guestUser);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0a0a0a] relative overflow-hidden">
      {/* Left Section - Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative">
        {/* Decorative icons for left section */}
        <BluetoothIcon className="absolute top-[8%] left-[8%] w-14 h-14 lg:w-16 lg:h-16 stroke-pink-300/40 stroke-[1.5]" />
        <BluetoothIcon className="absolute bottom-[15%] left-[12%] w-12 h-12 lg:w-14 lg:h-14 stroke-pink-300/40 stroke-[1.5]" />
        <PhoneIcon className="absolute bottom-[35%] left-[10%] w-16 h-16 lg:w-20 lg:h-20 stroke-pink-300/40 stroke-[1.5]" />
        <MoonIcon className="absolute top-[18%] left-[25%] w-18 h-18 lg:w-20 lg:h-20 stroke-pink-300/40 stroke-[1.5]" />
        <MoonIcon className="absolute bottom-[10%] left-[30%] w-14 h-14 lg:w-16 lg:h-16 stroke-pink-300/40 stroke-[1.5]" />
        <WifiIcon className="absolute bottom-[25%] left-[18%] w-18 h-18 lg:w-22 lg:h-22 stroke-blue-300/40 stroke-[1.5]" />
        <SmileIcon className="absolute top-[35%] left-[12%] w-22 h-22 lg:w-24 lg:h-24 stroke-blue-300/40 stroke-[1.5]" />
        <PauseIcon className="absolute bottom-[8%] left-[22%] w-14 h-14 lg:w-16 lg:h-16 stroke-blue-300/40 stroke-[1.5]" />

        {/* Branding content */}
        <div className="text-center px-12">
          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Video Finder
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Descubre contenido geo-localizado cerca de ti
            </p>
            <div className="flex items-center justify-center gap-4 text-purple-300/70">
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M23 7l-7 5 7 5V7z"></path>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
              <span className="text-sm">
                Videos • Geo-localización • Oaxaca
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative">
        {/* Mobile background icons */}
        <div className="lg:hidden absolute inset-0">
          <BluetoothIcon className="absolute top-[8%] left-[5%] w-12 h-12 stroke-pink-300/40 stroke-[1.5]" />
          <MoonIcon className="absolute top-[15%] right-[8%] w-14 h-14 stroke-pink-300/40 stroke-[1.5]" />
          <WifiIcon className="absolute bottom-[20%] left-[8%] w-14 h-14 stroke-blue-300/40 stroke-[1.5]" />
          <SmileIcon className="absolute top-[30%] left-[6%] w-16 h-16 stroke-blue-300/40 stroke-[1.5]" />
          <SettingsIcon className="absolute top-[12%] right-[12%] w-14 h-14 stroke-pink-300/40 stroke-[1.5]" />
          <ClockIcon className="absolute top-[25%] right-[6%] w-16 h-16 stroke-pink-300/40 stroke-[1.5]" />
          <SmileIcon className="absolute bottom-[35%] right-[8%] w-18 h-18 stroke-pink-300/40 stroke-[1.5]" />
          <SkipIcon className="absolute bottom-[12%] right-[5%] w-12 h-12 stroke-pink-300/40 stroke-[1.5]" />
        </div>

        {/* Desktop background icons */}
        <div className="hidden lg:block absolute inset-0">
          <SettingsIcon className="absolute top-[12%] right-[12%] w-18 h-18 lg:w-20 lg:h-20 stroke-pink-300/40 stroke-[1.5]" />
          <ClockIcon className="absolute top-[20%] right-[25%] w-20 h-20 lg:w-24 lg:h-24 stroke-pink-300/40 stroke-[1.5]" />
          <SmileIcon className="absolute top-[40%] right-[10%] w-22 h-22 lg:w-26 lg:h-26 stroke-pink-300/40 stroke-[1.5]" />
          <SkipIcon className="absolute bottom-[12%] right-[8%] w-16 h-16 lg:w-18 lg:h-18 stroke-pink-300/40 stroke-[1.5]" />
          <MountainIcon className="absolute bottom-[28%] right-[18%] w-22 h-22 lg:w-24 lg:h-24 stroke-blue-300/40 stroke-[1.5]" />
          <TabletIcon className="absolute bottom-[38%] right-[22%] w-16 h-16 lg:w-18 lg:h-18 stroke-blue-300/40 stroke-[1.5]" />
          <MessageIcon className="absolute bottom-[8%] right-[28%] w-18 h-18 lg:w-20 lg:h-20 stroke-blue-300/40 stroke-[1.5]" />
        </div>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md lg:max-w-lg xl:max-w-xl mx-4 lg:mx-8 xl:mx-16">
          {/* User Avatar Circle */}
          <div className="flex justify-center mb-6 lg:mb-8">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-[#2a2a3a] border-4 border-blue-300/30 flex items-center justify-center">
              <svg
                className="w-10 h-10 lg:w-12 lg:h-12 stroke-blue-300/60"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-[#1a1a24] rounded-2xl p-6 lg:p-8 space-y-5 lg:space-y-6">
            {/* Tab Buttons */}
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  !isRegister
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  isRegister
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                Registrarse
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#b8b8d1]/80 text-[#2a2a3a] placeholder-[#4a4a5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition font-medium"
                />
              </div>

              {/* Contraseña con botón de ojo */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Contraseña
                </label>
                {/* Contenedor relativo para posicionar el icono */}
                <div className="relative">
                  <input
                    // Alterna entre texto y password para mostrar/ocultar
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    // Añadimos padding a la derecha para el botón de ojo
                    className="w-full px-4 py-3.5 bg-[#b8b8d1]/80 text-[#2a2a3a] placeholder-[#4a4a5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition font-medium pr-12"
                  />
                  {/* Botón de ojo posicionado absolutamente */}
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#4a4a5a] hover:text-[#2a2a3a] transition"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {/* Cambia el icono basado en el estado */}
                    {showPassword ? (
                      <EyeOffIcon className="w-6 h-6" />
                    ) : (
                      <EyeIcon className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-300 text-sm text-center font-medium">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isRegister ? "Registrando..." : "Iniciando..."}
                  </span>
                ) : isRegister ? (
                  "Crear Cuenta"
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1a1a24] text-gray-500">O</span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-full transition-all duration-200 shadow-lg"
            >
              <GoogleIcon />
              <span>Continuar con Google</span>
            </button>

            {/* Guest Login Button */}
            <button
              onClick={handleGuestLogin}
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-lg transition-all duration-200 border border-gray-600"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Continuar como Invitado</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
