
const authorize = (...allowedRoles) => (req, res, next) => {
    
    if(!req.user) {
        return res.status(401).json({
            msg: "Authentication required"
        })
    }

    if(!allowedRoles.includes(req.user.role)){
        return res.status(403).json({
            msg: "Forbidden"
        })
    }

    next();

}

export default authorize;