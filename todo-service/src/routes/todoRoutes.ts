import { Router } from 'express';
import { getTodos,createTodo,updateTodo,deleteTodo } from '../controllers/todoController';
import { authenticateToken } from '../middleware/auth';
import { validateCreateTodo, validateUpdateTodo, validateTodoId } from '../middleware/validation';

const router = Router();

router.use(authenticateToken);

router.get('/api/:id',getTodos);
router.post('/', validateCreateTodo,createTodo);
router.put('/:id', validateTodoId, validateUpdateTodo,updateTodo);
router.delete('/:id', validateTodoId,deleteTodo);

export default router;