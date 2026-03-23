import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="text-4xl mb-4">⛅</div>
            <h2 className="text-lg font-bold text-gray-700 mb-2">Noe gikk galt</h2>
            <p className="text-sm text-gray-500 mb-4">
              {this.state.error?.message || 'En uventet feil oppstod'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600"
            >
              Last inn på nytt
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
