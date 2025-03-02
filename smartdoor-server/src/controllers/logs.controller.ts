import { Log } from "@/models/LogModel";
import { Request, Response } from "express";

export const getall = async (req: Request, res: Response): Promise<void> =>{
    try{
        const allHistory = await Log.find();
        res.status(200).json({allHistory});
    }catch (error: unknown) {
        console.error("Error fetching history:", error);
        res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error" });
    }
};

export const getbyIdRoom = async (req: Request, res: Response): Promise<void> => {
    const { roomId } = req.params;

    if (!roomId) {
        res.status(400).json({ message: "Room ID is required" });
        return;
    }

    try {
        const history = await Log.find({ roomId });
        
        if (history.length === 0) {
            res.status(404).json({ message: "No history found for this room" });
            return;
        }

        res.status(200).json(history);
    } catch (error: unknown) {
        console.error("Error fetching history by roomId:", error);
        res.status(500).json({ 
            message: error instanceof Error ? error.message : "Internal Server Error" 
        });
    }
};

export const getbyIdDevice = async (req: Request, res: Response): Promise<void> => {
    const { deviceId } = req.params;

    if (!deviceId) {
        res.status(400).json({ message: "Device ID is required" });
        return;
    }

    try {
        const history = await Log.find({ deviceId });

        if (history.length === 0) {
            res.status(404).json({ message: "No history found for this device" });
            return;
        }

        res.status(200).json(history);
    } catch (error: unknown) {
        console.error("Error fetching history by deviceId:", error);
        res.status(500).json({ 
            message: error instanceof Error ? error.message : "Internal Server Error" 
        });
    }
};


