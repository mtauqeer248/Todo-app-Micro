import { Router } from 'express';
import { TodoController } from '../controllers/todoController';
import { authenticateToken } from '../middleware/auth';
import { validateCreateTodo, validateUpdateTodo, validateTodoId } from '../middleware/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

router.get('/', TodoController.getTodos);
router.post('/', validateCreateTodo, TodoController.createTodo);
router.put('/:id', validateTodoId, validateUpdateTodo, TodoController.updateTodo);
router.delete('/:id', validateTodoId, TodoController.deleteTodo);

export default router;