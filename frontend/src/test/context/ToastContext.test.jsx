import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, ...rest }) => <div {...rest}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

import { ToastProvider, useToast } from '../../context/ToastContext';

// Test component that exposes toast actions
function TestConsumer() {
  const { addToast } = useToast();
  return (
    <div>
      <button onClick={() => addToast('Success message', 'success')}>Add Success</button>
      <button onClick={() => addToast('Error message', 'error')}>Add Error</button>
      <button onClick={() => addToast('Info message', 'info')}>Add Info</button>
      <button onClick={() => addToast('Warning message', 'warning')}>Add Warning</button>
      <button onClick={() => addToast('Short toast', 'success', 500)}>Add Short</button>
    </div>
  );
}

describe('ToastContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws error when useToast is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow('useToast must be used within a ToastProvider');
    spy.mockRestore();
  });

  it('renders children', () => {
    render(
      <ToastProvider>
        <div data-testid="child">Hello</div>
      </ToastProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('shows a success toast', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );
    act(() => { fireEvent.click(screen.getByText('Add Success')); });
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('shows an error toast', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );
    act(() => { fireEvent.click(screen.getByText('Add Error')); });
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('shows an info toast', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );
    act(() => { fireEvent.click(screen.getByText('Add Info')); });
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('shows a warning toast', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );
    act(() => { fireEvent.click(screen.getByText('Add Warning')); });
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('auto-dismisses toast after duration', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );
    act(() => { fireEvent.click(screen.getByText('Add Short')); });
    expect(screen.getByText('Short toast')).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(600); });
    expect(screen.queryByText('Short toast')).not.toBeInTheDocument();
  });

  it('can show multiple toasts', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );
    act(() => { fireEvent.click(screen.getByText('Add Success')); });
    act(() => { fireEvent.click(screen.getByText('Add Error')); });
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('removes toast when close button is clicked', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );
    act(() => { fireEvent.click(screen.getByText('Add Success')); });
    expect(screen.getByText('Success message')).toBeInTheDocument();

    act(() => { fireEvent.click(screen.getByLabelText('Fermer')); });
    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });
});
