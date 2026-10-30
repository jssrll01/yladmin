import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('[yladmin]', error, info); }
  render() {
    if (!this.state.error) return this.props.children;
    const msg = (this.state.error && this.state.error.message) || String(this.state.error);
    return (
      <div style={{ padding: 24, fontFamily: 'system-ui' }}>
        <h2>Something went wrong</h2>
        <pre style={{ whiteSpace: 'pre-wrap', color: '#b00020' }}>{msg}</pre>
        <button type="button" onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }
}
