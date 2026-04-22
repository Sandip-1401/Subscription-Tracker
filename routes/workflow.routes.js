import { Route } from "express";

const workflowRouter = Route();

workflowRouter.get('/', async (req, res, next) => res.send({title: 'get all workflows'}));

export default workflowRouter;