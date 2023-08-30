const isLoggedIn = (req, res, next) => {
  if (req.session.user === undefined) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

const isAdmin = (req, res, next) => {
  if (req.session.user.role === "admin") {
    next();
  } else {
    res.redirect("/auth/login");
  }
};

const updateLocals = (req, res, next) => {
  if (req.session.user === undefined) {
    res.locals.isUserActive = false;
    res.locals.Image = undefined;
    res.locals.username = undefined;   
  } else {
    res.locals.isUserActive = true;
    res.locals.Image = req.session.user.profilePic;
    res.locals.username = req.session.user.username
    if (req.session.user.role === "admin") {
      res.locals.isAdminActive = true;
    } else {
      res.locals.isAdminActive = false;
    }
  }
  next();
};

module.exports = {
  isLoggedIn,
  isAdmin,
  updateLocals,
};
