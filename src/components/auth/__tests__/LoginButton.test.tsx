import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginButton } from '../LoginButton';

describe('LoginButton', () => {
  // Mockujemy globalne window.location
  const originalLocation = window.location;
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true
    });
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('renders a login button', () => {
    render(<LoginButton />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('redirects to Discord OAuth endpoint when clicked', async () => {
    render(<LoginButton />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    
    // Sprawdzamy czy przekierowanie było do API endpoint logowania
    expect(window.location.href).toContain('/api/auth/login');
  });

  it('adds redirect param when redirectTo prop is provided', () => {
    render(<LoginButton redirectTo="/dashboard" />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    
    // URL jest zakodowany, więc sprawdzamy zakodowany format
    expect(window.location.href).toContain('redirect_to=%2Fdashboard');
  });

  it('disables button when clicked', () => {
    render(<LoginButton />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    
    // Sprawdzamy czy przycisk jest wyłączony
    expect(button).toBeDisabled();
    // Sprawdzamy czy jest element z animacją ładowania
    expect(button.querySelector('.animate-spin')).not.toBeNull();
  });
}); 