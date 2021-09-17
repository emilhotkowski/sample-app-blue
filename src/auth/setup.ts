import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import { IUser, User } from "../model/user.model";
import { logger } from "../logging/logger";

module.exports = (passport: any) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: "someweirdsecretforJWT"// Again not the best way to inject secrets
  }

  passport.use(new JwtStrategy(opts, (payload, done) => {
    logger.info(payload);
    User.findById(payload._id, (err: Error, user: IUser) => {
      if(err) {
        return done(err, false);
      }
      if(user) {
        return done(null, user);
      }
      return done(null, false);
    });
  }));
}