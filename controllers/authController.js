const path = require('path');
const db = require('../config/db');
const bcrypt = require('bcrypt');

const showLogin = (req, res) => {
  res.sendFile(path.join(__dirname, '/../views/login.html'));
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.redirect('/login?error=1');
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.redirect('/login?error=1');
    }

    const [roles] = await db.query(
      `SELECT r.name FROM roles r
       JOIN model_has_roles mr ON r.id = mr.role_id
       WHERE mr.user_id = ?`, [user.id]
    );

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: roles[0]?.name || 'user'
    };

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/login?error=1');
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};

module.exports = { showLogin, login, logout };