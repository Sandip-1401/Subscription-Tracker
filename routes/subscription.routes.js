import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createSubscription, getUserSubscriptions } from "../controller/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', authMiddleware, async (req, res, next) => res.send({title: 'get all subscriptions'}));
subscriptionRouter.get('/:id', authMiddleware, async (req, res, next) => res.send({title: 'get subscription by id'}));
subscriptionRouter.put('/:id', authMiddleware, async (req, res, next) => res.send({title: 'update subscription by id'}));
subscriptionRouter.delete('/:id', authMiddleware, async (req, res, next) => res.send({title: 'delete subscription by id'}));
subscriptionRouter.put('/:id/cancel', authMiddleware, async (req, res, next) => res.send({title: 'cancel subscription by id'}));
subscriptionRouter.get('/user/:id', authMiddleware, getUserSubscriptions);
subscriptionRouter.post('/', authMiddleware, createSubscription);

export default subscriptionRouter;