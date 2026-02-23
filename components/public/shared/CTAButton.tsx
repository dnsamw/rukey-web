import Link from 'next/link'

type Props = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'outline'
  className?: string
}

export default function CTAButton({
  href,
  children,
  variant = 'primary',
  className = '',
}: Props) {
  const base = 'inline-block px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200'
  const styles = {
    primary: 'bg-[#F97316] text-white hover:bg-[#EA6C0A] shadow-md hover:shadow-lg',
    outline: 'border-2 border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white',
  }

  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </Link>
  )
}
