import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';

const TestComponent = () => {
  const { user, login, logout, isAdmin } = useAuth();
  return (
    <div>
      <div data-testid="user">{user ? user.name : 'Guest'}</div>
      <div data-testid="role">{user ? user.role : 'None'}</div>
      <div data-testid="is-admin">{isAdmin() ? 'Yes' : 'No'}</div>
      <button data-testid="login-btn" onClick={() => login('mock_token', { name: 'John', role: 'ROLE_ADMIN' })}>
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext & useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders initial guest states when storage is empty', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user').textContent).toBe('Guest');
    expect(screen.getByTestId('role').textContent).toBe('None');
    expect(screen.getByTestId('is-admin').textContent).toBe('No');
  });

  it('updates state and localStorage on login', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginBtn = screen.getByTestId('login-btn');
    fireEvent.click(loginBtn);

    expect(screen.getByTestId('user').textContent).toBe('John');
    expect(screen.getByTestId('role').textContent).toBe('ROLE_ADMIN');
    expect(screen.getByTestId('is-admin').textContent).toBe('Yes');

    expect(localStorage.getItem('token')).toBe('mock_token');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({ name: 'John', role: 'ROLE_ADMIN' });
  });

  it('clears state and localStorage on logout', () => {
    localStorage.setItem('token', 'mock_token');
    localStorage.setItem('user', JSON.stringify({ name: 'John', role: 'ROLE_ADMIN' }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user').textContent).toBe('John');

    const logoutBtn = screen.getByTestId('logout-btn');
    fireEvent.click(logoutBtn);

    expect(screen.getByTestId('user').textContent).toBe('Guest');
    expect(localStorage.getItem('token')).toBeNull();
  });
});
