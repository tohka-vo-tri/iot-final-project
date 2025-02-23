import { History } from "@/models/HistoryModel";
import { User } from "@/models/UserModel";
import { Request, Response } from "express";

export const getall = async (req: Request, res: Response): Promise<void> =>{
    try{
        const allHistory = await History.find();
        res.status(200).json({allHistory});
    }catch (error: unknown) {
        console.error("Error fetching history:", error);
        res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error" });
    }
};

export const getHistoryById = async (req: Request, res: Response): Promise<void>=> { 
    try {
        const userId = req.params.userId; 

        if (!userId) {
            res.status(400).json({ message: 'User ID is required' });
        }

        const allHistory = await History.find({ userId: userId }); 

        if (!allHistory || allHistory.length === 0) { 
            res.status(404).json({ message: 'No history found for this user' });
        }

        res.status(200).json({ allHistory });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const addHistory = async (req: Request, res: Response): Promise<void> => {
    const { method, data } = req.body;

    try {
        if (!method) {
            res.status(400).json({ message: 'Method is required' });
        }

        let searchField:string = "";
        switch (method.toLowerCase()) {
            case 'key':
                searchField = 'Key';
                break;
            case 'rfid':
                searchField = 'RFID';
                break;
            case 'fingerprint':
                searchField = 'fingerprint';
                break;
            default:
                res.status(400).json({ message: 'Invalid method.  Must be Key, RFID, or Fingerprint.' });
        }

        let userId = null;
        if (method.toLowerCase() !== 'key') {
            if (!data) {
                res.status(400).json({ message: 'Data is required' });
            }
        
            const userExists = await User.findOne({ [searchField]: data });
        
            if (!userExists) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            userId = userExists._id;
        }        
        const newHistory = new History({
            userId: userId, 
            method: method,
            timeStamp: new Date(),
        });

        await newHistory.save();
        res.status(201).json({ message: 'History added successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


