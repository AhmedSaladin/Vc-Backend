const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secretasshit');
    //userid in token and it genrate with every
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'auth faild'
    });
  }
};
