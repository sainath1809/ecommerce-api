const db = require('../config/db');

// ➕ Add to Cart
exports.addToCart = (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({ error: 'Product and quantity required' });
  }

  const sql = `INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)`;

  db.run(sql, [userId, product_id, quantity], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({ message: 'Item added to cart', cartId: this.lastID });
  });
};

// 🧺 View Cart
exports.getCart = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT cart.id, products.name, products.price, cart.quantity
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;

  db.all(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(rows);
  });
};


// 🔁 Update Cart Quantity
exports.updateCartItem = (req, res) => {
  const { id } = req.params; // cart item ID
  const { quantity } = req.body;

  if (!quantity) {
    return res.status(400).json({ error: 'Quantity is required' });
  }

  const sql = `UPDATE cart SET quantity = ? WHERE id = ?`;

  db.run(sql, [quantity, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Cart item updated successfully' });
  });
};


// 🗑️ Remove Cart Item
exports.deleteCartItem = (req, res) => {
  const { id } = req.params; // cart item ID

  const sql = `DELETE FROM cart WHERE id = ?`;

  db.run(sql, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Cart item removed successfully' });
  });
};
