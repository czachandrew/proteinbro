import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Log {
  id: number;
  amount: number;
  name: string;
  timestamp: string;
}

interface ProteinState {
  dailyGoal: number;
  totalConsumed: number;
  logs: Log[];
}

type ProteinAction =
  | { type: 'ADD_LOG'; payload: Log }
  | { type: 'SET_DAILY_GOAL'; payload: number }
  | { type: 'RESET_DAILY_CONSUMPTION' };

const initialState: ProteinState = {
  dailyGoal: 150, // Default daily goal, can be adjusted
  totalConsumed: 0,
  logs: [],
};

const ProteinContext = createContext<
  | {
      state: ProteinState;
      dispatch: React.Dispatch<ProteinAction>;
    }
  | undefined
>(undefined);

function proteinReducer(
  state: ProteinState,
  action: ProteinAction
): ProteinState {
  switch (action.type) {
    case 'ADD_LOG':
      return {
        ...state,
        logs: [action.payload, ...state.logs],
        totalConsumed: state.totalConsumed + action.payload.amount,
      };
    case 'SET_DAILY_GOAL':
      return {
        ...state,
        dailyGoal: action.payload,
      };
    case 'RESET_DAILY_CONSUMPTION':
      return {
        ...state,
        totalConsumed: 0,
        logs: [],
      };
    default:
      return state;
  }
}

export function ProteinProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(proteinReducer, initialState);

  return (
    <ProteinContext.Provider value={{ state, dispatch }}>
      {children}
    </ProteinContext.Provider>
  );
}

export function useProtein() {
  const context = useContext(ProteinContext);
  if (context === undefined) {
    throw new Error('useProtein must be used within a ProteinProvider');
  }
  return context;
}
