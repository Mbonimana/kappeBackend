import express from 'express';

import { createCategory, listCategories, getCategory, deleteCategory } from '../Controllers/CategoryController';
const router = express.Router();


router.post('/', createCategory);
router.get('/', listCategories);
router.get('/:id', getCategory);
router.delete('/:id', deleteCategory);


export default router;