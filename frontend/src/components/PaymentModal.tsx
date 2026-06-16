import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";


interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistName?: string;
  price?: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, playlistName, price = 600 }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate Daraja API Call
    console.log("Initiating M-Pesa Payment for:", formData);
    
    // Here you would call your backend endpoint
    // await fetch('/api/pay', { method: 'POST', body: JSON.stringify(formData) });

    setTimeout(() => {
      setIsLoading(false);
      alert("M-Pesa STK Push sent! Please check your phone.");
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-background border-primary/10">
        <div className="bg-secondary/30 p-8 text-center border-b border-primary/5">
          <DialogTitle className="text-2xl font-bold text-foreground mb-2">Submit Payment Information</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Complete payment and submit your details below
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold mb-4">
              <span>📋</span> Submit Your Payment Details & Pay
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Full Name *</label>
              <Input
                required
                placeholder="Enter your full name"
                className="bg-secondary/20 h-12"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Email Address *</label>
              <Input
                required
                type="email"
                placeholder="your@email.com"
                className="bg-secondary/20 h-12"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Playlist *</label>
              <div className="relative">
                <select 
                  className="w-full h-12 px-3 rounded-md border border-input bg-secondary/20 text-sm focus:outline-none focus:ring-1 focus:ring-ring appearance-none"
                  disabled
                >
                  <option>{playlistName || "Standard Playlist"} - KES {price}</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  ▼
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">M-Pesa Phone Number *</label>
              <Input
                required
                placeholder="2547XXXXXXXX"
                className="bg-secondary/20 h-12 font-mono"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
              <p className="text-[10px] text-muted-foreground">Format: 254712345678</p>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : `Pay KES ${price}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
