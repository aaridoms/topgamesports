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
    res.locals.Image = undefined
    
  } else {
    res.locals.isUserActive = true;
    res.locals.Image = req.session.user.profilePic;
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
