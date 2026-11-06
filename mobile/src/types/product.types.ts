export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  image_url?: string;
  images?: string[];
  category: string;

  description?: string;
  artisan?: string;
  artisanId?: string;
  artisan_id?: string;
  artisan_name?: string;
  inStock?: boolean;

  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  location: string;
  specialty: string;
  rating?: number;
  productsCount?: number;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  productCount?: number;
}
