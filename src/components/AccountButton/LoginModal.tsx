import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';

interface Coupon {
  id: string;
  title: string;
  description: string;
  discount: string;
  venue: string;
  minTrust: number;
  minExp: number;
  icon: string;
  color: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogout }) => {
  const { user, login, signup } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);

  // Dummy coupons based on trust and EXP
  const availableCoupons: Coupon[] = [
    {
      id: '1',
      title: '20% Off Drinks',
      description: 'Valid at all bars and clubs',
      discount: '20% OFF',
      venue: 'Bars & Clubs',
      minTrust: 3.0,
      minExp: 1000,
      icon: '🍺',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: '2',
      title: 'Free Haircut',
      description: 'First haircut free at participating barbershops',
      discount: 'FREE',
      venue: 'Barbershops',
      minTrust: 4.0,
      minExp: 2000,
      icon: '✂️',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: '3',
      title: 'VIP Entry',
      description: 'Skip the line at select nightclubs',
      discount: 'VIP',
      venue: 'Nightclubs',
      minTrust: 4.5,
      minExp: 3000,
      icon: '⭐',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: '4',
      title: 'Massage Discount',
      description: '30% off spa and massage services',
      discount: '30% OFF',
      venue: 'Spa & Wellness',
      minTrust: 3.5,
      minExp: 1500,
      icon: '💆',
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: '5',
      title: 'Happy Hour Extended',
      description: 'Extended happy hour at partner venues',
      discount: 'EXTENDED',
      venue: 'Bars',
      minTrust: 3.0,
      minExp: 1000,
      icon: '🍹',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const getAvailableCoupons = (): Coupon[] => {
    if (!user) return [];
    return availableCoupons.filter(
      (coupon) => user.reputation >= coupon.minTrust && (user.karma || 0) >= coupon.minExp
    );
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        if (!name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        await signup(email, password, name);
      } else {
        await login(email, password);
      }
      onClose();
      setEmail('');
      setPassword('');
      setName('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Account</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-2xl mx-auto mb-2">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <p className="text-center font-semibold text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Trust</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">🤝 {user.reputation.toFixed(1)}/5</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">EXP</span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400"><span className="font-bold">EXP</span> {user.karma >= 1000 ? `${(user.karma / 1000).toFixed(1)}k` : user.karma}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Redeemable for coupons and rewards</p>
              </div>
            </div>

            <button
              onClick={() => setShowRedeem(true)}
              className="w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all font-medium shadow-lg"
            >
              🎁 Redeem Coupons
            </button>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Redeem Coupons View
  if (user && showRedeem) {
    const coupons = getAvailableCoupons();
    // TypeScript type guard - user is guaranteed to be non-null here
    const currentUser: User = user;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Redeem Coupons</h2>
            <button
              onClick={() => setShowRedeem(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Based on your <span className="font-semibold">Trust: {currentUser.reputation.toFixed(1)}/5</span> and{' '}
              <span className="font-semibold">EXP: {currentUser.karma >= 1000 ? `${(currentUser.karma / 1000).toFixed(1)}k` : currentUser.karma}</span>, 
              you have access to {coupons.length} coupon{coupons.length !== 1 ? 's' : ''}!
            </p>
          </div>

          {coupons.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-2">No coupons available yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Increase your Trust score and EXP to unlock more rewards!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`relative bg-gradient-to-br ${coupon.color} rounded-lg p-4 text-white shadow-lg transform transition-transform hover:scale-105`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-3xl">{coupon.icon}</div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-xs font-bold">{coupon.discount}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{coupon.title}</h3>
                  <p className="text-sm text-white/90 mb-2">{coupon.description}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20">
                    <span className="text-xs text-white/80">{coupon.venue}</span>
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded px-3 py-1 text-xs font-semibold transition-colors">
                      Redeem
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowRedeem(false)}
            className="mt-4 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isSignup ? 'Create Account' : 'Sign In'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
            className="w-full text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;

