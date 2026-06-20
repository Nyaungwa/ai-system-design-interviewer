export default function SystemCard({ title, icon: Icon, description, onClick, selected }) {
  return (
    <button
      onClick={onClick}
      className={`card p-5 text-left hover:border-brand-orange transition-all duration-200 group w-full
        ${selected ? 'border-brand-orange bg-navy-700' : 'hover:bg-navy-700'}`}
    >
      <div className={`text-3xl mb-3 transition-colors ${selected ? 'text-brand-orange' : 'text-white/50 group-hover:text-brand-orange'}`}>
        <Icon />
      </div>
      <h3 className="font-semibold text-white text-sm mb-1">{title}</h3>
      {description && (
        <p className="text-white/40 text-xs leading-relaxed">{description}</p>
      )}
    </button>
  )
}
