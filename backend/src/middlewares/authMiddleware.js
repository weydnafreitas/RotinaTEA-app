const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authorization.replace('Bearer', '').trim();

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    
    req.userId = data.id;

    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
};