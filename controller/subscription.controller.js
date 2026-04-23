import { SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.models.js";

export const createSubscription = async (req, res, next) => {
   try {
      const subscription = await Subscription.create({
         ...req.body,
         user: req.user._id
      });

      const { workflowRunId } = await workflowClient.trigger({
         url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
         body: {
            subscriptionId: subscription._id
         },
         headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
         },
         retries: 0
      });

      res.status(201).json({
         success: true,
         message: 'Subscription created successfully',
         data: { subscription, workflowRunId }
      });

   } catch (error) {
      next(error);
   }
};


export const getUserSubscriptions = async (req, res, next) => {
   try {
      if (req.user._id.toString() !== req.params.id) {
         const error = new Error('You are not authorized');
         error.statusCode = 403;
         throw error;
      }

      const subscriptions = await Subscription.find({ user: req.params.id });

      res.status(200).json({
         success: true,
         data: subscriptions
      });

   } catch (error) {
      next(error);
   }
};


export const getSubscriptionById = async (req, res, next) => {
   try {
      const subscription = await Subscription
         .findById(req.params.id)
         .populate('user', 'name email');

      if (!subscription) {
         const error = new Error('Subscription not found');
         error.statusCode = 404;
         throw error;
      }

      if (subscription.user._id.toString() !== req.user._id.toString()) {
         const error = new Error('Unauthorized');
         error.statusCode = 403;
         throw error;
      }

      res.status(200).json({
         success: true,
         data: subscription
      });

   } catch (error) {
      next(error);
   }
};


export const updateSubscription = async (req, res, next) => {
   try {
      const subscription = await Subscription.findById(req.params.id);

      if (!subscription) {
         const error = new Error('Subscription not found');
         error.statusCode = 404;
         throw error;
      }

      if (subscription.user.toString() !== req.user._id.toString()) {
         const error = new Error('Unauthorized');
         error.statusCode = 403;
         throw error;
      }

      Object.assign(subscription, req.body);

      await subscription.save();

      res.status(200).json({
         success: true,
         message: 'Subscription updated successfully',
         data: subscription
      });

   } catch (error) {
      next(error);
   }
};


export const deleteSubscription = async (req, res, next) => {
   try {
      const subscription = await Subscription.findById(req.params.id);

      if (!subscription) {
         const error = new Error('Subscription not found');
         error.statusCode = 404;
         throw error;
      }

      if (subscription.user.toString() !== req.user._id.toString()) {
         const error = new Error('Unauthorized');
         error.statusCode = 403;
         throw error;
      }

      await subscription.deleteOne();

      res.status(200).json({
         success: true,
         message: 'Subscription deleted successfully'
      });

   } catch (error) {
      next(error);
   }
};


export const cancelSubscription = async (req, res, next) => {
   try {
      const subscription = await Subscription.findById(req.params.id);

      if (!subscription) {
         const error = new Error('Subscription not found');
         error.statusCode = 404;
         throw error;
      }

      if (subscription.user.toString() !== req.user._id.toString()) {
         const error = new Error('Unauthorized');
         error.statusCode = 403;
         throw error;
      }

      subscription.status = 'cancelled';

      await subscription.save();

      res.status(200).json({
         success: true,
         message: 'Subscription cancelled successfully',
         data: subscription
      });

   } catch (error) {
      next(error);
   }
};