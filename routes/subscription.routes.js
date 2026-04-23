import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

import {
  createSubscription,
  getUserSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  cancelSubscription
} from "../controller/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.post('/', authMiddleware, createSubscription);

subscriptionRouter.get('/user/:id', authMiddleware, getUserSubscriptions);

subscriptionRouter.get('/:id', authMiddleware, getSubscriptionById);

subscriptionRouter.put('/:id', authMiddleware, updateSubscription);

subscriptionRouter.delete('/:id', authMiddleware, deleteSubscription);

subscriptionRouter.put('/:id/cancel', authMiddleware, cancelSubscription);

export default subscriptionRouter;