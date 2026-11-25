export type Category = 'SPORTS' | 'RUNNING' | 'CYCLING' | 'WEDDING' | 'GRADUATION' | 'CORPORATE' | 'OTHER';

export interface Photographer {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  instagram?: string;
  website?: string;
  rating: number;
  totalSales: number;
}

export interface Photo {
  id: string;
  eventId: string;
  url: string;
  highResUrl: string;
  dorsal?: string; // Bib number
  capturedAt: string; // ISO string or HH:mm
  faceIds?: string[];
  price: number; // in ARS / local
  width: number;
  height: number;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: Category;
  date: string;
  location: string;
  coverImage: string;
  photographer: Photographer;
  photoCount: number;
  pricePerPhoto: number;
  fullAlbumPrice: number;
  fullAlbumDiscountPercent: number;
  tags: string[];
}

export interface CartItem {
  photo: Photo;
  event: Pick<EventItem, 'id' | 'title' | 'slug' | 'pricePerPhoto'>;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'mercadopago' | 'stripe';
  status: 'completed' | 'pending';
  createdAt: string;
}
