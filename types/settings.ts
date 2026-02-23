// // Site settings types
// export interface SiteSettings {
//   id: string;
//   logo: string;
//   primaryColor: string;
//   secondaryColor: string;
//   phone: string;
//   email: string;
//   address: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   createdAt: Date;
//   updatedAt: Date;
// }


export type SiteSettings = {
  logo_url: string
  company_name: string
  phone: string
  email: string
  addresses: string[]
  tagline: string
  abn?: string
}