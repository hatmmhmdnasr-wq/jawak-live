const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_secret';

exports.sign = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
exports.verify = (token) => jwt.verify(token, JWT_SECRET);
