import React, { createContext, useState, useEffect } from "react";

interface BoardProviderProps {
  children: React.ReactNode;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  createdBy: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
}

interface BoardContextType {
  boards: Board[];
  setBoards: (boards: Board[]) => void;
}

export const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider = ({ children }: BoardProviderProps) => {
  const [boards, setBoards] = useState<Board[]>(() => {
    const saved = localStorage.getItem("boards");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);

  return (
    <BoardContext.Provider value={{ boards, setBoards }}>
      {children}
    </BoardContext.Provider>
  );
};
