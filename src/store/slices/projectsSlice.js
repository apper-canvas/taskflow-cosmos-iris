import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
  projects: [
    {
      id: '1',
      title: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design',
      status: 'active',
      priority: 'high',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      progress: 65,
      color: '#6366f1',
      teamMembers: ['John Doe', 'Jane Smith'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Mobile App Development',
      description: 'Native mobile application for iOS and Android platforms',
      status: 'active',
      priority: 'urgent',
      startDate: '2024-02-01',
      endDate: '2024-06-01',
      progress: 30,
      color: '#8b5cf6',
      teamMembers: ['Mike Johnson', 'Sarah Wilson'],
      createdAt: new Date().toISOString(),
    },
  ],
  loading: false,
  error: null,
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    addProject: (state, action) => {
      const newProject = {
        ...action.payload,
        id: Date.now().toString(),
        progress: 0,
        createdAt: new Date().toISOString(),
      }
      state.projects.push(newProject)
      toast.success('Project created successfully!')
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...action.payload }
        toast.success('Project updated successfully!')
      }
    },
    deleteProject: (state, action) => {
      state.projects = state.projects.filter(p => p.id !== action.payload)
      toast.success('Project deleted successfully!')
    },
    updateProjectProgress: (state, action) => {
      const { projectId, progress } = action.payload
      const project = state.projects.find(p => p.id === projectId)
      if (project) {
        project.progress = progress
      }
    },
    setProjects: (state, action) => {
      state.projects = action.payload
    },
  },
})

export const {
  setLoading,
  setError,
  addProject,
  updateProject,
  deleteProject,
  updateProjectProgress,
  setProjects,
} = projectsSlice.actions

export default projectsSlice.reducer