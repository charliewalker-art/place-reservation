import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { User, ArrowRight, Truck, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await authService.login({ username, password });
            authService.saveToken(response.token);
            navigate('/');
        } catch (err) {
            setError('Identifiants incorrects');
        }
    };

    return (
        <div 
            className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4"
            style={{ 
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
                backgroundSize: '24px 24px' 
            }}
        >
            {/* En-tête / Logo */}
            <div className="flex flex-col items-center mb-10">
                <div className="bg-blue-600 text-white p-4 rounded-xl mb-4 shadow-lg shadow-blue-200/50">
                    <Truck size={32} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Places Coopérative
                </h1>
                <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mt-2">
                    Gestion de réservation
                </p>
            </div>

            {/* Carte de connexion */}
            <div className="bg-white p-8 rounded-xl shadow-xl shadow-slate-200/50 w-full max-w-md">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Champ Nom d'utilisateur */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Nom d'utilisateur
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-200/60 border-none rounded-lg py-3 pl-4 pr-12 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                placeholder="Entrez votre nom d'utilisateur"
                            />
                            <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        </div>
                    </div>

                    {/* Champ Mot de passe avec option d'affichage */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-200/60 border-none rounded-lg py-3 pl-4 pr-12 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Bouton de soumission */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 mt-4 shadow-md shadow-blue-600/20"
                    >
                        Se connecter
                        <ArrowRight size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}