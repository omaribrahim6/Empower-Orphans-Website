import Link from "next/link";

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "outline-hero";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function Button({
  href,
  onClick,
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const baseStyles = "btn-pill inline-flex items-center justify-center font-semibold transition-all";
  
  const variantStyles = {
    primary: "bg-eo-teal text-white hover:brightness-110 btn-glow",
    secondary: "bg-eo-blue text-white hover:brightness-110",
    outline: "border-2 border-eo-teal text-eo-teal hover:bg-eo-teal hover:text-white",
    "outline-hero": "border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-eo-teal shadow-lg",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} ${
    disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"
  }`;

  if (href && !disabled) {
    // Check if the href is an external link (Instagram, WhatsApp, Google Forms, Square, or any full URL)
    const isExternal = href.startsWith('http://') || 
                       href.startsWith('https://') || 
                       href.includes('instagram.com') ||
                       href.includes('chat.whatsapp.com') ||
                       href.includes('docs.google.com/forms') ||
                       href.includes('square.link');
    
    if (isExternal) {
      return (
        <a 
          href={href} 
          className={styles}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={styles}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

