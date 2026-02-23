import {
  Building2, GraduationCap, Heart, Dumbbell,
  Landmark, ShoppingBag, Factory, Wind,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Building2,
  GraduationCap,
  Heart,
  Dumbbell,
  Landmark,
  ShoppingBag,
  Factory,
  Wind,
}

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Building2
}