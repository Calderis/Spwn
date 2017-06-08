import express from 'express';
import authRoutes from './auth.route';
<§- data -> model -§>
import <§ model.name §>Routes from './<§ model.plurialName §>.route';
<-§->

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount auth routes at /auth
router.use('/auth', authRoutes);

<§- data -> model -§>
// mount <§ model.name §> routes at /<§ model.plurialName §>
router.use('/<§ model.plurialName §>', <§ model.name §>Routes);
<-§->

export default router;
