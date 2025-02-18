import { User } from "@/models/UserModel";
import { Request, Response, Router } from "express";
const router = Router();

router.put('/add-fingerprint', async (req: Request, res: Response): Promise<void> => {
    const { email, fingerprintId } = req.body;
  
    try {
      const userExists = await User.findOne({ email });
      if (!userExists) res.status(404).json({ message: 'User not exists' });
  
      await User.updateOne(
        { email },
        { $set: { fingerprintId, dateCreateFingerprint: Date.now() } }
      );
  
      res.status(200).json({ message: 'Add fingerprint method success' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
  router.put('/add-rfid', async (req: Request, res: Response): Promise<void> =>{
    const {email, rfid} = req.body;
  
    try{
      const userExists = await User.findOne({email});
      if(!userExists) res.status(404).json({message: 'User not exists'});
  
      await User.updateOne(
        {email},
        {$set: {rfid, dateCreateRfid: Date.now()}}
      );
  
      res.status(200).json({message: 'Add rfid method success'})
    }catch(err){
      res.status(500).json({message: 'Sever error'})
    }
  });


  export default router;