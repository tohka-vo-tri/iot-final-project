"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import axios from "axios"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  History,
  LayoutDashboard,
  Menu,
  Pencil,
  Plus,
  Smartphone,
  Trash2,
} from "lucide-react"
import { useEffect, useState } from "react"

interface AuthData {
  method: string;
  data: string;
  name: string;
  createdAt: Date | string;
}

interface Door {
  _id: string;
  name: string;
  authData: AuthData[];
  createdAt: Date | string;
  userId?: string;
}

interface HistoryLog {
  _id: string;
  roomId: string;
  nameRoom: string;
  deviceId: string;
  nameDevice: string;
  nameUser: string;
  action: 'open' | 'close' | 'sign_password';
  timeStamp: Date | string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "devices" | "history">("dashboard")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false)
  const [isAddDoorOpen, setIsAddDoorOpen] = useState(false)
  const [isUpdateDoorOpen, setIsUpdateDoorOpen] = useState(false)
  const [isUpdateDeviceOpen, setIsUpdateDeviceOpen] = useState(false)
  const [expandedDoors, setExpandedDoors] = useState<string[]>([])
  const [deleteDevice, setDeleteDevice] = useState<{ doorId: string; deviceIndex: number } | null>(null)
  const [updateDoorId, setUpdateDoorId] = useState<string | null>(null)
  const [updateDeviceData, setUpdateDeviceData] = useState<{ doorId: string; deviceIndex: number } | null>(null)
  const [doors, setDoors] = useState<Door[]>([])
  const [history, setHistory] = useState<HistoryLog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [doorsResponse, historyResponse] = await Promise.all([
        axios.get<Door[]>(`${baseUrl}/devices/getall`),
        axios.get<{ allHistory: HistoryLog[] }>(`${baseUrl}/logs/getall`)
      ])
      setDoors(doorsResponse.data)
      const historyData = Array.isArray(historyResponse.data.allHistory) 
        ? historyResponse.data.allHistory 
        : [];
      setHistory(historyData);
    } catch (err) {
      setError("Failed to fetch data")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddDoor = async (doorName: string) => {
    try {
      const response = await axios.post<Door>(`${baseUrl}/devices/init-device`, {
        name: doorName,
        authData: [],
        createdAt: new Date()
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setDoors([...doors, response.data])
      setIsAddDoorOpen(false)
    } catch (err) {
      setError("Failed to add door")
      console.error(err)
    }
  }

  const handleAddDevice = async (
    doorId: string,
    method: string,
    name: string,
    data: string
  ) => {
    try {
      const url = `${baseUrl}/devices/add-${method.toLowerCase()}`
      const response = await axios.post<AuthData>(url, {
        doorId,
        authData: {
          method,
          data,
          name,
          createdAt: new Date()
        }
      })
      
      setDoors(doors.map(door => 
        door._id === doorId 
          ? { ...door, authData: [...door.authData, response.data] }
          : door
      ))
      setIsAddDeviceOpen(false)
    } catch (err) {
      setError("Failed to add device")
      console.error(err)
    }
  }

  const handleUpdateDoor = async (doorId: string, newName: string) => {
    try {
      const response = await axios.put(`${baseUrl}/devices/update-room`, {
        roomId: doorId,
        name: newName
      })
      setDoors(doors.map(door => 
        door._id === doorId 
          ? { ...door, name: newName }
          : door
      ))
      setIsUpdateDoorOpen(false)
      setUpdateDoorId(null)
    } catch (err) {
      setError("Failed to update door name")
      console.error(err)
    }
  }

  const handleUpdateDevice = async (doorId: string, deviceId: string, newName: string) => {
    try {
      const response = await axios.put(`${baseUrl}/devices/update-device`, {
        roomId: doorId,
        deviceId,
        nameUser: newName
      })
      setDoors(doors.map(door => 
        door._id === doorId 
          ? { 
              ...door, 
              authData: door.authData.map(auth => 
                auth.data === deviceId ? { ...auth, name: newName } : auth
              )
            }
          : door
      ))
      setIsUpdateDeviceOpen(false)
      setUpdateDeviceData(null)
    } catch (err) {
      setError("Failed to update device name")
      console.error(err)
    }
  }

  const handleDeleteDevice = async (doorId: string, deviceIndex: number) => {
    try {
      const door = doors.find(d => d._id === doorId)
      if (!door) return
      const deviceToDelete = door.authData[deviceIndex]
      
      await axios.delete(`${baseUrl}/devices`, {
        data: {
          doorId,
          deviceId: deviceToDelete.data
        }
      })
      
      setDoors(doors.map(door => 
        door._id === doorId 
          ? { ...door, authData: door.authData.filter((_, i) => i !== deviceIndex) }
          : door
      ))
      setDeleteDevice(null)
    } catch (err) {
      setError("Failed to delete device")
      console.error(err)
    }
  }

  const menuItems = [
    { title: "Dashboard", value: "dashboard", icon: LayoutDashboard },
    { title: "Manage Devices", value: "devices", icon: Smartphone },
    { title: "History", value: "history", icon: History },
  ]

  const toggleDoorExpansion = (doorId: string) => {
    setExpandedDoors((prev) => 
      prev.includes(doorId) ? prev.filter((id) => id !== doorId) : [...prev, doorId]
    )
  }

  return (
      <div className="container p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-destructive">{error}</p>}
        <p>Total Doors: {doors.length}</p>
        <p>Total History Records: {history.length}</p>
      </div>
  )
}