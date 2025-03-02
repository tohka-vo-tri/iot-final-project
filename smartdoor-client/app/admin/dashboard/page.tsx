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
  Plus,
  Smartphone,
  Trash2,
  Pencil,
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
      const response = await axios.put(`${baseUrl}/devices/update`, {
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
      const response = await axios.put(`${baseUrl}/devices/update`, {
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

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="container p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-destructive">{error}</p>}
            <p>Total Doors: {doors.length}</p>
            <p>Total History Records: {history.length}</p>
          </div>
        )

      case "devices":
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Manage Devices</CardTitle>
              <div className="space-x-2">
                <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Add Device</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Device</DialogTitle>
                      <DialogDescription>Add a new authentication device to a door</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.currentTarget)
                      handleAddDevice(
                        formData.get("door") as string,
                        formData.get("method") as string,
                        formData.get("name") as string,
                        formData.get("data") as string
                      )
                    }}>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="door">Select Door</Label>
                          <Select name="door">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a door" />
                            </SelectTrigger>
                            <SelectContent>
                              {doors.map((door) => (
                                <SelectItem key={door._id} value={door._id}>
                                  {door.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="method">Auth Method</Label>
                          <Select name="method">
                            <SelectTrigger>
                              <SelectValue placeholder="Select auth method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fingerprint">Fingerprint</SelectItem>
                              <SelectItem value="rfid">RFID</SelectItem>
                              <SelectItem value="password">Password</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input name="name" id="name" placeholder="Enter user name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="data">Data</Label>
                          <Input name="data" id="data" placeholder="Enter device data" />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? "Adding..." : "Add Device"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isAddDoorOpen} onOpenChange={setIsAddDoorOpen}>
                  <DialogTrigger asChild>
                    <Button>Add Door</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Door</DialogTitle>
                      <DialogDescription>Add a new door to the system</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      const doorName = (e.currentTarget.elements.namedItem("doorName") as HTMLInputElement).value
                      handleAddDoor(doorName)
                    }}>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="doorName">Door Name</Label>
                          <Input id="doorName" name="doorName" placeholder="Enter door name" />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? "Adding..." : "Add Door"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]"></TableHead>
                    <TableHead>Door Name</TableHead>
                    <TableHead>Auth Methods</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{doors.flatMap((door) => [
                  <TableRow key={`${door._id}-main`}>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => toggleDoorExpansion(door._id)}>
                        {expandedDoors.includes(door._id) ? (<ChevronDown className="h-4 w-4" />) : (<ChevronRight className="h-4 w-4" />)}
                      </Button>
                    </TableCell>
                    <TableCell>{door.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        onClick={() => toggleDoorExpansion(door._id)}
                        className="p-0 h-auto font-normal"
                      >
                        Show more devices ({door.authData.length})
                      </Button>
                    </TableCell>
                    <TableCell>
                      {new Date(door.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setUpdateDoorId(door._id)
                          setIsUpdateDoorOpen(true) // Mở dialog Update Door
                        }}
                        className="hover:bg-gray-200"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>,
                  expandedDoors.includes(door._id) && (
                    <TableRow key={`${door._id}-expanded`} className="bg-muted/50">
                      <TableCell colSpan={5}>
                        <div className="py-2 px-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Auth Method</TableHead>
                                <TableHead>Device ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {door.authData.map((auth: AuthData, index: number) => (
                                <TableRow key={index}>
                                  <TableCell className="capitalize">{auth.method}</TableCell>
                                  <TableCell>{auth.data}</TableCell>
                                  <TableCell>{auth.name}</TableCell>
                                  <TableCell>
                                    {new Date(auth.createdAt).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setDeleteDevice({ doorId: door._id, deviceIndex: index })}
                                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setUpdateDeviceData({ doorId: door._id, deviceIndex: index })
                                        setIsUpdateDeviceOpen(true) // Mở dialog Update Device
                                      }}
                                      className="hover:bg-gray-200"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-4">
                                  <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" className="w-[200px]">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Device
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Add New Device</DialogTitle>
                                        <DialogDescription>
                                          Add a new authentication device to {door.name}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <form onSubmit={(e) => {
                                        e.preventDefault()
                                        const formData = new FormData(e.currentTarget)
                                        handleAddDevice(
                                          door._id,
                                          formData.get("method") as string,
                                          formData.get("name") as string,
                                          formData.get("data") as string
                                        )
                                      }}>
                                        <div className="space-y-4 py-4">
                                          <div className="space-y-2">
                                            <Label htmlFor="method">Auth Method</Label>
                                            <Select name="method">
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select auth method" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="fingerprint">Fingerprint</SelectItem>
                                                <SelectItem value="rfid">RFID</SelectItem>
                                                <SelectItem value="password">Password</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input name="name" id="name" placeholder="Enter user name" />
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="data">Data</Label>
                                            <Input name="data" id="data" placeholder="Enter device data" />
                                          </div>
                                          <Button type="submit" className="w-full" disabled={isLoading}>
                                            {isLoading ? "Adding..." : "Add Device"}
                                          </Button>
                                        </div>
                                      </form>
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                ])}</TableBody>
              </Table>
            </CardContent>
          </Card>
        )

      case "history":
        return (
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && <p>Loading...</p>}
              {error && <p className="text-destructive">{error}</p>}
              {!isLoading && !error && history.length === 0 && <p>No history records found.</p>}
              {history.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room ID</TableHead>
                      <TableHead>Room Name</TableHead>
                      <TableHead>Device ID</TableHead>
                      <TableHead>Device Name</TableHead>
                      <TableHead>User Name</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((log, index) => (
                      <TableRow key={log._id}> 
                        <TableCell>{log.roomId}</TableCell>
                        <TableCell>{log.nameRoom}</TableCell>
                        <TableCell>{log.deviceId}</TableCell>
                        <TableCell>{log.nameDevice}</TableCell>
                        <TableCell>{log.nameUser}</TableCell>
                        <TableCell className="capitalize">{log.action}</TableCell>
                        <TableCell>
                          {new Date(log.timeStamp).toLocaleDateString()} {new Date(log.timeStamp).toLocaleTimeString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="flex h-screen">
      <div
        className={cn(
          "flex flex-col border-r bg-gray-100/40 dark:bg-gray-800/40",
          isCollapsed ? "w-16" : "w-64",
          "transition-width duration-200 ease-in-out",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {!isCollapsed && <span className="text-lg font-semibold">Admin Panel</span>}
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
            {isCollapsed ? <Menu /> : <ChevronLeft />}
          </Button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveTab(item.value as typeof activeTab)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 w-full",
                activeTab === item.value ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : "",
                "group",
              )}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.title}</span>}
            </button>
          ))}
        </nav>
      </div>

      <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>

      {/* Dialog Update Door */}
      <Dialog open={isUpdateDoorOpen} onOpenChange={(open) => { setIsUpdateDoorOpen(open); if (!open) setUpdateDoorId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Door Name</DialogTitle>
            <DialogDescription>Update the name of the selected door</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            if (updateDoorId) {
              handleUpdateDoor(updateDoorId, formData.get("doorName") as string)
            }
          }}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="doorName">Door Name</Label>
                <Input 
                  id="doorName" 
                  name="doorName" 
                  placeholder="Enter new door name" 
                  defaultValue={doors.find(d => d._id === updateDoorId)?.name || ''} 
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Door"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Update Device */}
      <Dialog open={isUpdateDeviceOpen} onOpenChange={(open) => { setIsUpdateDeviceOpen(open); if (!open) setUpdateDeviceData(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Device User Name</DialogTitle>
            <DialogDescription>Update the user name of the selected device</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            if (updateDeviceData) {
              const door = doors.find(d => d._id === updateDeviceData.doorId)
              const device = door?.authData[updateDeviceData.deviceIndex]
              if (door && device) {
                handleUpdateDevice(updateDeviceData.doorId, device.data, formData.get("name") as string)
              }
            }
          }}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">User Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Enter new user name" 
                  defaultValue={
                    updateDeviceData && doors.find(d => d._id === updateDeviceData.doorId)?.authData[updateDeviceData.deviceIndex]?.name || ''
                  } 
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Device"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteDevice} onOpenChange={() => setDeleteDevice(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this device. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteDevice) {
                  handleDeleteDevice(deleteDevice.doorId, deleteDevice.deviceIndex)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}