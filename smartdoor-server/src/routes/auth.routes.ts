import { User } from '@/models/UserModel';
import { generateToken } from '@/utils/jwt.utils';
import { Request, Response, Router } from 'express'; // Add Request and Response here

const router = Router();

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) res.status(400).json({ message: 'User already exists' });
    const newUser = new User({ name, email, password });
    await newUser.save();
    const token = generateToken(newUser._id.toString());
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
    } 
    const token = generateToken(user._id.toString());
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
