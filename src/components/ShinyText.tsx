import './ShinyText.css';

const ShinyText = ({ children, disabled = false, speed = 5, className = '' }: {
  children: React.ReactNode;
  disabled?: boolean;
  speed?: number;
  className?: string;
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`} style={{ animationDuration }}>
      {children}
    </span>
  );
};

export default ShinyText;