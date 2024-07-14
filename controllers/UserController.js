import { Router } from 'express';
import UserService from '../services/UserService.js';
import NumberMiddleware from '../middlewares/number.middleware.js';
import UserMiddleware from '../middlewares/user.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/create', async (req, res) => {
    const response = await UserService.createUser(req);
    res.status(response.code).json(response.message);
});

router.get('/getAllUsers', 
    [
        NumberMiddleware.isNumber,
        UserMiddleware.isValidUserById,
        AuthMiddleware.validateToken,
        UserMiddleware.hasPermissions
    ]
    , async (req, res) => {
    const response = await UserService.getAllUsers();
    res.status(response.code).json(response.message);
})

router.get('/findUsers', async (req, res) => {
  try {
    const { eliminados, nombre, antesSesion, despuesSesion } = req.query;

    const users = await UserService.findUsers({
        eliminados,
        nombre,
        antesSesion,
        despuesSesion
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({message: "Ha ocurrido un error"})
  }
})

router.get(
    '/:id',
    [
        NumberMiddleware.isNumber,
        UserMiddleware.isValidUserById,
        AuthMiddleware.validateToken,
        UserMiddleware.hasPermissions
    ],
    async (req, res) => {
        const response = await UserService.getUserById(req.params.id);
        res.status(response.code).json(response.message);
    });

router.put('/:id', [
        NumberMiddleware.isNumber,
        UserMiddleware.isValidUserById,
        AuthMiddleware.validateToken,
        UserMiddleware.hasPermissions,
    ],
    async(req, res) => {
        const response = await UserService.updateUser(req);
        res.status(response.code).json(response.message);
    });

router.delete('/:id',
    [
        NumberMiddleware.isNumber,
        UserMiddleware.isValidUserById,
        AuthMiddleware.validateToken,
        UserMiddleware.hasPermissions,
    ],
    async (req, res) => {
       const response = await UserService.deleteUser(req.params.id);
       res.status(response.code).json(response.message);
    });

export default router;