/**
 * ErrorBoundary - Catches React errors and displays fallback UI
 * Essential for wrapping 3D content that may crash on unsupported devices
 */

import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Title shown in error UI */
  title?: string;
  /** Description shown in error UI */
  description?: string;
  /** Accent color for the error UI */
  accentColor?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      const {
        title = "Something went wrong",
        description = "An error occurred while rendering this component.",
        accentColor = "#f87171",
      } = this.props;

      return (
        <motion.div
          className="flex items-center justify-center w-full h-full min-h-[200px] p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center gap-4 text-center max-w-md">
            {/* Error icon */}
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              <AlertTriangle size={32} style={{ color: accentColor }} />
            </div>

            {/* Error text */}
            <div>
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: accentColor }}
              >
                {title}
              </h3>
              <p className="text-sm text-white/60">{description}</p>
            </div>

            {/* Error details (collapsible in dev) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="w-full text-left">
                <summary className="text-xs text-white/40 cursor-pointer hover:text-white/60">
                  Show error details
                </summary>
                <pre className="mt-2 p-2 text-xs bg-black/30 rounded border border-white/10 overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            {/* Retry button */}
            <motion.button
              onClick={this.handleRetry}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium"
              style={{
                borderColor: accentColor,
                color: accentColor,
              }}
              whileHover={{ scale: 1.02, backgroundColor: `${accentColor}10` }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw size={16} />
              Try again
            </motion.button>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

// Convenience wrapper for 3D content
export const Model3DErrorBoundary: React.FC<{
  children: ReactNode;
  accentColor?: string;
}> = ({ children, accentColor }) => (
  <ErrorBoundary
    title="3D Viewer Error"
    description="The 3D model couldn't be loaded. Your browser may not support WebGL."
    accentColor={accentColor}
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;
