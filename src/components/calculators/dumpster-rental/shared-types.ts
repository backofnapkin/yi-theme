/**
 * Shared types for calculator components
 */
export interface BaseProps {
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface InputProps extends BaseProps {
    id?: string;
    name?: string;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
    'aria-label'?: string;
  }
  
  export interface ButtonProps extends BaseProps {
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    'aria-label'?: string;
  }
  
  export interface TableProps extends BaseProps {
    headers?: string[];
    rows?: any[][];
    caption?: string;
  }