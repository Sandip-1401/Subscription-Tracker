import { createRequire } from "module";
import dayjs from "dayjs";
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

import Subscription from "../models/subscription.models.js";
import { sendReminderEmail } from "../utills/send-email.js";

const REMINDERS = [7, 5, 2, 1];

export const sendReminder = serve(async (context) => {
   const { subscriptionId } = context.requestPayload;

   const subscription = await fetchSubscriptionById(context, subscriptionId);

   if (!subscription || subscription.status !== 'active') return;

   const renewalDate = dayjs(subscription.renewalDate);

   if (!renewalDate.isValid()) return;

   if (renewalDate.isBefore(dayjs())) return;

   for (const daysBefore of REMINDERS) {
      const reminderDate = renewalDate.subtract(daysBefore, 'day');

      if (!reminderDate.isValid()) continue;

      const type =
         daysBefore === 0
            ? "1 days before reminder"
            : `${daysBefore} days before reminder`;

      if (
         reminderDate.isAfter(dayjs()) ||
         reminderDate.isSame(dayjs(), "day")
      ) {
         await triggerReminder(
            context,
            type,
            subscriptionId
         );
      }
   }
});

const fetchSubscriptionById = async (context, subscriptionId) => {
   return await context.run('get subscription', async () => {
      return Subscription
         .findById(subscriptionId)
         .populate('user', 'name email');
   });
};

const triggerReminder = async (context, type, subscriptionId) => {
   return await context.run(type, async () => {

      const subscription = await Subscription
         .findById(subscriptionId)
         .populate('user', 'name email');

      if (!subscription?.user?.email) {
         return;
      }

      await sendReminderEmail({
         to: subscription.user.email,
         type: type,
         subscription: subscription
      });
   });
};