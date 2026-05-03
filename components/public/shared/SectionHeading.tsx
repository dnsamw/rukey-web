type Props = {
  label?: string       // Small uppercase label above
  title: string
  subtitle?: string
  centered?: boolean
}

export default function SectionHeading({
  label,
  title,
  subtitle,
  centered = true,
}: Props) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      {label && (
        <span className="inline-block text-[var(--color-primary)] font-semibold text-sm uppercase tracking-widest mb-2">
          {label}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)] leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-base leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={`mt-4 h-1 w-16 bg-[var(--color-primary)] rounded-full ${centered ? 'mx-auto' : ''}`} />
    </div>
  )
}