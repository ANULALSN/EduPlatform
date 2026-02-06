import { sendMessage, getChatHistory, getContacts } from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/contacts', getContacts);
router.post('/send', sendMessage);
router.get('/history/:userId', getChatHistory);

export default router;
