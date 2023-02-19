exports.isLoggedIn = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    res.redirect('/404');
  }

  next();
};

exports.isAdmin = (req, res, next) => {
  if (!req.session.isAdmin) {
    res.redirect('/404');
  }
};
