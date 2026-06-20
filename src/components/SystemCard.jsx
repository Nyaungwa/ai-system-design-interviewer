export default function SystemCard({ title, icon: Icon, color, iconBg, description, onClick, selected }) {
  return (
    <button
      onClick={onClick}
      className={`card p-5 text-left hover:border-brand-blue transition-all duration-200 group w-full ${selected ? 'border-brand-blue' : ''}`}
      style={selected ? { backgroundColor: 'var(--bg-raised)' } : undefined}
    >
      <div className="text-3xl mb-3">
        {iconBg ? (
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg"
            style={{ background: iconBg, opacity: selected ? 1 : 0.85 }}
          >
            <Icon style={{ color, fontSize: 20 }} />
          </span>
        ) : (
          <span
            className="inline-block group-hover:opacity-100"
            style={{ color, opacity: selected ? 1 : 0.65 }}
          >
            <Icon />
          </span>
        )}
      </div>
      <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      {description && (
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>
      )}
    </button>
  )
}
