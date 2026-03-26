function requireLogin(req, res, next) {
    if (!req.session.user) {
        console.log("Not logged in!")
        return res.redirect('/login');
    };
    
    next();
}

function requireAdmin(req, res, next) {
    if (!req.session.user) {
        console.log("Not logged in!");
        return res.redirect('/login');
    };

    if (req.session.user.type !== "admin") {
        console.log("Not an admin!");
        console.log(req.session.user.type);
        return res.redirect('/display-pet');
    };

    next();
}

module.exports = { requireLogin, requireAdmin };