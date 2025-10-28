import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile, updateUserPassword } from '../services/profileAPI';
import '../styles/profile.css';

const ProfilePage = ({ user, onUpdateProfile, onClose }) => {
    const { updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        location: user?.location || '',
        profileImage: user?.profileImage || null
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    // Fetch latest profile when modal mounts
    React.useEffect(() => {
        let mounted = true;
        const loadProfile = async () => {
            setLoading(true);
            setErrors({});
            try {
                const data = await getUserProfile();
                if (!mounted) return;
                setProfileData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    bio: data.bio || '',
                    location: data.location || '',
                    profileImage: data.profileImage || null
                });

                // Sync with auth context so rest of app has latest user
                updateProfile && updateProfile(data);
            } catch (err) {
                console.error('Error loading profile:', err);
                setErrors(prev => ({ ...prev, general: err?.error || 'Error al cargar el perfil' }));
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadProfile();
        return () => { mounted = false; };
    }, []);

    // Iconos SVG
    const UserIcon = () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    );

    const LockIcon = () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <circle cx="12" cy="16" r="1"></circle>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
    );

    const CameraIcon = () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
        </svg>
    );

    const CloseIcon = () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    );

    const SaveIcon = () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
    );

    const handleProfileInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error específico si existe
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error específico si existe
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    profileImage: 'Solo se permiten archivos de imagen (JPEG, PNG, GIF)'
                }));
                return;
            }

            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    profileImage: 'El archivo debe ser menor a 5MB'
                }));
                return;
            }

            // Crear preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileData(prev => ({
                    ...prev,
                    profileImage: e.target.result
                }));
                setErrors(prev => ({
                    ...prev,
                    profileImage: ''
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateProfileForm = () => {
        const newErrors = {};

        if (!profileData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!profileData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
            newErrors.email = 'El email no es válido';
        }

        if (profileData.phone && !/^\d{10}$/.test(profileData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'El teléfono debe tener 10 dígitos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePasswordForm = () => {
        const newErrors = {};

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = 'La contraseña actual es requerida';
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = 'La nueva contraseña es requerida';
        } else if (passwordData.newPassword.length < 8) {
            newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Confirma la nueva contraseña';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateProfileForm()) return;

        setLoading(true);
        setErrors({});
        try {
            // Llamada real a la API
            const updatedUser = await updateUserProfile({
                name: profileData.name,
                email: profileData.email,
                phone: profileData.phone,
                bio: profileData.bio,
                location: profileData.location,
                profileImage: profileData.profileImage
            });
            
            // Actualizar contexto de autenticación
            updateProfile(updatedUser);
            
            // Notificar al componente padre si existe el callback
            if (onUpdateProfile) {
                onUpdateProfile(updatedUser);
            }
            
            setSuccess('Perfil actualizado correctamente');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            setErrors({ 
                general: error.error || 'Error al actualizar el perfil. Intenta de nuevo.' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (!validatePasswordForm()) return;

        setLoading(true);
        setErrors({});
        try {
            // Llamada real a la API
            await updateUserPassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            
            setSuccess('Contraseña actualizada correctamente');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error al actualizar contraseña:', error);
            setErrors({ 
                password: error.error || 'Error al actualizar la contraseña. Verifica que la contraseña actual sea correcta.' 
            });
        } finally {
            setLoading(false);
        }
    };

    const getUserInitials = (email) => {
        if (!email) return 'U';
        return email.charAt(0).toUpperCase();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 profile-modal">
            <div className="bg-[#1a1a24] rounded-xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden profile-content">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                        Mi Perfil
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-2 px-6 py-4 transition-colors profile-tab ${
                            activeTab === 'profile'
                                ? 'text-purple-300 border-b-2 border-purple-400 active'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <UserIcon />
                        Información Personal
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`flex items-center gap-2 px-6 py-4 transition-colors profile-tab ${
                            activeTab === 'password'
                                ? 'text-purple-300 border-b-2 border-purple-400 active'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <LockIcon />
                        Cambiar Contraseña
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] profile-scroll">
                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300">
                            {success}
                        </div>
                    )}

                    {/* General Error */}
                    {errors.general && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
                            {errors.general}
                        </div>
                    )}

                    {errors.password && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
                            {errors.password}
                        </div>
                    )}

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            {/* Profile Image */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative profile-image-container">
                                    <div className="w-24 h-24 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center">
                                        {profileData.profileImage ? (
                                            <img
                                                src={profileData.profileImage}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl font-bold text-white">
                                                {getUserInitials(profileData.email)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="profile-image-overlay">
                                        <CameraIcon />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-2 -right-2 p-2 bg-purple-600 hover:bg-purple-700 rounded-full transition-all duration-200 hover:scale-110"
                                    >
                                        <CameraIcon />
                                    </button>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                {errors.profileImage && (
                                    <p className="text-red-400 text-sm">{errors.profileImage}</p>
                                )}
                                <p className="text-gray-400 text-sm text-center">
                                    Haz clic en el botón para cambiar tu foto de perfil
                                </p>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 profile-form-grid">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Nombre completo *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleProfileInputChange}
                                        className={`w-full px-4 py-3 text-white border rounded-lg focus:outline-none focus:ring-2 transition-colors profile-input ${
                                            errors.name
                                                ? 'border-red-500 focus:ring-red-400'
                                                : 'border-white/10 focus:ring-purple-400'
                                        }`}
                                        placeholder="Tu nombre completo"
                                    />
                                    {errors.name && (
                                        <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleProfileInputChange}
                                        className={`w-full px-4 py-3 text-white border rounded-lg focus:outline-none focus:ring-2 transition-colors profile-input ${
                                            errors.email
                                                ? 'border-red-500 focus:ring-red-400'
                                                : 'border-white/10 focus:ring-purple-400'
                                        }`}
                                        placeholder="tu@email.com"
                                    />
                                    {errors.email && (
                                        <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleProfileInputChange}
                                        className={`w-full px-4 py-3 text-white border rounded-lg focus:outline-none focus:ring-2 transition-colors profile-input ${
                                            errors.phone
                                                ? 'border-red-500 focus:ring-red-400'
                                                : 'border-white/10 focus:ring-purple-400'
                                        }`}
                                        placeholder="(951) 123-4567"
                                    />
                                    {errors.phone && (
                                        <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Ubicación
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={profileData.location}
                                        onChange={handleProfileInputChange}
                                        className="w-full px-4 py-3 text-white border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors profile-input"
                                        placeholder="Oaxaca, México"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Biografía
                                </label>
                                <textarea
                                    name="bio"
                                    value={profileData.bio}
                                    onChange={handleProfileInputChange}
                                    rows={4}
                                    className="w-full px-4 py-3 text-white border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors resize-none profile-input"
                                    placeholder="Cuéntanos un poco sobre ti..."
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 rounded-lg transition-all font-medium profile-button"
                                >
                                    {loading ? (
                                        <div className="profile-spinner" />
                                    ) : (
                                        <SaveIcon />
                                    )}
                                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Contraseña actual *
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordInputChange}
                                        className={`w-full px-4 py-3 text-white border rounded-lg focus:outline-none focus:ring-2 transition-colors profile-input ${
                                            errors.currentPassword
                                                ? 'border-red-500 focus:ring-red-400'
                                                : 'border-white/10 focus:ring-purple-400'
                                        }`}
                                        placeholder="Tu contraseña actual"
                                    />
                                    {errors.currentPassword && (
                                        <p className="text-red-400 text-sm mt-1">{errors.currentPassword}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Nueva contraseña *
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordInputChange}
                                        className={`w-full px-4 py-3 text-white border rounded-lg focus:outline-none focus:ring-2 transition-colors profile-input ${
                                            errors.newPassword
                                                ? 'border-red-500 focus:ring-red-400'
                                                : 'border-white/10 focus:ring-purple-400'
                                        }`}
                                        placeholder="Tu nueva contraseña"
                                    />
                                    {errors.newPassword && (
                                        <p className="text-red-400 text-sm mt-1">{errors.newPassword}</p>
                                    )}
                                    <p className="text-gray-400 text-sm mt-1">
                                        La contraseña debe tener al menos 8 caracteres
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Confirmar nueva contraseña *
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordInputChange}
                                        className={`w-full px-4 py-3 text-white border rounded-lg focus:outline-none focus:ring-2 transition-colors profile-input ${
                                            errors.confirmPassword
                                                ? 'border-red-500 focus:ring-red-400'
                                                : 'border-white/10 focus:ring-purple-400'
                                        }`}
                                        placeholder="Confirma tu nueva contraseña"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 rounded-lg transition-all font-medium profile-button"
                                >
                                    {loading ? (
                                        <div className="profile-spinner" />
                                    ) : (
                                        <LockIcon />
                                    )}
                                    {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;