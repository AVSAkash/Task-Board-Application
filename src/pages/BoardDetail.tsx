import { useContext, useState } from 'react';
import { BoardContext } from '../context/BoardContext';
import type { Column as ColumnType, Task } from '../context/BoardContext';
import { useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import Column from '../components/Column';

export default function BoardDetail() {
  const context = useContext(BoardContext);
  if (!context) throw new Error('BoardContext must be used within BoardProvider');
  
  const { boards, setBoards } = context;
  const { id } = useParams<{ id: string }>();
  // Find the specific board being viewed from the global context using the URL parameter.
  const board = boards.find((b) => b.id === id);

  // State for the "Add Column" input field.
  const [columnTitle, setColumnTitle] = useState('');

  // State for filtering controls.
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [dueDateFilter, setDueDateFilter] = useState('');

  // State for sorting controls.
  const [sortOption, setSortOption] = useState<'none' | 'priority-high' | 'priority-low' | 'due-soon' | 'due-late'>('none');

  // State to manage the visibility and data of the Add/Edit Task form.
  // It holds the column ID and an optional task ID (if editing).
  const [showTaskForm, setShowTaskForm] = useState<{ colId: string; taskId?: string } | null>(null);
  const [taskForm, setTaskForm] = useState<Omit<Task, 'id'>>({
    title: '', description: '', priority: 'medium', dueDate: '', createdBy: '',
  });

  if (!board) return <p>Board not found</p>;

  // All state management functions are kept in this parent component to pass down to children.
  
  const addColumn = () => {
    if (!columnTitle.trim()) return;
    const newCol: ColumnType = { id: uuid(), title: columnTitle, tasks: [] };
    const updatedBoards = boards.map((b) =>
      b.id === board.id ? { ...b, columns: [...b.columns, newCol] } : b
    );
    setBoards(updatedBoards);
    setColumnTitle('');
  };
  
  const editColumn = (colId: string, newTitle: string) => {
    const updatedBoards = boards.map((b) =>
      b.id === board.id
        ? { ...b, columns: b.columns.map((c) => (c.id === colId ? { ...c, title: newTitle } : c)) }
        : b
    );
    setBoards(updatedBoards);
  };
  
  const deleteColumn = (colId: string) => {
    const updatedBoards = boards.map((b) =>
      b.id === board.id ? { ...b, columns: b.columns.filter((c) => c.id !== colId) } : b
    );
    setBoards(updatedBoards);
  };
  
  // Handles both creating a new task and updating an existing one.
  const handleSaveTask = (colId: string, taskId?: string) => {
    if (!taskForm.title.trim()) return;
    let updatedBoards;
    if (taskId) {
      // Logic for updating an existing task.
      updatedBoards = boards.map((b) =>
        b.id === board.id
          ? { ...b, columns: b.columns.map((c) =>
                c.id === colId
                  ? { ...c, tasks: c.tasks.map((t) => (t.id === taskId ? { ...t, ...taskForm } : t)) }
                  : c
              ),
            }
          : b
      );
    } else {
      // Logic for creating a new task.
      const newTask: Task = { id: uuid(), ...taskForm };
      updatedBoards = boards.map((b) =>
        b.id === board.id
          ? { ...b, columns: b.columns.map((c) => (c.id === colId ? { ...c, tasks: [...c.tasks, newTask] } : c)),
            }
          : b
      );
    }
    setBoards(updatedBoards);
    // Reset and hide the form after saving.
    setShowTaskForm(null);
    setTaskForm({ title: '', description: '', priority: 'medium', dueDate: '', createdBy: '' });
  };
  
  const deleteTask = (colId: string, taskId: string) => {
    const updatedBoards = boards.map((b) =>
      b.id === board.id
        ? { ...b, columns: b.columns.map((c) =>
              c.id === colId ? { ...c, tasks: c.tasks.filter((t) => t.id !== taskId) } : c
            ),
          }
        : b
    );
    setBoards(updatedBoards);
  };

  // Main logic for handling the end of a drag-and-drop operation.
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return; // Dropped outside a valid target.
    if (source.droppableId === destination.droppableId && source.index === destination.index) return; // Dropped in the same place.
    
    const sourceCol = board.columns.find(c => c.id === source.droppableId);
    const destCol = board.columns.find(c => c.id === destination.droppableId);
    if (!sourceCol || !destCol) return;

    // Create copies of task arrays to avoid direct mutation.
    const sourceTasks = [...sourceCol.tasks];
    const destTasks = [...destCol.tasks];
    // Remove the dragged task from its original location.
    const [movedTask] = sourceTasks.splice(source.index, 1);
    
    if (source.droppableId === destination.droppableId) {
        // Task moved within the same column.
        sourceTasks.splice(destination.index, 0, movedTask);
        const newColumns = board.columns.map(c => c.id === sourceCol.id ? {...c, tasks: sourceTasks} : c);
        setBoards(boards.map(b => b.id === board.id ? {...b, columns: newColumns} : b));
    } else {
        // Task moved to a different column.
        destTasks.splice(destination.index, 0, movedTask);
        const newColumns = board.columns.map(c => {
            if (c.id === sourceCol.id) return {...c, tasks: sourceTasks};
            if (c.id === destCol.id) return {...c, tasks: destTasks};
            return c;
        });
        setBoards(boards.map(b => b.id === board.id ? {...b, columns: newColumns} : b));
    }
  };
  
  // Applies all active filters and sorting options to a list of tasks.
  const filterAndSortTasks = (tasks: Task[]) => {
    let result = tasks.filter(
      (t) =>
        (t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (priorityFilter === 'all' || t.priority === priorityFilter) &&
        (dueDateFilter ? t.dueDate === dueDateFilter : true)
    );
    
    const priorityOrder = { high: 1, medium: 2, low: 3 };

    switch (sortOption) {
      case 'priority-high': result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]); break;
      case 'priority-low': result.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]); break;
      case 'due-soon': result.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()); break;
      case 'due-late': result.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()); break;
    }
    return result;
  };
  
  // Sets state to show the task form for adding a new task.
  const handleAddTask = (colId: string) => {
    setShowTaskForm({ colId });
    setTaskForm({ title: '', description: '', priority: 'medium', dueDate: '', createdBy: '' });
  };
  
  // Sets state to show the task form for editing, pre-filling it with the task's data.
  const handleEditTask = (colId: string, taskId: string) => {
    const task = board.columns.find(c => c.id === colId)?.tasks.find(t => t.id === taskId);
    if(task) {
        setShowTaskForm({ colId, taskId });
        setTaskForm({
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate,
            createdBy: task.createdBy,
        });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4">{board.name}</h1>

      <div className="mb-4 flex gap-4 flex-wrap">
        <input className="border p-2 flex-1" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <select className="border p-2" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as any)}>
            <option value="all">All Priorities</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
        </select>
        <input type="date" className="border p-2" value={dueDateFilter} onChange={(e) => setDueDateFilter(e.target.value)} />
        <select className="border p-2" value={sortOption} onChange={(e) => setSortOption(e.target.value as any)}>
            <option value="none">No Sorting</option><option value="priority-high">Priority: High → Low</option><option value="priority-low">Priority: Low → High</option><option value="due-soon">Due Date: Near → Far</option><option value="due-late">Due Date: Far → Near</option>
        </select>
      </div>
      
      <div className="mb-4 flex gap-2">
        <input className="border p-2 flex-1" placeholder="New Column Title" value={columnTitle} onChange={(e) => setColumnTitle(e.target.value)} />
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={addColumn}>Add Column</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {board.columns.map((col) => (
            <Column
              key={col.id}
              column={col}
              tasks={filterAndSortTasks(col.tasks)}
              onEditColumn={editColumn}
              onDeleteColumn={deleteColumn}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={deleteTask}
              showTaskForm={showTaskForm}
              taskForm={taskForm}
              setTaskForm={setTaskForm}
              handleSaveTask={handleSaveTask}
              setShowTaskForm={setShowTaskForm}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
