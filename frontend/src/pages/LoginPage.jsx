import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast'; // <-- 1. IMPORT TOAST
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const LoginPage = () => {
  // We no longer need the 'error' state for the message
  // const [error, setError] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    
    if (result.success) {
      toast.success('Login successful!'); // Optional: show success toast
      navigate('/');
    } else {
      // 2. TRIGGER THE ERROR TOAST
      toast.error(result.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* 3. REMOVE THE OLD ERROR MESSAGE P-TAG */}
          {/* {error && <p className="text-center text-sm text-red-600">{error}</p>} */}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='pt-4'>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;