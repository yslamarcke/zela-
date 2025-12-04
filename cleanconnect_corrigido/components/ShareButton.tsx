
import React from 'react';
import { Share2, Copy, Check } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
  className?: string;
  label?: string;
  onSuccess?: () => void;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ 
  title, 
  text, 
  url = window.location.href, 
  variant = 'primary',
  className = '',
  label = 'Compartilhar',
  onSuccess
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = async () => {
    const shareData = {
      title: title,
      text: text,
      url: url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        if (onSuccess) onSuccess();
      } else {
        // Fallback for desktop/browsers without share API
        const fullText = `${text}\n${url}`;
        await navigator.clipboard.writeText(fullText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.log('Share canceled or failed', err);
    }
  };

  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg";
  
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 px-4 py-2",
    secondary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 px-4 py-2",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 px-4 py-2",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-1.5",
    icon: "p-2 text-gray-500 hover:bg-gray-100 rounded-full hover:text-emerald-600",
  };

  return (
    <button 
      onClick={handleShare}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      title="Compartilhar"
    >
      {copied ? (
        <>
          <Check className={`${variant === 'icon' ? 'w-5 h-5' : 'w-4 h-4 mr-2'}`} />
          {variant !== 'icon' && "Copiado!"}
        </>
      ) : (
        <>
          <Share2 className={`${variant === 'icon' ? 'w-5 h-5' : 'w-4 h-4 mr-2'}`} />
          {variant !== 'icon' && label}
        </>
      )}
    </button>
  );
};
