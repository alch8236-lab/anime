import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Что показать, если дочернее поддерево упало (обычно null — остаётся статичный фон) */
  fallback?: ReactNode;
}

interface State {
  failed: boolean;
}

/**
 * Изолирует ошибки WebGL/ассетов: если 3D-сцена падает
 * (не загрузилась модель, нет поддержки GL), остальной сайт жив.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('[ErrorBoundary] 3D-сцена отключена:', error);
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
