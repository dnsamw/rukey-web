// // Hero slide types
// export interface HeroSlide {
//   id: string;
//   title: string;
//   description: string;
//   imageUrl: string;
//   link?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

export type HeroSlide = {
  id: string
  title: string
  subtitle: string
  image_url: string
  order: number
  is_active: boolean
}