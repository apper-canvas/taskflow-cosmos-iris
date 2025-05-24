import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ArrowLeft, Edit, Trash2, Plus, Users, Calendar, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import ProjectProgress from '../components/ProjectProgress'
import TaskHierarchy from '../components/TaskHierarchy'
import ProjectStats from '../components/ProjectStats'

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { projects } = useSelector((state) => state.projects)
  const { tasks } = useSelector((state) => state.tasks)
  
  const project = projects.find(p => p.id === id)
  const projectTasks = tasks.filter(t => t.projectId === id)
  
  const [activeTab, setActiveTab] = useState('overview')

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-4">
            Project not found
          </h2>
          <button
            onClick={() => navigate('/projects')}
            className="text-primary hover:text-primary-dark"
          >
            Return to projects
          </button>
        </div>
      </Layout>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'progress', label: 'Progress' },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/projects')}
              className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-100">
                {project.title}
              </h1>
              <p className="text-surface-600 dark:text-surface-400 mt-1">
                {project.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center px-4 py-2 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>

        {/* Project Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-soft border border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Progress</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                  {project.progress}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-soft border border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Team Members</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                  {project.teamMembers.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-soft border border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Due Date</p>
                <p className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  {new Date(project.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-soft border border-surface-200 dark:border-surface-700">
          <div className="border-b border-surface-200 dark:border-surface-700">
            <div className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-6">
            {activeTab === 'overview' && (
              <ProjectStats project={project} tasks={projectTasks} />
            )}
            {activeTab === 'tasks' && (
              <TaskHierarchy projectId={id} tasks={projectTasks} />
            )}
            {activeTab === 'progress' && (
              <ProjectProgress project={project} tasks={projectTasks} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProjectDetail