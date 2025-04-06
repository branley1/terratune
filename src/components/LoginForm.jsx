import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const responseText = await response.text();
        console.error('Non-JSON response body:', responseText);
        throw new Error(`Server returned non-JSON response (status: ${response.status}). Check server logs and API endpoint.`);
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || `Login failed with status: ${response.status}`);
      }

      if (!data.user || !data.token) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response structure from server');
      }

      await login(data.user, data.token);

      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      if (err.message && err.message.includes('non-JSON response')) {
        setError('Unable to connect or invalid response from the server. Please check API status and path.');
      } else if (err.message && err.message.includes('Invalid authentication token')) {
        setError('Invalid or expired authentication token received from server.');
      } else {
        setError(err.message || 'Failed to login. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">
            Sign in to TerraTune
          </h2>
          <p className="mt-2 text-sm text-white/70">
            Your gateway to nature's symphony
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {(error || authError) && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg" role="alert">
              <span className="block sm:inline">{error || authError}</span>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-white/10 bg-white/5 text-white placeholder-white/50 rounded-t-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-white/10 bg-white/5 text-white placeholder-white/50 rounded-b-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-white/70">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-accent hover:text-accent/90">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm; 