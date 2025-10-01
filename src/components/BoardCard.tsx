import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Board } from "../context/BoardContext";
import { Pencil, Trash2 } from "lucide-react";

interface BoardCardProps {
  board: Board;
  onSave: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

export default function BoardCard({ board, onSave, onDelete }: BoardCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(board.name);
  const navigate = useNavigate();

  const handleSave = () => {
    if (!editValue.trim()) return;
    onSave(board.id, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(board.name);
  };

  return (
    // Change: Better card styling with transitions and shadows
    <div className="bg-white p-5 rounded-lg shadow-md relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {isEditing ? (
        <div>
          <input
            className="border border-slate-300 p-2 w-full mb-3 rounded-md focus:ring-2 focus:ring-indigo-500"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              className="bg-indigo-600 text-white px-4 py-1 rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="bg-slate-200 text-slate-700 px-4 py-1 rounded-md text-sm font-semibold hover:bg-slate-300 transition-colors"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            className="cursor-pointer"
            onClick={() => navigate(`/board/${board.id}`)}
          >
            <h2 className="text-xl font-bold text-slate-800">{board.name}</h2>
            <p className="text-sm text-slate-500 mt-1">{board.columns.length} columns</p>
          </div>
          {/* Change: Icon buttons for a cleaner look */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              className="text-slate-500 hover:text-amber-600 transition-colors p-1"
              onClick={() => setIsEditing(true)}
            >
              <Pencil size={18} />
            </button>
            <button
              className="text-slate-500 hover:text-red-600 transition-colors p-1"
              onClick={() => onDelete(board.id)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}