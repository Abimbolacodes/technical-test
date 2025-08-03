
type Props = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    variant?: "primary" | "secondary" | "danger";
  };

  export function Button({
    children,
    onClick,
    type = "button",
    disabled,
    variant = "primary",
  }: Props) {
    const baseStyles = "px-4 py-2 rounded font-medium focus:outline-none focus:ring-2";
    const variantStyles = {
      primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300",
      danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-300",
    };

    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {children}
      </button>
    );
  }
