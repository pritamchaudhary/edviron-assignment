import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const RegisterPage = () => {
  const [username, setUsername] = useState(''); // <-- 1. ADD USERNAME STATE
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
        // 2. ADD USERNAME TO THE REQUEST
      const response = await axiosInstance.post('/auth/register', { username, email, password });
      if (response.data.success) {
        toast.success('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000); 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            
            {/* 3. ADD THE USERNAME INPUT FIELD */}
            <div>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className='pt-4'>
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
                autoComplete="new-password"
                required
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;