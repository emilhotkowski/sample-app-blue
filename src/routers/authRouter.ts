import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User, UserRole } from "../model/user.model";

export function setAuthRoutes(router: Router) {
  router.post('/register', (req, res, next) => {
    const role = req.body.role === undefined ? UserRole.patient : req.body.role;
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthDate: req.body.birthDate,
      email: req.body.email,
      password: req.body.password,
      role,
      "__t": role
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err) throw err;
        newUser.password = hash;
        newUser.save((err, user) => {
          if(err) {
            res.status(401).json({message: "Failed to register a user"});
          } else {
            res.status(201).json({message: "User registered"});
          }
        });
      });
      });
  });

  router.post('/authenticate', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email });
    if(user==null) {
      res.status(403).json({message: "Unauthorized"});
      return next();
    }

    const isMatch = bcrypt.compareSync(password, user!.password);
    if(!isMatch) {
      res.status(403).json({message: "Unauthorized"});;
      return next()
    }
    const passwordlessUser = JSON.parse(JSON.stringify(user));
    delete passwordlessUser.password;

    const token = jwt.sign(passwordlessUser, "someweirdsecretforJWT", {
      expiresIn: 60 * 60 * 24
    });

    res.json({
      token: "JWT " + token,
      user: passwordlessUser
    });
    next();
  });

  return router;
}
