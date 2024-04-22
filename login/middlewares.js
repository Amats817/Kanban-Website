// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next(); // Allow access to admin-only routes
    }
    res.status(403).json({ error: 'Unauthorized' }); // Return 403 Forbidden for non-admin users
};

// Middleware to check if the user is authenticated (logged in)
const isAuthenticated = (req, res, next) => {
    if (req.user) {
        return next(); // Proceed if user is logged in
    }
    res.status(401).json({ error: 'Unauthorized' }); // Return 401 Unauthorized for unauthenticated users
};

module.exports = { isAdmin, isAuthenticated };