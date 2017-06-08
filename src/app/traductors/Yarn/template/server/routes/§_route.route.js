import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import <§ data.name §>Ctrl from '../controllers/<§ data.plurialName §>.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/<§ data.plurialName §> - Get list of <§ data.plurialName §> */
  .get(expressJwt({ secret: config.jwtSecret }), <§ data.name §>Ctrl.list)

  /** POST /api/<§ data.plurialName §> - Create new <§ data.name §> */
  .post(expressJwt({ secret: config.jwtSecret }), validate(paramValidation.create<§ data.className §>), <§ data.name §>Ctrl.create);

router.route('/:<§ data.name §>Id')
  /** GET /api/<§ data.plurialName §>/:<§ data.name §>Id - Get <§ data.name §> */
  .get(expressJwt({ secret: config.jwtSecret }), <§ data.name §>Ctrl.get)

  /** PUT /api/<§ data.plurialName §>/:<§ data.name §>Id - Update <§ data.name §> */
  .put(expressJwt({ secret: config.jwtSecret }), validate(paramValidation.update<§ data.className §>), <§ data.name §>Ctrl.update)

  /** DELETE /api/<§ data.plurialName §>/:<§ data.name §>Id - Delete <§ data.name §> */
  .delete(expressJwt({ secret: config.jwtSecret }), <§ data.name §>Ctrl.remove);

/** Load <§ data.name §> when API with <§ data.name §>Id route parameter is hit */
router.param('<§ data.name §>Id', <§ data.name §>Ctrl.load);

export default router;