import React from 'react';
import { FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary/30 pt-16 pb-8 border-t border-white/5">
      <div className="container mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <a href="/" className="text-primary text-3xl font-black tracking-tighter">
              ARBAN<span className="text-foreground">TV</span>
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Kenya's premier entertainment destination. Bringing you the best of local stories and global cinema in stunning quality.
            </p>
            <div className="flex gap-4">
              <a href="https://www.youtube.com/@arbantvke" className="p-2 bg-secondary rounded-full hover:text-primary hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary outline-none"><FaYoutube size={20} /></a>
              <a href="#" className="p-2 bg-secondary rounded-full hover:text-primary hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary outline-none"><FaWhatsapp size={20} /></a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-foreground font-bold mb-6 uppercase tracking-wider text-sm">Entertainment</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#browse" className="hover:text-primary hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none rounded-sm">Browse</a></li>
              <li><a href="#live_talks" className="hover:text-primary hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none rounded-sm">Live Talks</a></li>
              <li><a href="#meet_your_speaker" className="hover:text-primary hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none rounded-sm">Meet Your Speaker</a></li>
              <li><a href="#monetize_your_work" className="hover:text-primary hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none rounded-sm">Monetize Your Work</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-foreground font-bold mb-6 uppercase tracking-wider text-sm">Support</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none rounded-sm">Help Center</a></li>
              <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none rounded-sm">Account</a></li>
              <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none rounded-sm">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none rounded-sm">Ways to Watch</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-foreground font-bold mb-6 uppercase tracking-wider text-sm">Stay Updated</h4>
            <p className="text-muted-foreground text-sm mb-4">Subscribe to get the latest news and release updates.</p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-secondary/50 border border-white/10 rounded-lg py-3 px-4 text-sm transition-all duration-300 outline-none focus:bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:shadow-[0_0_20px_rgba(229,9,20,0.2)]"
              />
              <button className="absolute right-2 top-2 bg-primary p-2 rounded-md hover:bg-red-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                <MdEmail className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ArbanTV Kenya. All rights reserved</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
            <a href="#" className="hover:text-foreground">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
