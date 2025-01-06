import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  addStyle?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ addStyle, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={
          `border border-gray-300 rounded-md focus:border-primary focus:outline-none ` +
          (addStyle || "")
        }
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
