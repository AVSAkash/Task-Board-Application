import React, { useContext, useState } from "react";
import { BoardContext } from "../context/BoardContext";
import type { Board } from "../context/BoardContext";
import { v4 as uuid } from "uuid";
import BoardCard from "../components/BoardCard";
import { Plus } from 'lucide-react';

export default function BoardView() {
  const context = useContext(BoardContext);
  // Ensure the component is used within a BoardProvider.
  if (!context) throw new Error("BoardContext must be used within BoardProvider");

  const { boards, setBoards } = context;
  
  // State for the new board input field.
  const [boardName, setBoardName] = useState("");
  // State for the search query input.
  const [searchQuery, setSearchQuery] = useState("");

  // Creates a new board and adds it to the global state.
  const createBoard = () => {
    if (!boardName.trim()) return; // Don't create board with empty name.
    const newBoard: Board = { id: uuid(), name: boardName, columns: [] };
    setBoards([...boards, newBoard]);
    setBoardName(""); // Reset input field after creation.
  };

  // Updates the name of an existing board.
  const saveBoardName = (id: string, newName: string) => {
    const updatedBoards = boards.map((b) => (b.id === id ? { ...b, name: newName } : b));
    setBoards(updatedBoards);
  };

  // Deletes a board from the global state.
  const deleteBoard = (id: string) => {
    const updatedBoards = boards.filter((b) => b.id !== id);
    setBoards(updatedBoards);
  };

  // Filters boards based on the search query.
  const filteredBoards = boards.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Boards</h1>

      <div className="my-6 flex flex-col sm:flex-row gap-4">
        <input
          className="flex-grow border border-slate-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search boards..."
        />
        <div className="flex gap-2">
          <input
            className="flex-grow border border-slate-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            placeholder="New Board Name"
          />
          <button
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition-colors"
            onClick={createBoard}
          >
            <Plus size={16} /> Create
          </button>
        </div>
      </div>

      {/* Renders the list of filtered boards. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBoards.map((board) => (
          <BoardCard
            key={board.id}
            board={board}
            onSave={saveBoardName}
            onDelete={deleteBoard}
          />
        ))}
      </div>
    </div>
  );
}
