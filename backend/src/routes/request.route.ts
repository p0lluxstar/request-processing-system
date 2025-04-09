import { Router } from 'express';
import {
  getFilteredRequestsHandler,
  createNewRequestHandler,
  startRequestHandler,
  completeRequestHandler,
  cancelRequestHandler,
  cancelAllRequestsHandler,
} from '../controllers/request.controller';

const router = Router();

router.route('/').get(getFilteredRequestsHandler).post(createNewRequestHandler);
router.patch('/:id/start', startRequestHandler);
router.patch('/:id/complete', completeRequestHandler);
router.patch('/:id/cancel', cancelRequestHandler);
router.patch('/cancel-all', cancelAllRequestsHandler);

export default router;
