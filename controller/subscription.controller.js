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
         })

   } catch (error) {
      next(error);
   }
}

export const getUserSubscriptions = async (req, res, next) => {
   try {
      if (req.user.id !== req.params.id) {
         const error = new Error('You are not authorized to view these subscriptions');
         error.statusCode = 403;
         throw error;
      }

      const subscriptions = await Subscription.find({ user: req.params.id });

      res.status(200).json({
         success: true,
         data: subscriptions
      })
   } catch (error) {
      next(error);
   }
}