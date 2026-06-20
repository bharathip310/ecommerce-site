import * as dotenv from 'dotenv';
dotenv.config();

import { db } from './index.ts';
import { categories, products } from './schema.ts';

const seedData = async () => {
  console.log('Seeding data...');

  try {
    await db.delete(products);
    await db.delete(categories);
    
    // Categories
    const categoryValues = [
      { name: 'Wearables', description: 'Smartwatches and fitness trackers' },
      { name: 'Audio', description: 'Headphones and earbuds' },
      { name: 'Computers', description: 'Laptops, tablets and desktops' },
      { name: 'Smartphones', description: 'Latest mobile devices' },
      { name: 'Gaming', description: 'Gaming consoles and accessories' },
      { name: 'Accessories', description: 'Tech apparel and peripherals' }
    ];

    const insertedCategories = await db.insert(categories).values(categoryValues).returning();
    console.log('Inserted categories', insertedCategories.length);

    // Products
    const productValues = [
      {
        name: 'Apple Watch Series 9',
        slug: 'apple-watch-series-9',
        description: 'Advanced health features, temperature sensing, and crash detection in a seamless design.',
        price: '399.00',
        categoryId: insertedCategories[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&q=80&w=800',
        rating: '4.9',
        featured: true,
        stock: 50,
      },
      {
        name: 'Samsung Galaxy Watch 6',
        slug: 'samsung-galaxy-watch-6',
        description: 'Comprehensive sleep tracking and personalized heart rate zones.',
        price: '299.00',
        categoryId: insertedCategories[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800',
        rating: '4.7',
        featured: false,
        stock: 30,
      },
      {
        name: 'Garmin Fenix 7 Pro',
        slug: 'garmin-fenix-7-pro',
        description: 'Ultimate multisport GPS smartwatch with solar charging capabilities.',
        price: '799.00',
        categoryId: insertedCategories[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800',
        rating: '4.8',
        featured: false,
        stock: 15,
      },
      {
        name: 'Sony WH-1000XM5',
        slug: 'sony-wh-1000xm5',
        description: 'Industry-leading noise cancellation and exceptional audio quality.',
        price: '398.00',
        categoryId: insertedCategories[1].id,
        imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800',
        rating: '4.8',
        featured: true,
        stock: 40,
      },
      {
        name: 'Apple AirPods Max',
        slug: 'apple-airpods-max',
        description: 'High-fidelity audio with active noise cancellation and spatial audio.',
        price: '549.00',
        categoryId: insertedCategories[1].id,
        imageUrl: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&q=80&w=800',
        rating: '4.9',
        featured: true,
        stock: 25,
      },
      {
        name: 'Bose QuietComfort Earbuds II',
        slug: 'bose-quietcomfort-earbuds-ii',
        description: 'Pioneering custom-tuned sound and noise cancellation.',
        price: '299.00',
        categoryId: insertedCategories[1].id,
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
        rating: '4.7',
        featured: false,
        stock: 60,
      },
      {
        name: 'Marshall Stanmore II',
        slug: 'marshall-stanmore-ii',
        description: 'Classic Marshall design with modern Bluetooth 5.0 connectivity.',
        price: '349.00',
        categoryId: insertedCategories[1].id,
        imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&q=80&w=800',
        rating: '4.8',
        featured: false,
        stock: 20,
      },
      {
        name: 'MacBook Pro 16-inch',
        slug: 'macbook-pro-16',
        description: 'M3 Max chip, stunning Liquid Retina XDR display, up to 22 hours of battery life.',
        price: '2499.00',
        categoryId: insertedCategories[2].id,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
        rating: '5.0',
        featured: true,
        stock: 12,
      },
      {
        name: 'Dell XPS 15',
        slug: 'dell-xps-15',
        description: 'Powerful performance inside a masterfully crafted, lightweight design.',
        price: '1899.00',
        categoryId: insertedCategories[2].id,
        imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
        rating: '4.7',
        featured: false,
        stock: 18,
      },
      {
        name: 'iPad Pro 12.9-inch',
        slug: 'ipad-pro-12-9',
        description: 'The ultimate iPad experience with M2 performance.',
        price: '1099.00',
        categoryId: insertedCategories[2].id,
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
        rating: '4.9',
        featured: false,
        stock: 35,
      },
      {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'Forged in titanium. Featuring the A17 Pro chip and customizable Action button.',
        price: '999.00',
        categoryId: insertedCategories[3].id,
        imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800',
        rating: '4.9',
        featured: true,
        stock: 45,
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Titanium exterior, AI-powered features, and a built-in S Pen.',
        price: '1299.00',
        categoryId: insertedCategories[3].id,
        imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800',
        rating: '4.8',
        featured: false,
        stock: 30,
      },
      {
        name: 'Google Pixel 8 Pro',
        slug: 'google-pixel-8-pro',
        description: 'The all-pro phone engineered by Google with best-in-class AI.',
        price: '999.00',
        categoryId: insertedCategories[3].id,
        imageUrl: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80&w=800',
        rating: '4.7',
        featured: false,
        stock: 40,
      },
      {
        name: 'PlayStation 5',
        slug: 'playstation-5',
        description: 'Experience lightning-fast loading, deeper immersion, and an all-new generation of games.',
        price: '499.00',
        categoryId: insertedCategories[4].id,
        imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=800',
        rating: '4.9',
        featured: true,
        stock: 10,
      },
      {
        name: 'Xbox Series X',
        slug: 'xbox-series-x',
        description: 'The fastest, most powerful Xbox ever. True 4K gaming.',
        price: '499.00',
        categoryId: insertedCategories[4].id,
        imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&q=80&w=800',
        rating: '4.8',
        featured: false,
        stock: 15,
      },
      {
        name: 'Nintendo Switch OLED',
        slug: 'nintendo-switch-oled',
        description: 'Play at home on the TV or on-the-go with a vibrant 7-inch OLED screen.',
        price: '349.00',
        categoryId: insertedCategories[4].id,
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
        rating: '4.7',
        featured: false,
        stock: 25,
      },
      {
        name: 'Premium Leather Tech Folio',
        slug: 'leather-tech-folio',
        description: 'Handcrafted full-grain leather to carry your essentials in style.',
        price: '129.00',
        categoryId: insertedCategories[5].id,
        imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
        rating: '4.9',
        featured: false,
        stock: 60,
      },
      {
        name: 'Logitech MX Master 3S',
        slug: 'logitech-mx-master-3s',
        description: 'Advanced wireless mouse with 8K DPI any-surface tracking and quiet clicks.',
        price: '99.00',
        categoryId: insertedCategories[5].id,
        imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800',
        rating: '4.8',
        featured: true,
        stock: 45,
      },
      {
        name: 'Keychron K2 Mechanical',
        slug: 'keychron-k2',
        description: 'A super tactile wireless mechanical keyboard with Mac layout.',
        price: '89.00',
        categoryId: insertedCategories[5].id,
        imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800',
        rating: '4.7',
        featured: false,
        stock: 35,
      },
      {
        name: 'Sony Mirrorless a7 IV',
        slug: 'sony-a7-iv',
        description: 'The definitive hybrid camera with breathtaking full-frame image quality.',
        price: '2499.00',
        categoryId: insertedCategories[5].id,
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
        rating: '5.0',
        featured: true,
        stock: 8,
      }
    ];

    await db.insert(products).values(productValues);
    console.log('Inserted products');

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    process.exit(0);
  }
};

seedData();
