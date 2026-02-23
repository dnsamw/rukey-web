// // Service types
// export interface Service {
//   id: string;
//   title: string;
//   description: string;
//   longDescription: string;
//   price: number;
//   duration: string;
//   imageUrl: string;
//   slug: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

export type Service = {
  id: string
  name: string
  slug: string
  short_description: string
  description: string
  icon_url?: string
  image_url: string
  is_active: boolean
  order: number
}