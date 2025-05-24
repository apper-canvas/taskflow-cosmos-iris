import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { useDrop } from 'react-dnd'
import { Home, FolderOpen, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { moveTaskToProject } from '../store/slices/tasksSlice'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dispatch = useDispatch()
  const location = useLocation()
  const projects = useSelector(state => state.projects.projects)

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
  ]

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  const ProjectDropZone = ({ project, children }) => {
    const [{ isOver, canDrop }, drop] = useDrop({
      accept: 'TASK',
      drop: (item) => {
        dispatch(moveTaskToProject({ taskId: item.id, projectId: project.id }))
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    })

    return (
      <div
        ref={drop}
        className={`drop-zone ${canDrop ? 'can-drop' : ''} ${isOver ? 'is-over' : ''}`}
      >
        {children}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Mobile sidebar backdrop */}
            
            if (item.name === 'Projects') {
              return (
                <div key={item.name} className="space-y-1">
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                  
                  {/* Project drop zones */}
                  <div className="ml-4 space-y-1">
                    {projects.map((project) => (
                      <ProjectDropZone key={project.id} project={project}>
                        <Link
                          to={`/projects/${project.id}`}
                          className="flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-surface-200"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                          {project.name}
                        </Link>
                      </ProjectDropZone>
                    ))}
                  </div>
                </div>
              )
            }
            
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-800 shadow-xl lg:relative lg:translate-x-0 lg:shadow-none"
      >
        <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
          <h1 className="text-xl font-bold text-primary">TaskFlow</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-surface-800 shadow-sm border-b border-surface-200 dark:border-surface-700 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-4"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout