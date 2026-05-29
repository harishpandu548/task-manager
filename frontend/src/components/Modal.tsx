import { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  full: 'max-w-full',
};

export default function Modal({ isOpen, onClose, title, description, children, size = 'lg' }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className={`relative w-full ${sizeClasses[size]} rounded-[2rem] bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-2xl p-6 sm:p-8 animate-slide-up overflow-y-auto max-h-[90vh]`}>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pr-8">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)]">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              {description}
            </p>
          )}
        </div>

        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
