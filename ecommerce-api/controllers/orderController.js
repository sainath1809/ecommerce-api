const db = require('../config/db');

// ✅ Place Order
exports.placeOrder = (req, res) => {
  const userId = req.user.id;

  const getCartItems = `
    SELECT cart.product_id, cart.quantity, products.price
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;

  db.all(getCartItems, [userId], (err, items) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const insertOrder = `INSERT INTO orders (user_id, total) VALUES (?, ?)`;

    db.run(insertOrder, [userId, total], function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const orderId = this.lastID;

      // ✅ Clear the cart
      db.run(`DELETE FROM cart WHERE user_id = ?`, [userId], (err) => {
        if (err) console.error('Failed to clear cart:', err.message);
        res.status(201).json({ message: 'Order placed successfully', orderId, total });
      });
    });
  });
};

// ✅ View Orders
exports.getOrders = (req, res) => {
  const userId = req.user.id;

  db.all(
    `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};
