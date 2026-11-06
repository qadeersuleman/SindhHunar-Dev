# Sindh Hunar Database Schema Reference

This file documents the verified Supabase table structures as of May 2026. Use this as a reference for database queries and service implementations.

## Tables

### 1. `profiles`
Stores user authentication and profile information.
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key (matches Auth UID) |
| `email` | text | User's email address |
| `name` | text | Full name of the user |
| `role` | text | User role (e.g., 'customer', 'artisan') |
| `phone` | text | Contact number |
| `created_at`| timestamp | Account creation date |

### 2. `artisans`
Stores shop details for sellers.
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key |
| `owner_id` | uuid | Foreign Key (profiles.id) |
| `shop_name` | text | Name of the artisan shop |
| `specialty` | ARRAY | Array of product specialties |
| `rating` | numeric | Average rating (0-5) |
| `is_active` | boolean | Shop status |
| *Note* | - | `logo_url`, `phone`, `address` are NOT in this table. |

### 3. `products`
Stores items listed for sale.
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key |
| `artisan_id` | uuid | Foreign Key (artisans.id) |
| `name` | text | Product name |
| `description`| text | Product details |
| `price` | numeric | Product price |
| `images` | ARRAY | Array of image URLs |
| `category` | text | Main category |
| `subcategory`| text | Sub-category |
| `is_available`| boolean | Stock status |
| `is_customizable`| boolean | If product can be customized |
| `rating` | numeric | Product rating |
| `materials` | ARRAY | Materials used |
| `production_time`| text | Estimated time to make |
| `stock_quantity`| integer | Available stock |

### 4. `orders`
Stores customer purchase records.
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key |
| `customer_id`| uuid | Foreign Key (profiles.id) |
| `artisan_id` | uuid | Foreign Key (artisans.id) |
| `items` | jsonb | Array of purchased product objects |
| `total_amount`| numeric | Final price including shipping |
| `status` | text | Order state (pending, confirmed, delivered, etc.) |
| `shipping_address`| jsonb | Customer address details |
| `phone` | text | Contact number for delivery |
| `notes` | text | Customer's additional instructions |

### 5. `payments`
Stores transaction records.
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key |
| `order_id` | uuid | Foreign Key (orders.id) |
| `customer_id`| uuid | Foreign Key (profiles.id) |
| `artisan_id` | uuid | Foreign Key (artisans.id) |
| `amount` | numeric | Paid amount |
| `payment_method`| text | cash, easy_paisa, jazz_cash, card |
| `payment_status`| text | pending, completed, failed |
| `transaction_id`| text | Reference for digital payments |
| `sender_name` | text | Name on the payment account |

---
*Verified via SQL Information Schema - May 01, 2026*
