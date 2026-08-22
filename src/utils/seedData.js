import dns from 'node:dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dns.setServers(['8.8.8.8', '1.1.1.1']);
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Transaction from '../models/Transaction.js';
import InventoryLog from '../models/InventoryLog.js';
import Notification from '../models/Notification.js';
import Coupon from '../models/Coupon.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecom-suite');
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    await Transaction.deleteMany();
    await InventoryLog.deleteMany();
    await Notification.deleteMany();
    await Coupon.deleteMany();

    console.log('Database cleared.');

    // 1. Create Admin & Customer Users
    const admin = await User.create({
      name: 'POD Admin',
      email: 'admin@podecom.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });

    const customer = await User.create({
      name: 'Rohan Sharma',
      email: 'customer@podecom.com',
      password: 'customer123',
      role: 'customer',
      isActive: true,
      addresses: [
        {
          title: 'Home Address',
          street: 'Flat 102, Green Valley Apartments',
          city: 'New Delhi',
          state: 'Delhi',
          zipCode: '110001',
          country: 'India',
          isDefault: true
        }
      ]
    });

    console.log('Users seeded.');

    // 2. Create Categories
    const jackets = await Category.create({ name: 'Outerwear & Jackets', slug: 'outerwear-jackets', description: 'Stylish leather, denim, and knitted jackets' });
    const tops = await Category.create({ name: 'Shirts & Tops', slug: 'shirts-tops', description: 'Premium cotton t-shirts, casual & botanical printed shirts' });
    const dresses = await Category.create({ name: 'Dresses & Bottoms', slug: 'dresses-bottoms', description: 'Designer dresses, shorts, and tailored bottoms' });
    const homeAccess = await Category.create({ name: 'Home & Accessories', slug: 'home-accessories', description: 'Luxury rugs, poufs, watches, and home accents' });

    console.log('Categories seeded.');

    // 3. Create Apparel & Lifestyle Products matching StoreData
    const productsData = [
      {
        name: 'Cropped Faux Leather Jacket',
        description: 'A sleek and edgy cropped faux leather jacket with asymmetrical zip closure, notched lapels, and premium tailored fit.',
        price: 29,
        salePrice: 25,
        sku: 'POD-JCK-001',
        inventory: 45,
        category: jackets._id,
        isFeatured: true,
        salesCount: 8200,
        rating: 4.9,
        numReviews: 8000,
        mainImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
          'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800'
        ],
        attributes: [
          { key: 'Material', value: 'Faux Leather' },
          { key: 'Fit', value: 'Cropped Fit' }
        ]
      },
      {
        name: 'Calvin Shorts',
        description: 'Comfortable relaxed-fit casual shorts crafted from breathable cotton blend with elasticated waistband.',
        price: 62,
        salePrice: 55,
        sku: 'POD-SHR-002',
        inventory: 60,
        category: dresses._id,
        isFeatured: true,
        salesCount: 2100,
        rating: 4.7,
        numReviews: 2000,
        mainImage: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800',
        images: [
          'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800'
        ],
        attributes: [
          { key: 'Material', value: 'Cotton Blend' },
          { key: 'Pattern', value: 'Solid' }
        ]
      },
      {
        name: 'Shirt In Botanical Cheetah Print',
        description: 'Vibrant button-down long sleeve shirt featuring custom botanical cheetah artwork printed on silky lightweight fabric.',
        price: 60,
        salePrice: 49,
        sku: 'POD-SHT-003',
        inventory: 35,
        category: tops._id,
        isFeatured: true,
        salesCount: 7400,
        rating: 4.8,
        numReviews: 7000,
        mainImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
        images: [
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'
        ],
        attributes: [
          { key: 'Material', value: 'Viscose Silk' },
          { key: 'Print', value: 'Botanical Cheetah' }
        ]
      },
      {
        name: 'Cotton Jersey T-Shirt',
        description: 'Essential everyday crew-neck t-shirt made with 100% organic combed jersey cotton for soft all-day comfort.',
        price: 17,
        salePrice: 15,
        sku: 'POD-TSH-004',
        inventory: 100,
        category: tops._id,
        isFeatured: true,
        salesCount: 5200,
        rating: 4.6,
        numReviews: 5000,
        mainImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
        images: [
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'
        ],
        attributes: [
          { key: 'Material', value: '100% Organic Cotton' }
        ]
      },
      {
        name: 'Cableknit Shawl',
        description: 'Warm and cozy chunky cable-knit shawl designed to drape comfortably around the shoulders.',
        price: 100,
        salePrice: 89,
        sku: 'POD-SHL-005',
        inventory: 30,
        category: jackets._id,
        isFeatured: false,
        salesCount: 9100,
        rating: 4.9,
        numReviews: 9000,
        mainImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800'
        ],
        attributes: [
          { key: 'Material', value: 'Wool Blend' }
        ]
      },
      {
        name: 'Colorful Jacket',
        description: 'Statement streetwear outerwear jacket with bold multi-color paneling and zip-up hooded collar.',
        price: 69,
        salePrice: 59,
        sku: 'POD-JCK-006',
        inventory: 25,
        category: jackets._id,
        isFeatured: true,
        salesCount: 1400,
        rating: 4.7,
        numReviews: 1000,
        mainImage: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800',
        images: [
          'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800'
        ],
        attributes: [
          { key: 'Style', value: 'Colorblock Streetwear' }
        ]
      },
      {
        name: 'Zessi Dresses',
        description: 'Elegant maxi dress featuring delicate waist pleats, side slit, and flowing silhouette perfect for special occasions.',
        price: 99,
        salePrice: 85,
        sku: 'POD-DRS-007',
        inventory: 40,
        category: dresses._id,
        isFeatured: true,
        salesCount: 3300,
        rating: 4.8,
        numReviews: 3000,
        mainImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
        images: [
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800'
        ],
        attributes: [
          { key: 'Length', value: 'Maxi' }
        ]
      },
      {
        name: 'Kirby T-Shirt',
        description: 'Graphic print oversized streetwear tee featuring custom vintage graphic on heavyweight cotton knit.',
        price: 37,
        salePrice: 32,
        sku: 'POD-TSH-008',
        inventory: 75,
        category: tops._id,
        isFeatured: false,
        salesCount: 4200,
        rating: 4.7,
        numReviews: 4000,
        mainImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
        images: [
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'
        ],
        attributes: [
          { key: 'Fit', value: 'Oversized' }
        ]
      },
      {
        name: 'Hosking Blue Area Rug',
        description: 'Hand-woven plush wool area rug with geometric tribal patterns in ocean blue tones.',
        price: 29,
        salePrice: 25,
        sku: 'POD-HOM-009',
        inventory: 20,
        category: homeAccess._id,
        isFeatured: false,
        salesCount: 8100,
        rating: 4.9,
        numReviews: 8000,
        mainImage: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800',
        images: [
          'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800'
        ],
        attributes: [
          { key: 'Dimensions', value: '5x7 Feet' }
        ]
      },
      {
        name: 'Hanneman Pouf',
        description: 'Modern bohemian knitted floor ottoman pouf crafted with textured cotton cords.',
        price: 92,
        salePrice: 79,
        sku: 'POD-HOM-010',
        inventory: 18,
        category: homeAccess._id,
        isFeatured: false,
        salesCount: 5100,
        rating: 4.6,
        numReviews: 5000,
        mainImage: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800',
        images: [
          'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800'
        ],
        attributes: [
          { key: 'Type', value: 'Ottoman Pouf' }
        ]
      },
      {
        name: 'Cushion Futon Slipcover',
        description: 'Stretch fabric sofa and futon slipcover designed to protect and renew home furniture.',
        price: 25,
        salePrice: 22,
        sku: 'POD-HOM-011',
        inventory: 50,
        category: homeAccess._id,
        isFeatured: false,
        salesCount: 1100,
        rating: 4.5,
        numReviews: 1000,
        mainImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'
        ],
        attributes: [
          { key: 'Wash Care', value: 'Machine Washable' }
        ]
      },
      {
        name: 'Hub Accent Mirror',
        description: 'Contemporary circular wall mirror with rubber rim casing for minimalist living spaces.',
        price: 27,
        salePrice: 24,
        sku: 'POD-HOM-012',
        inventory: 30,
        category: homeAccess._id,
        isFeatured: false,
        salesCount: 7100,
        rating: 4.8,
        numReviews: 7000,
        mainImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
        images: [
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800'
        ],
        attributes: [
          { key: 'Frame Material', value: 'Black Rubber' }
        ]
      },
      {
        name: 'Bold Male Black Analog Watch',
        description: 'Water-resistant stainless steel matte black mens watch with quartz movement and date display.',
        price: 39,
        salePrice: 35,
        sku: 'POD-HOM-013',
        inventory: 40,
        category: homeAccess._id,
        isFeatured: true,
        salesCount: 71,
        rating: 4.9,
        numReviews: 71,
        mainImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
        ],
        attributes: [
          { key: 'Movement', value: 'Japanese Quartz' }
        ]
      }
    ];

    const seededProducts = await Product.create(productsData);
    console.log(`${seededProducts.length} apparel products seeded.`);

    // 4. Create Inventory Logs
    for (const prod of seededProducts) {
      await InventoryLog.create({
        product: prod._id,
        change: prod.inventory,
        type: 'stock_in',
        notes: 'Initial seed stock'
      });
    }

    // 5. Seed Coupons
    await Coupon.create([
      { code: 'POD50', discountType: 'percentage', discountValue: 50, minOrderAmount: 200, expiryDate: new Date('2028-12-31') },
      { code: 'FLAT10', discountType: 'flat', discountValue: 10, minOrderAmount: 30, expiryDate: new Date('2028-12-31') }
    ]);
    console.log('Coupons seeded.');

    console.log('Seeding process complete! Closing DB connection.');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Seeding process error:', error);
    process.exit(1);
  }
};

seedDB();
