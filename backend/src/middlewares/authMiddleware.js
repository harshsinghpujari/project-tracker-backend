import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
  
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "missing or invalid access token"
      })
    }
  
    const token = authHeader.split(" ")[1];
  
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  
    req.user = decodedToken;
    console.log(req.user)
  
    next();
  } catch (error) {
    
    return res.status(403).json({
      message: "Invalid or expired token"
    });
  }
}

export {verifyToken};