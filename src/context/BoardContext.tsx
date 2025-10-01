import React, { createContext, useState, useEffect, ReactNode } from "react";

// Define props for the provider component, ensuring it accepts children.
interface BoardProviderProps {
  children: ReactNode;
}

// Define the structure for a single Task.
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  createdBy: string;
}

// Define the structure for a Column, which contains an array of Tasks.
export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

// Define the structure for a Board, which contains an array of Columns.
export interface Board {
  id: string;
  name: string;
  columns: Column[];
}

// Define the shape of the context's value.
interface BoardContextType {
  boards: Board[];
  setBoards: (boards: Board[]) => void;
}

// Create the React Context with an initial value of undefined.
export const BoardContext = createContext<BoardContextType | undefined>(undefined);

// Create the provider component that will wrap the application.
export const BoardProvider = ({ children }: BoardProviderProps) => {
  // Initialize state by lazy-loading from localStorage.
  // This prevents re-reading from localStorage on every render.
  const [boards, setBoards] = useState<Board[]>(() => {
    const saved = localStorage.getItem("boards");
    // If data exists in localStorage, parse it; otherwise, return an empty array.
    return saved ? JSON.parse(saved) : [];
  });

  // Effect to persist the `boards` state to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);

  // Provide the boards state and setter function to children components.
  return (
    <BoardContext.Provider value={{ boards, setBoards }}>
      {children}
    </BoardContext.Provider>
  );
};
