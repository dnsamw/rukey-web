type Props = {
  title: string
  subtitle: string
  action?: React.ReactNode
}

export default function PageHeader({ title, subtitle, action }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-secondary)]">{title}</h1>
        <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}