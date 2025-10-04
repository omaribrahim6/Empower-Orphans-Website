'use client'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-brand font-semibold text-sm
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eo-sky
                ${
                  isActive
                    ? 'border-eo-teal text-eo-teal'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.icon && (
                <span
                  className={`mr-2 ${isActive ? 'text-eo-teal' : 'text-gray-400 group-hover:text-gray-500'}`}
                >
                  {tab.icon}
                </span>
              )}
              {tab.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

