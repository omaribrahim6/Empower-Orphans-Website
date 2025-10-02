import Link from "next/link";

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
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

