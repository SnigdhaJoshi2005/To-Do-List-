const variants = {
  primary: "bg-accent text-white hover:bg-accent-hover shadow-[0_2px_8px_rgba(156,175,136,0.3)]",
  secondary: "bg-surface border border-border text-secondary hover:border-accent hover:text-accent",
  ghost: "bg-transparent text-secondary hover:text-primary hover:bg-muted",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({ variant = "primary", size = "md", children, className = "", ...props }) {
  return (
    <button
      className={`rounded-[var(--radius-md)] font-semibold transition-all duration-[var(--transition)] active:scale-95 cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
