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


