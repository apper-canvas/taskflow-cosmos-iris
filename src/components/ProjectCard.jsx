import { Link } from 'react-router-dom'
import { Calendar, Users, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default:
        return 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-300'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600'
      case 'high':
        return 'text-orange-600'
      case 'medium':
        return 'text-blue-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-surface-600'
    }
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-soft border border-surface-200 dark:border-surface-700 relative overflow-hidden"
    >
      {/* Color Bar */}
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: project.color }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link
            to={`/projects/${project.id}`}
            className="text-lg font-semibold text-surface-900 dark:text-surface-100 hover:text-primary transition-colors line-clamp-1"
          >
            {project.title}
          </Link>
          <p className="text-surface-600 dark:text-surface-400 text-sm mt-1 line-clamp-2">
            {project.description}
          </p>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white dark:bg-surface-700 rounded-lg shadow-lg border border-surface-200 dark:border-surface-600 py-1 z-10 min-w-[120px]">
              <button
                onClick={() => {
                  onEdit()
                  setShowMenu(false)
                }}
                className="flex items-center px-3 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-600 w-full text-left"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete()
                  setShowMenu(false)
                }}
                className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status and Priority */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
        <span className={`text-xs font-medium ${getPriorityColor(project.priority)}`}>
          {project.priority} priority
        </span>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-surface-600 dark:text-surface-400">Progress</span>
          <span className="font-medium text-surface-900 dark:text-surface-100">
            {project.progress}%
          </span>
        </div>
        <div className="w-full bg-surface-200 dark:bg-surface-600 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-2 rounded-full bg-gradient-to-r from-primary to-primary-light"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-surface-500 dark:text-surface-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(project.endDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {project.teamMembers.length}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard