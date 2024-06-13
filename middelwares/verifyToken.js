const jwt = require("jsonwebtoken");

// verify token
function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized access" });
  }
}

// verify token and authorization
function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next()
    }else{
      return res.status(403).json({message:"Forbidden access"});
    }
  });
}


// verify token and admin
function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next()
    }else{
      return res.status(403).json({message:"Forbidden access, you are not admin"});
    }
  });
}


module.exports = { verifyTokenAndAuthorization,verifyTokenAndAdmin };
