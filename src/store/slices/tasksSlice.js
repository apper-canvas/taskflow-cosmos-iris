import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
  tasks: [
    {
      id: '1',
      projectId: '1',
      title: 'Design Homepage Layout',
      description: 'Create wireframes and mockups for the new homepage',
      status: 'completed',
      priority: 'high',
      dueDate: '2024-02-01',
      parentTaskId: null,
      subtasks: ['2', '3'],
      assignee: 'Jane Smith',
      createdAt: '2024-01-15T00:00:00.000Z',
    },
    {
      id: '2',
      projectId: '1',
      title: 'Create Header Component',
      description: 'Develop responsive header with navigation',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2024-02-05',
      parentTaskId: '1',
      subtasks: [],
      assignee: 'John Doe',
      createdAt: '2024-01-16T00:00:00.000Z',
    },
    {
      id: '3',
      projectId: '1',
      title: 'Design Footer Layout',
      description: 'Create footer with links and contact information',
      status: 'todo',
      priority: 'low',
      dueDate: '2024-02-10',
      parentTaskId: '1',
      subtasks: [],
      assignee: 'Jane Smith',
      createdAt: '2024-01-17T00:00:00.000Z',
    },
    {
      id: '4',
      projectId: '2',
      title: 'Setup Development Environment',
      description: 'Configure React Native development environment',
      status: 'completed',
      priority: 'urgent',
      dueDate: '2024-02-05',
      parentTaskId: null,
      subtasks: [],
      assignee: 'Mike Johnson',
      createdAt: '2024-02-01T00:00:00.000Z',
    },
  ],
  loading: false,
  error: null,
  filters: {
    status: 'all',
    priority: 'all',
    assignee: 'all',
  },
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    addTask: (state, action) => {
      const newTask = {
        ...action.payload,
        id: Date.now().toString(),
        subtasks: [],
        createdAt: new Date().toISOString(),
      }
      state.tasks.push(newTask)
      
      // Update parent task if this is a subtask
      if (newTask.parentTaskId) {
        const parentTask = state.tasks.find(t => t.id === newTask.parentTaskId)
        if (parentTask && !parentTask.subtasks.includes(newTask.id)) {
          parentTask.subtasks.push(newTask.id)
        }
      }
      
      toast.success('Task created successfully!')
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id)
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload }
        toast.success('Task updated successfully!')
      }
    },
    deleteTask: (state, action) => {
      const taskId = action.payload
      state.tasks = state.tasks.filter(t => t.id !== taskId)
      
      // Remove from parent's subtasks array
      state.tasks.forEach(task => {
        task.subtasks = task.subtasks.filter(id => id !== taskId)
      })
      
      toast.success('Task deleted successfully!')
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
  },
})

export const { setLoading, setError, addTask, updateTask, deleteTask, setFilters } = tasksSlice.actions
export default tasksSlice.reducer