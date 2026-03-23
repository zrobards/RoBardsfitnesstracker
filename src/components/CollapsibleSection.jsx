import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function CollapsibleSection({ title, icon: Icon, children, defaultOpen = false, badge }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-surface rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 active:bg-surface-light transition-colors"
      >
        <div className="flex items-center gap-2.5">
          {Icon && <Icon size={18} className="text-brand-light" />}
          <span className="text-white font-semibold text-sm">{title}</span>
          {badge && (
            <span className="bg-brand/20 text-brand-light text-[10px] font-bold px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {open ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}
