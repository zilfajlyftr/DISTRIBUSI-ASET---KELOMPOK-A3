const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.get('/', (req, res) => res.redirect('/login'));
router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/logout', isAuthenticated, authController.logout);

router.get('/dashboard', isAuthenticated, (req, res) => {
  res.send(`<h1>Selamat datang, ${req.session.user.name}</h1>
            <p>Role: ${req.session.user.role}</p>
            <a href="/logout">Logout</a>`);
});

module.exports = router;