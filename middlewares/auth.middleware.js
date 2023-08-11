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
  }else {
    res.locals.isUserActive = true;
  }
  next()
};

// const adminRoutes = (req, res, next) => {
//   if (req.session.user.role === "admin") {
//     res.locals.isAdmin = true;
//   } else {
//     res.locals.isAdmin = false;
//   }
//   next();
// };

module.exports = {
  isLoggedIn,
  isAdmin,
  updateLocals,
  };
