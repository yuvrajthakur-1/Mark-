import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="bg-slate-800 p-6 rounded-2xl max-w-lg w-full text-white border border-red-500/30">
            <h2 className="text-xl font-bold text-red-400 mb-4">Something went wrong</h2>
            <div className="bg-slate-900 p-4 rounded-lg overflow-auto max-h-64 text-sm font-mono text-slate-300">
              {this.state.error?.message}
            </div>
            <button
              className="mt-6 px-4 py-2 bg-brand text-white rounded-lg font-bold hover:bg-brand/90 transition-colors"
              onClick={() => window.location.reload()}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
