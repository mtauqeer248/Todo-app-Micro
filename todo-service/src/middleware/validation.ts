import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const createTodoSchema = Joi.object({
  title: Joi.string().required().min(1).max(255),
  description: Joi.string().allow("").max(1000),
});

const updateTodoSchema = Joi.object({
  title: Joi.string().min(1).max(255),
  description: Joi.string().allow("").max(1000),
  completed: Joi.boolean(),
}).min(1);

export const validateCreateTodo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = createTodoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateUpdateTodo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = updateTodoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateTodoId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid todo ID" });
  }
  next();
};
