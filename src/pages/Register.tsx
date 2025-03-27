import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('candidate');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType
          }
        }
      });

      if (error) throw error;

      toast.success('Registration successful! Please log in.');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
          <p className="mt-2 text-gray-600">Start your journey with HireSmart</p>
        </div>
        <form onSubmit={handleRegister} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                I am a
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="candidate">Candidate</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign up
          </button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/" className="text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;