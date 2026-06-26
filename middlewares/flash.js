// Custom flash middleware — simple and reliable
module.exports = function flashMiddleware(req, res, next) {

    // Attach req.flash() setter
    req.flash = function (type, message) {
        if (!req.session) return;
        if (type === "success") req.session.flash_success = message;
        if (type === "error")   req.session.flash_error   = message;
    };

    // Attach req.getFlash() getter + clearer — call this inside res.render()
    req.getFlash = function () {
        const success = req.session.flash_success || null;
        const error   = req.session.flash_error   || null;
        delete req.session.flash_success;
        delete req.session.flash_error;
        return { success, error };
    };

    // Override res.redirect to always save session first
    const originalRedirect = res.redirect.bind(res);
    res.redirect = function (url) {
        req.session.save(function (err) {
            if (err) console.error("Session save error:", err);
            originalRedirect(url);
        });
    };

    next();
};
