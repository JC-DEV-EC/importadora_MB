import { cn } from "../../lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-secondary">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "block w-full rounded-lg border border-default bg-card px-3.5 py-2.5 text-sm text-primary placeholder-muted shadow-sm transition-all",
            "focus:border-mb-400 focus:outline-none focus:ring-2 focus:ring-mb-400/20",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:text-muted",
            error && "border-rose-400 focus:border-rose-400 focus:ring-rose-400/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-500">{error}</p>}
        {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
