import express from 'express';
import helmet from 'helmet';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { requireAuth } from './src/middleware/auth.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { db } from './src/db/index.ts';
import { users, products, orders, orderItems, reviews } from './src/db/schema.ts';
import { eq } from 'drizzle-orm';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/auth/sync', requireAuth as any, async (req: any, res: any): Promise<any> => {
    try {
      const { email, name, uid } = req.user;
      const user = await getOrCreateUser(uid, email || '', name || 'User');
      res.json(user);
    } catch (error: any) {
      console.error('Error syncing user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/products', async (req, res) => {
    try {
      const allProducts = await db.select().from(products);
      res.json(allProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/products/:slug', async (req, res) => {
    try {
      const product = await db.select().from(products).where(eq(products.slug, req.params.slug)).limit(1);
      if (product.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product[0]);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const { items, totalAmount, shippingAddress, paymentMethod, uid, email, name } = req.body;

      let authUid = uid || 'guest-uid';
      let userId: string;
      
      const existingUser = await db.select().from(users).where(eq(users.uid, authUid));
      
      if (existingUser.length === 0) {
        const newUser = await db.insert(users).values({
          uid: authUid,
          name: name || 'Guest User',
          email: email || 'guest@example.com'
        }).returning({ id: users.id });
        userId = newUser[0].id;
      } else {
        userId = existingUser[0].id;
      }

      const newOrder = await db.insert(orders).values({
        userId,
        totalAmount: totalAmount.toString(),
        paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'processing',
        shippingAddress
      }).returning();

      for (const item of items) {
        await db.insert(orderItems).values({
          orderId: newOrder[0].id,
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        });
      }

      res.json(newOrder[0]);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/users/:uid/orders', async (req, res) => {
    try {
      const uid = req.params.uid;
      const userResult = await db.select().from(users).where(eq(users.uid, uid));
      if (userResult.length === 0) return res.json([]);

      const userOrders = await db.select().from(orders).where(eq(orders.userId, userResult[0].id));
      res.json(userOrders);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // --- ADMIN APIs for Product & Order Management ---
  app.post('/api/admin/products', async (req, res) => {
    try {
      const { name, slug, description, price, stock, categoryId, imageUrl } = req.body;
      const result = await db.insert(products).values({
        name,
        slug,
        description,
        price: price.toString(),
        stock: parseInt(stock) || 0,
        categoryId: categoryId || null,
        imageUrl
      }).returning();
      res.status(201).json(result[0]);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/admin/products/:id', async (req, res) => {
    try {
      const { name, slug, description, price, stock, imageUrl } = req.body;
      const result = await db.update(products).set({
        name,
        slug,
        description,
        price: price ? price.toString() : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        imageUrl
      }).where(eq(products.id, req.params.id)).returning();
      
      if (result.length === 0) return res.status(404).json({ error: 'Product not found' });
      res.json(result[0]);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/admin/products/:id', async (req, res) => {
    try {
      const result = await db.delete(products).where(eq(products.id, req.params.id)).returning();
      if (result.length === 0) return res.status(404).json({ error: 'Product not found' });
      res.json({ success: true, deletedProduct: result[0] });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/admin/dashboard', async (req, res) => {
    try {
      const allOrders = await db.select().from(orders);
      const allUsers = await db.select().from(users);
      
      const totalRevenue = allOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount || '0'), 0);
      const totalOrders = allOrders.length;
      const activeUsers = allUsers.length;
      
      // Recent orders descending
      const recentOrders = allOrders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6)
        .map(o => ({
          id: `ORD-${o.id.substring(0, 8)}`,
          status: o.orderStatus,
          amount: `₹${parseFloat(o.totalAmount || '0').toFixed(2)}`,
          time: new Date(o.createdAt).toLocaleString(),
          paymentStatus: o.paymentStatus
        }));

      // Conversion rate mock or calculated (mocked for simplicity here):
      const conversionRate = 4.35;

      res.json({
        totalRevenue: `₹${totalRevenue.toFixed(2)}`,
        totalOrders,
        activeUsers,
        conversionRate: `${conversionRate}%`,
        recentOrders
      });
    } catch (error) {
      console.error('Error fetching admin dashboard stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/admin/customers', async (req, res) => {
    try {
      const allUsers = await db.select().from(users);
      const allOrders = await db.select().from(orders);

      const customersWithStats = allUsers.map(user => {
        const userOrders = allOrders.filter(o => o.userId === user.id);
        const totalOrders = userOrders.length;
        const totalSpent = userOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount || '0'), 0);
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          location: 'Unknown', 
          orders: totalOrders,
          spent: `₹${totalSpent.toFixed(2)}`,
          color: 'bg-blue-100 text-blue-600'
        };
      });

      res.json(customersWithStats);
    } catch (error) {
      console.error('Error fetching admin customers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/admin/orders', async (req, res) => {
    try {
      const allOrders = await db.select({
        order: orders,
        user: { name: users.name, email: users.email }
      }).from(orders).leftJoin(users, eq(orders.userId, users.id));
      res.json(allOrders.map(row => ({
        ...row.order,
        customerName: row.user?.name,
        customerEmail: row.user?.email
      })));
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/admin/orders/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      const result = await db.update(orders).set({ orderStatus: status }).where(eq(orders.id, req.params.id)).returning();
      if (result.length === 0) return res.status(404).json({ error: 'Order not found' });
      res.json(result[0]);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/products/:id/reviews', async (req, res) => {
    try {
      const productReviews = await db.select({
        review: reviews,
        user: { name: users.name, avatar: users.avatar }
      }).from(reviews)
        .leftJoin(users, eq(reviews.userId, users.id))
        .where(eq(reviews.productId, req.params.id));
        
      res.json(productReviews.map(r => ({
        ...r.review,
        userName: r.user?.name,
        userAvatar: r.user?.avatar
      })));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/products/:id/reviews', async (req, res) => {
    try {
      const { rating, comment, uid, email, name } = req.body;
      const productId = req.params.id;

      // Ensure user exists or create
      let authUid = uid || 'guest-uid';
      let userId: string;
      
      const existingUser = await db.select().from(users).where(eq(users.uid, authUid));
      
      if (existingUser.length === 0) {
        const newUser = await db.insert(users).values({
          uid: authUid,
          name: name || 'Guest User',
          email: email || 'guest@example.com'
        }).returning({ id: users.id });
        userId = newUser[0].id;
      } else {
        userId = existingUser[0].id;
      }

      const newReview = await db.insert(reviews).values({
        productId,
        userId,
        rating: parseInt(rating) || 5,
        comment
      }).returning();

      // Recalculate average rating for product
      const productReviewsList = await db.select().from(reviews).where(eq(reviews.productId, productId));
      const avgRating = productReviewsList.reduce((sum, r) => sum + r.rating, 0) / productReviewsList.length;
      
      await db.update(products).set({ rating: avgRating.toFixed(1) }).where(eq(products.id, productId));

      res.status(201).json(newReview[0]);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
