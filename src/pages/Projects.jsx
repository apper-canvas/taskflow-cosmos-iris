import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, Grid, List, Calendar, Users, MoreVertical } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import ProjectCard from '../components/ProjectCard'
import ProjectForm from '../components/ProjectForm'
import { deleteProject } from '../store/slices/projectsSlice'

const Projects = () => {
  const dispatch = useDispatch()
  const { projects } = useSelector((state) => state.projects)
  const [viewMode, setViewMode] = useState('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      dispatch(deleteProject(projectId))
    }
  }

  const handleEditProject = (project) => {
    setEditingProject(project)
    setShowProjectForm(true)
  }

  const handleCloseForm = () => {
    setShowProjectForm(false)
    setEditingProject(null)
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-100">
              Projects
            </h1>
            <p className="text-surface-600 dark:text-surface-400 mt-2">
              Manage and track your project progress
            </p>
          </div>
          <button
            onClick={() => setShowProjectForm(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-soft border border-surface-200 dark:border-surface-700">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-surface-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 p-1 bg-surface-100 dark:bg-surface-700 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-surface-600 shadow-sm'
                    : 'hover:bg-surface-200 dark:hover:bg-surface-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-surface-600 shadow-sm'
                    : 'hover:bg-surface-200 dark:hover:bg-surface-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }`}>
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {viewMode === 'grid' ? (
                  <ProjectCard
                    project={project}
                    onEdit={() => handleEditProject(project)}
                    onDelete={() => handleDeleteProject(project.id)}
                  />
                ) : (
                  <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-soft border border-surface-200 dark:border-surface-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <Link
                              to={`/projects/${project.id}`}
                              className="text-lg font-semibold text-surface-900 dark:text-surface-100 hover:text-primary"
                            >
                              {project.title}
                            </Link>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              project.status === 'active' ? 'bg-green-100 text-green-800' :
                              project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                          <p className="text-surface-600 dark:text-surface-400 mt-1">
                            {project.description}
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-surface-500 dark:text-surface-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Due {new Date(project.endDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {project.teamMembers.length} members
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-surface-900 dark:text-surface-100">
                            {project.progress}%
                          </div>
                          <div className="w-32 bg-surface-200 dark:bg-surface-600 rounded-full h-2 mt-1">
                            <div
                              className="h-2 rounded-full bg-primary"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                        <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-surface-400 dark:text-surface-500 mb-4">
              <FolderOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">
              No projects found
            </h3>
            <p className="text-surface-600 dark:text-surface-400">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first project'}
            </p>
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      <AnimatePresence>
        {showProjectForm && (
          <ProjectForm
            project={editingProject}
            onClose={handleCloseForm}
          />
        )}
      </AnimatePresence>
    </Layout>
  )
}

export default Projects