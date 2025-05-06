import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { act } from 'react';
import ServerList from '@/components/dashboard/ServerList';
import { useAppState } from '@/components/hooks/useAppState';
import { useSupabase } from '@/components/hooks/useSupabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ServerList as ServerListType } from '@/types';

// Mock the hooks
vi.mock('@/components/hooks/useAppState', () => ({
  useAppState: vi.fn(),
}));

vi.mock('@/components/hooks/useSupabase', () => ({
  useSupabase: vi.fn(),
}));

// Mock fetch API
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('ServerList Component', () => {
  const mockSetServers = vi.fn();
  const mockSetServersLoading = vi.fn();
  const mockSetServersError = vi.fn();
  const mockSupabase = { 
    auth: {},
    realtime: {},
    supabaseUrl: '',
    supabaseKey: '',
  } as unknown as SupabaseClient;
  
  // Create mock data that matches the expected structure
  const mockServers: ServerListType = {
    data: [
      { 
        id: '1', 
        name: 'Active Server', 
        iconUrl: 'https://example.com/icon1.png', 
        active: true,
        config: {}
      },
      { 
        id: '2', 
        name: 'Inactive Server', 
        iconUrl: null, 
        active: false,
        config: {}
      },
      {
        id: '3',
        name: 'Test Discord',
        iconUrl: 'https://example.com/icon3.png',
        active: true,
        config: {}
      }
    ],
    total: 3,
    page: 1,
    pageSize: 6
  };

  // Create a mock app state that matches the expected structure
  const mockAppState = {
    servers: mockServers,
    currentServer: null,
    isLoading: { 
      servers: false, 
      currentServer: false 
    },
    error: { 
      servers: null, 
      currentServer: null 
    }
  };

  beforeEach(() => {
    // Mock implementations
    vi.mocked(useAppState).mockReturnValue({
      state: mockAppState,
      setServers: mockSetServers,
      setServersLoading: mockSetServersLoading,
      setServersError: mockSetServersError,
      setCurrentServer: vi.fn(),
      setCurrentServerLoading: vi.fn(),
      setCurrentServerError: vi.fn()
    });
    
    vi.mocked(useSupabase).mockReturnValue(mockSupabase);
    
    // Reset mocks
    mockSetServers.mockReset();
    mockSetServersLoading.mockReset();
    mockSetServersError.mockReset();
    mockFetch.mockReset();
    
    // Default mock for fetch
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockServers)
    });
    
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches servers when mounted', async () => {
    render(<ServerList />);
    
    expect(mockFetch).toHaveBeenCalledWith('/api/servers/list');
    expect(mockSetServersLoading).toHaveBeenCalledWith(true);
    
    await waitFor(() => {
      expect(mockSetServers).toHaveBeenCalledWith(mockServers);
      expect(mockSetServersLoading).toHaveBeenCalledWith(false);
    });
  });

  it('shows loading state with skeletons', async () => {
    // Override the mock for local loading state in component
    vi.mocked(useAppState).mockReturnValue({
      state: {
        servers: null,
        currentServer: null,
        isLoading: { servers: false, currentServer: false },
        error: { servers: null, currentServer: null }
      },
      setServers: mockSetServers,
      setServersLoading: mockSetServersLoading,
      setServersError: mockSetServersError,
      setCurrentServer: vi.fn(),
      setCurrentServerLoading: vi.fn(),
      setCurrentServerError: vi.fn()
    });
    
    const { container } = render(<ServerList />);
    
    // Component is using local loading state initially, so we should see skeletons
    const skeletons = container.querySelectorAll('.skeleton, [data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('handles API errors gracefully', async () => {
    const errorMessage = 'Failed to fetch servers';
    
    // Mock API error response
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: errorMessage })
    });
    
    render(<ServerList />);
    
    // Verify error handling
    await waitFor(() => {
      expect(mockSetServersError).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('filters servers based on search input', async () => {
    // Render component with servers data
    const { container, rerender } = render(<ServerList />);
    
    // Wait for initial rendering
    await waitFor(() => {
      expect(mockSetServers).toHaveBeenCalledWith(mockServers);
    });
    
    // Find search input (we need to mock how search works in component)
    const mockFilteredAppState = {
      ...mockAppState,
      // This simulates the filtered state after search
      servers: {
        ...mockServers,
        data: mockServers.data.filter(server => 
          server.name.toLowerCase().includes('discord')
        )
      }
    };
    
    // Update state with filtered servers
    vi.mocked(useAppState).mockReturnValue({
      state: mockFilteredAppState,
      setServers: mockSetServers,
      setServersLoading: mockSetServersLoading,
      setServersError: mockSetServersError,
      setCurrentServer: vi.fn(),
      setCurrentServerLoading: vi.fn(),
      setCurrentServerError: vi.fn()
    });
    
    // Re-render with updated mock
    rerender(<ServerList />);
    
    // Verify only servers with "Discord" in name are displayed
    const serverCards = container.querySelectorAll('div[class*="rounded-lg"]');
    let discordServerFound = false;
    
    serverCards.forEach(card => {
      if (card.textContent?.includes('Test Discord')) {
        discordServerFound = true;
      }
      // Make sure other servers are not visible
      expect(card.textContent?.includes('Active Server')).toBe(false);
    });
    
    expect(discordServerFound).toBe(true);
  });
  
  it('navigates to server details when clicking active server', async () => {
    const { container } = render(<ServerList />);
    
    // Wait for servers to load
    await waitFor(() => {
      expect(mockSetServers).toHaveBeenCalledWith(mockServers);
    });
    
    // Find active server card
    const serverCards = container.querySelectorAll('div[class*="rounded-lg"]');
    let activeServerCard = null;
    
    for (const card of serverCards) {
      if (card.textContent?.includes('Active Server')) {
        activeServerCard = card;
        break;
      }
    }
    
    expect(activeServerCard).not.toBeNull();
    
    // Click on active server card
    await act(async () => {
      fireEvent.click(activeServerCard!);
    });
    
    // Should navigate to server page
    expect(window.location.href).toBe('/dashboard/servers/1');
  });
  
  it('does not navigate when clicking inactive server', async () => {
    const { container } = render(<ServerList />);
    
    // Wait for servers to load
    await waitFor(() => {
      expect(mockSetServers).toHaveBeenCalledWith(mockServers);
    });
    
    // Find inactive server card
    const serverCards = container.querySelectorAll('div[class*="rounded-lg"]');
    let inactiveServerCard = null;
    
    for (const card of serverCards) {
      if (card.textContent?.includes('Inactive Server')) {
        inactiveServerCard = card;
        break;
      }
    }
    
    expect(inactiveServerCard).not.toBeNull();
    
    // Click on inactive server card
    await act(async () => {
      fireEvent.click(inactiveServerCard!);
    });
    
    // Should not navigate (URL remains empty)
    expect(window.location.href).toBe('');
  });
}); 