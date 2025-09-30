import router from 'express';
import { createContact } from '../controllers/ContactController';
const contactRouter = router();

contactRouter.post('/createContact', createContact);
export default contactRouter;