import type { SiteSettingsData } from '@/lib/data/fetchers'

type Props = {
  theme: SiteSettingsData['theme']
}

export default function ThemeInjector({ theme }: Props) {
  const css = `
    :root {
      --color-primary:        ${theme.primary};
      --color-primary-dark:   ${theme.primary_dark};
      --color-secondary:      ${theme.secondary};
      --color-secondary-dark: ${theme.secondary_dark};
    }
  `.trim()

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}