import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdWbSunny,
  MdDarkMode,
  MdSearch,
  MdClose,
  MdMenu,
  MdAssignment,
} from "react-icons/md";
import { useTheme } from "../context/ThemeContext";
import { sanitizeErrorMessage } from "../lib/utils";
import WaitlistModal from "./WaitlistModal";

const CreatorPaymentModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!fullName || !email || !phone) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^2547\d{8}$/.test(phone)) {
      setError("Phone must be in format 2547XXXXXXXX");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // TODO: integrate your M-Pesa STK push here
      await new Promise((r) => setTimeout(r, 2000)); // simulate API call
      alert("Payment request sent! Check your phone for the M-Pesa prompt.");
      onClose();
    } catch (err: unknown) {
      setError(
        sanitizeErrorMessage(
          err instanceof Error ? err.message : String(err),
          "Payment request failed. Please try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-red-700 px-6 pt-8 pb-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <MdClose className="text-2xl" />
          </button>
          <h2 className="text-white text-2xl font-black tracking-tight">
            Creator Annual Access
          </h2>
          <p className="text-white/80 text-sm mt-1">
            Pay once. Create all year.
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex flex-col gap-5">
          {/* Price badge */}
          <div className="flex items-center justify-center">
            <span className="bg-primary/10 border border-primary/30 text-primary font-bold text-lg px-5 py-2 rounded-full">
              KES 1,000 / year
            </span>
          </div>

          {/* Section label */}
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <MdAssignment className="text-lg" />
            Submit Your Payment Details & Pay
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">
              Full Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-primary/50 transition-all"
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
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* M-Pesa Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">
              M-Pesa Phone Number <span className="text-primary">*</span>
            </label>
            <input
              type="tel"
              placeholder="2547XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <span className="text-xs text-muted">Format: 254712345678</span>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-primary font-medium -mt-2">{error}</p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-xl transition-all duration-200 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Processing..." : "Pay KES 1,000"}
          </button>

          <p className="text-center text-xs text-muted">
            You'll receive an M-Pesa STK push to complete payment securely.
          </p>
        </div>
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse", href: "#browse" },
    { label: "Live Talks", href: "#live_talks" },
    { label: "Meet Your Speaker", href: "#meet_your_speaker" },
    { label: "Monetize Your Work", href: "#monetize_your_work" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 xl:px-24 transition-all duration-500 glass shadow-lg shadow-black/5 ${
          isScrolled ? "h-14 border-b border-primary/10" : "h-20"
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        {/* Logo / Desktop Nav */}
        <div className="flex items-center gap-8">
          <a
            href="/"
            className="text-primary text-2xl md:text-3xl font-black tracking-tighter hover:scale-105 transition-transform duration-200"
          >
            ARBAN<span className="text-foreground">TV</span>
          </a>

          <div className="hidden md:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search — unchanged */}
          <div
            className={`relative flex items-center transition-all duration-500 ease-in-out ${isSearchFocused ? "w-56 md:w-80 scale-105" : "w-10 md:w-48"}`}
          >
            <MdSearch
              className={`absolute left-3 text-xl transition-colors duration-300 pointer-events-none z-10 ${isSearchFocused ? "text-primary" : "text-muted-foreground"}`}
            />
            <input
              type="text"
              placeholder={
                isSearchFocused ? "Search titles, actors, genres..." : ""
              }
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`w-full bg-secondary/40 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm transition-all duration-500 outline-none ${
                isSearchFocused
                  ? "opacity-100 bg-background ring-2 ring-primary/50 shadow-[0_0_20px_rgba(229,9,20,0.3)]"
                  : "md:opacity-100 opacity-0 cursor-pointer hover:bg-secondary/60"
              }`}
            />
          </div>

          {/* Desktop: Join Waitlist button */}
          <button
            onClick={() => setShowWaitlist(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg shadow-primary/20 whitespace-nowrap"
          >
            Join Waitlist
          </button>

          {/* Desktop: Creator button */}
          <button
            onClick={() => navigate("/creator-login")}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-200 whitespace-nowrap"
          >
            Log In As Creator
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors duration-200 text-xl text-foreground"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <MdDarkMode /> : <MdWbSunny />}
          </button>

          {/* Desktop: Avatar */}
          <div className="w-8 h-8 rounded bg-primary/20 border border-primary/50 hidden md:block cursor-pointer overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix"
              alt="avatar"
            />
          </div>

          {/* Mobile: Hamburger — replaces the scattered icon buttons */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex md:hidden p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors text-foreground"
            aria-label="Open Menu"
          >
            <MdMenu className="text-2xl" />
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Panel slides in from right */}
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-card border-l border-border flex flex-col shadow-2xl animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="text-primary font-black text-lg tracking-tighter">
                ARBAN<span className="text-foreground">TV</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-secondary transition-colors text-foreground"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 flex flex-col px-4 py-5 gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:text-primary hover:bg-secondary/80 focus:bg-secondary focus:text-primary transition-all outline-none"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Waitlist + Creator Buttons */}
            <div className="px-4 pb-6 border-t border-border pt-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowWaitlist(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-full transition-all shadow-lg shadow-primary/20"
              >
                Join Waitlist
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/creator-login");
                }}
                className="w-full flex items-center justify-center gap-2 border border-primary text-primary font-bold py-3 rounded-full hover:bg-primary hover:text-white transition-all duration-200"
              >
                <MdAssignment />
                Log In As Creator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Waitlist Modal */}
      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} />}

      {/* Payment Modal */}
      {showCreatorModal && (
        <CreatorPaymentModal onClose={() => setShowCreatorModal(false)} />
      )}
    </>
  );
};

export default Navbar;
