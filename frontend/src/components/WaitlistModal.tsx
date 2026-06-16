import React, { useState } from 'react';
import { MdClose, MdCheckCircle, MdErrorOutline } from 'react-icons/md';


const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwuHW5lriZfOsnC_cyPIU0MtiSbL8PsPsDGmmrt-QMoJcYsd4uV2T3rXiwYG4Bs4Nkq/exec';


interface WaitlistModalProps {
    onClose: () => void;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

const WaitlistModal: React.FC<WaitlistModalProps> = ({ onClose }) => {
    const [name, setName]   = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async () => {
        // Basic validation
        if (!name.trim() || !email.trim() || !phone.trim()) {
        setErrorMsg('Please fill in all fields.');
        return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setErrorMsg('Please enter a valid email address.');
        return;
        }
        if (!/^2547\d{8}$/.test(phone)) {
        setErrorMsg('Phone must be in format 2547XXXXXXXX (12 digits).');
        return;
        }

    setErrorMsg('');
    setStatus('loading');

    try {
      // Google Apps Script requires a no-cors POST with FormData
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('email', email.trim());
      formData.append('phone', phone.trim());
      formData.append('timestamp', new Date().toISOString());

      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // required for Apps Script
        body: formData,
      });

      // no-cors means we can't read the response — assume success if no throw
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full hover:bg-secondary transition-colors text-muted hover:text-foreground"
          aria-label="Close"
        >
          <MdClose className="text-xl" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-red-700 px-6 pt-8 pb-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-white/80 text-xs font-semibold mb-3 uppercase tracking-widest">
            Coming Soon
          </div>
          <h2 className="text-white text-2xl font-black tracking-tight">Join the Waitlist</h2>
          <p className="text-white/80 text-sm mt-1">
            Be first to access Kenya's premier expert streaming platform.
          </p>
        </div>

        {/* Body */}
        {status === 'success' ? (
          <div className="px-6 py-10 flex flex-col items-center gap-4 text-center">
            <MdCheckCircle className="text-6xl text-green-400" />
            <h3 className="text-xl font-black text-foreground">You're on the list!</h3>
            <p className="text-sm text-muted">
              We'll notify you at <span className="text-primary font-semibold">{email}</span> the moment we launch.
            </p>
            <button
              onClick={onClose}
              className="mt-2 bg-primary hover:bg-red-700 text-white font-bold px-8 py-3 rounded-full transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="px-6 py-6 flex flex-col gap-4">

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">
                Full Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={status === 'loading'}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">
                Email Address <span className="text-primary">*</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">
                Phone Number <span className="text-primary">*</span>
              </label>
              <input
                type="tel"
                placeholder="2547XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={status === 'loading'}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
              />
              <span className="text-xs text-muted">Format: 254712345678</span>
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="flex items-center gap-2 text-sm text-primary font-medium -mt-1">
                <MdErrorOutline className="text-lg flex-shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={status === 'loading'}
              className="w-full bg-primary hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-xl transition-all duration-200 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] mt-1"
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Joining...
                </span>
              ) : (
                'Join the Waitlist'
              )}
            </button>

            <p className="text-center text-xs text-muted pb-1">
              No spam, ever. We'll only reach out when it matters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitlistModal;