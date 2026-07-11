import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProtectedRoute from '../components/ProtectedRoute';
import * as useAuthHook from '../hooks/useAuth';

vi.mock('../hooks/useAuth');

describe('ProtectedRoute component', () => {
  it('redirects to login when user is unauthenticated', () => {
    vi.spyOn(useAuthHook, 'useAuth').mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div data-testid="child">Secret Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div data-testid="login">Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('login')).toBeInTheDocument();
    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
  });

  it('renders child components when user is authenticated', () => {
    vi.spyOn(useAuthHook, 'useAuth').mockReturnValue({
      user: { name: 'John Doe', role: 'ROLE_USER' },
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div data-testid="child">Secret Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });
});
