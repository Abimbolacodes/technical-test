
type Props = {
    type?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    disabled?: boolean;
  } & React.InputHTMLAttributes<HTMLInputElement>;

  export function Input({ type = "text", value, onChange, placeholder, disabled, ...props }: Props) {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        {...props}
      />
    );
  }
