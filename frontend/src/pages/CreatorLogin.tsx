import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatorLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    
    // Redirect to dashboard on success
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center pt-24 pb-12 px-4 bg-background overflow-hidden relative">
      
      {/* Background Decorative Blur */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-red-800/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-8 relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-3xl mb-6 shadow-inner">
          🔒
        </div>
        
        <h1 className="text-3xl font-black text-foreground tracking-tight text-center mb-2">
          Creator <span className="text-primary">Login</span>
        </h1>
        <p className="text-muted text-center mb-8 text-sm px-4">
          Welcome back! Please enter your details to access your creator dashboard and analytics.
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-foreground">Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="creator@arbantv.com"
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-semibold text-foreground">Password</label>
              <a href="#" className="text-xs font-semibold text-primary hover:text-red-700 transition-colors">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all tracking-widest"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full bg-primary hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-[0_4px_20px_rgba(229,9,20,0.3)] hover:shadow-[0_8px_30px_rgba(229,9,20,0.5)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="animate-pulse flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <span>Log In to Dashboard</span>
            )}
          </button>

        </form>

        <p className="mt-8 text-sm text-muted">
          Don't have a creator account?{' '}
          <a href="#" className="font-semibold text-foreground hover:text-primary transition-colors">
            Apply now
          </a>
        </p>

      </div>
    </div>
  );
};

export default CreatorLogin;
