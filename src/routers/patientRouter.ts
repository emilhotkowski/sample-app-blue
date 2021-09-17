import { NextFunction, Router } from 'express';
import passport from "passport";
import { User, UserRole } from "../model/user.model";
import { hasRoles } from "../auth/hasRoles.middleware";
import moment from 'moment';
import { logger } from "../logging/logger";
import { Patient } from "../model/patient.model";

export function setPatientRoutes(router: Router) {
  router.get("/search", passport.authenticate('jwt', {session: false}), hasRoles(UserRole.nurse), async (req, res, next: NextFunction) => {
    const email = req.query.email as string;
    const birthDate = req.query.birthDate as string;
    const lastName = req.query.lastName as string;
    logger.info(req.query);

    Patient.find({ role: UserRole.patient })
      .or([{ email }, { lastName }, {birthDate: birthDate!== undefined ? moment(birthDate, "YYYY-MM-DD").toDate() : undefined }])
      .then((patients) => {
      const passwordlessPatients = patients.map(patient => {
        const newPatient = JSON.parse(JSON.stringify(patient));
        delete newPatient.password;
        return newPatient;
      });

      res.json({
        patients: passwordlessPatients
      });
      next();
    });
  });

  router.post("/history/:id", passport.authenticate('jwt', {session: false}), hasRoles(UserRole.nurse), async (req, res, next: NextFunction) => {
    Patient.updateOne({ _id: req.params.id }, { $push: { medicalHistory: req.body}}).then(() => {
      res.status(200).json({message: "Record added"});
      next()
    });
  });

  router.get("/history/:id", passport.authenticate('jwt', {session: false}), hasRoles(UserRole.nurse), async (req, res, next: NextFunction) => {
    Patient.findOne({ _id: req.params.id }).then((patient) => {
      if(!patient) {
        res.status(404).json({message: "Patient not found"});
        return next();
      }

      res.status(200).json({medicalHistory: patient.medicalHistory});
      return next();
    });
  });

  return router;
}
