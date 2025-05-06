import { createContext, useContext, useState, ReactNode } from "react";
import type { Server, ServerList } from "@/types";

// Define the shape of our app state
interface AppState {
  servers: ServerList | null;
  currentServer: Server | null;
  isLoading: {
    servers: boolean;
    currentServer: boolean;
  };
  error: {
    servers: string | null;
    currentServer: string | null;
  };
}

// Define actions that can be performed on the state
interface AppStateContextValue {
  state: AppState;
  setServers: (servers: ServerList) => void;
  setCurrentServer: (server: Server | null) => void;
  setServersLoading: (isLoading: boolean) => void;
  setCurrentServerLoading: (isLoading: boolean) => void;
  setServersError: (error: string | null) => void;
  setCurrentServerError: (error: string | null) => void;
}

// Create a context with a default value
const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

// Initial state
const initialState: AppState = {
  servers: null,
  currentServer: null,
  isLoading: {
    servers: false,
    currentServer: false,
  },
  error: {
    servers: null,
    currentServer: null,
  },
};

// Provider component
export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const setServers = (servers: ServerList) => {
    setState((prevState) => ({
      ...prevState,
      servers,
      isLoading: { ...prevState.isLoading, servers: false },
      error: { ...prevState.error, servers: null },
    }));
  };

  const setCurrentServer = (currentServer: Server | null) => {
    setState((prevState) => ({
      ...prevState,
      currentServer,
      isLoading: { ...prevState.isLoading, currentServer: false },
      error: { ...prevState.error, currentServer: null },
    }));
  };

  const setServersLoading = (isLoading: boolean) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: { ...prevState.isLoading, servers: isLoading },
    }));
  };

  const setCurrentServerLoading = (isLoading: boolean) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: { ...prevState.isLoading, currentServer: isLoading },
    }));
  };

  const setServersError = (error: string | null) => {
    setState((prevState) => ({
      ...prevState,
      error: { ...prevState.error, servers: error },
      isLoading: { ...prevState.isLoading, servers: false },
    }));
  };

  const setCurrentServerError = (error: string | null) => {
    setState((prevState) => ({
      ...prevState,
      error: { ...prevState.error, currentServer: error },
      isLoading: { ...prevState.isLoading, currentServer: false },
    }));
  };

  return (
    <AppStateContext.Provider
      value={{
        state,
        setServers,
        setCurrentServer,
        setServersLoading,
        setCurrentServerLoading,
        setServersError,
        setCurrentServerError,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

// Custom hook to use the AppState
export function useAppState() {
  const context = useContext(AppStateContext);

  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }

  return context;
}
