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
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios, { AxiosError } from "axios"
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react"
import { useEffect, useState } from "react"

interface AuthData {
  method: string;
  data: string;
  name: string;
  status: boolean;
  createdAt: Date | string;
}

interface Door {
  _id: string;
  name: string;
  authData: AuthData[];
  createdAt: Date | string;
  userId?: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "devices" | "history">("dashboard")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false)
  const [isAddDoorOpen, setIsAddDoorOpen] = useState(false)
  const [isUpdateDoorOpen, setIsUpdateDoorOpen] = useState(false)
  const [isUpdateDeviceOpen, setIsUpdateDeviceOpen] = useState(false)
  const [isUpdatePasswordDeviceOpen, setIsUpdatePasswordDeviceOpen] = useState(false)
  const [expandedDoors, setExpandedDoors] = useState<string[]>([])
  const [deleteDevice, setDeleteDevice] = useState<{ doorId: string; deviceIndex: number } | null>(null)
  const [updateDoorId, setUpdateDoorId] = useState<string | null>(null)
  const [updateDeviceData, setUpdateDeviceData] = useState<{ doorId: string; deviceIndex: number } | null>(null)
  const [doors, setDoors] = useState<Door[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [doorsResponse] = await Promise.all([
        axios.get<Door[]>(`${baseUrl}/devices/getall`),
      ])
      setDoors(doorsResponse.data)
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
          createdAt: new Date(),
          status: false
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
  const handleChangePassword = async (doorId: string, deviceId: string, newPassword: string) => {
    try {
      setIsLoading(true)
      const response = await axios.put(`${baseUrl}/devices/changes-password`, {
        roomId: doorId,
        deviceId,
        password: newPassword
      })
      setDoors(doors.map(door =>
        door._id === doorId
          ? {
            ...door,
            authData: door.authData.map(auth => auth.data === deviceId ? { ...auth, data: newPassword } : auth)
          }
          : door
      ))
      setIsUpdatePasswordDeviceOpen(false)
      setUpdateDeviceData(null) // Reset update device data
    } catch (err) {
      setError("Failed to change password")
      console.error(err)
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleUpdateDevice = async (doorId: string, deviceId: string, newName: string, newStatus: boolean) => {
    try {
      console.log(doorId, deviceId, newName, newStatus)
      setIsLoading(true)
      const response = await axios.put(`${baseUrl}/devices/update-device`, {
        roomId: doorId,
        deviceId,
        nameUser: newName,
        status: newStatus
      })
      setDoors(doors.map(door =>
        door._id === doorId
          ? {
            ...door,
            authData: door.authData.map(auth =>
              auth.data === deviceId ? { ...auth, name: newName, status: newStatus } : auth
            )
          }
          : door
      ))
      setIsUpdateDeviceOpen(false)
      setUpdateDeviceData(null)
    } catch (err) {
      setError("Failed to update device")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDevice = async (doorId: string, deviceIndex: number) => {
    try {
      const door = doors.find(d => d._id === doorId);
      if (!door) {
        setError("Door not found");
        return;
      }
      const deviceToDelete = door.authData[deviceIndex];
      if (!deviceToDelete) {
        setError("Device not found");
        return;
      }

      await axios.delete(`${baseUrl}/devices/delete-device`, {
        data: {
          roomId: doorId,
          data: deviceToDelete.data
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setDoors(doors.map(door =>
        door._id === doorId
          ? { ...door, authData: door.authData.filter((_, i) => i !== deviceIndex) }
          : door
      ));
      setDeleteDevice(null);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || "Failed to delete device");
      console.error("Error deleting device:", err);
    }
  };

  const toggleDoorExpansion = (doorId: string) => {
    setExpandedDoors((prev) =>
      prev.includes(doorId) ? prev.filter((id) => id !== doorId) : [...prev, doorId]
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Devices</CardTitle>
          <div className="space-x-2">
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
                    Show more Auth methods ({door.authData.length})
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
                      setIsUpdateDoorOpen(true)
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
                            <TableHead>Device Data</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {door.authData.map((auth: AuthData, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="capitalize">{auth.method}</TableCell>
                              <TableCell>
                                {auth.method === 'Password' ? '********' : auth.data}
                              </TableCell>
                              <TableCell>{auth.name}</TableCell>
                              <TableCell>
                                <Switch
                                  checked={auth.status}
                                />
                              </TableCell>
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
                                    if (auth.method === 'Password') {
                                      setIsUpdatePasswordDeviceOpen(true)
                                    } else {
                                      setIsUpdateDeviceOpen(true)
                                    }
                                  }}
                                  className="hover:bg-gray-200"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
                                <DialogTrigger asChild>
                                  <Button variant="outline" className="w-[200px]">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Auth Method
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Add New Device</DialogTitle>
                                    <DialogDescription>
                                      Add a new authentication device to {door.name ?? "No name"}
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
            <DialogTitle>Update Device</DialogTitle>
            <DialogDescription>Update the user name and status of the selected device</DialogDescription>
          </DialogHeader>
          {(() => {
            const door = updateDeviceData && doors.find(d => d._id === updateDeviceData.doorId);
            const device = door?.authData[updateDeviceData?.deviceIndex ?? -1];

            const [localName, setLocalName] = useState(device?.name || '');
            const [localStatus, setLocalStatus] = useState(device?.status || false);

            useEffect(() => {
              setLocalName(device?.name || '');
              setLocalStatus(device?.status || false);
            }, [updateDeviceData]);

            const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              if (updateDeviceData && door && device) {
                handleUpdateDevice(
                  updateDeviceData.doorId,
                  device.data,
                  localName,
                  localStatus
                );
              }
            };

            return (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">User Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter new user name"
                      value={localName}
                      onChange={(e) => setLocalName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Switch
                      id="status"
                      name="status"
                      checked={localStatus}
                      onCheckedChange={(checked) => setLocalStatus(checked)}

                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Device"}
                  </Button>
                </div>
              </form>
            );
          })()}
        </DialogContent>
      </Dialog>
      <Dialog open={isUpdatePasswordDeviceOpen} onOpenChange={(open) => { setIsUpdatePasswordDeviceOpen(open); if (!open) setUpdateDeviceData(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Update the password for this device</DialogDescription>
          </DialogHeader>
          {(() => {
            const door = updateDeviceData && doors.find(d => d._id === updateDeviceData.doorId);
            const device = door?.authData[updateDeviceData?.deviceIndex ?? -1];

            const [newPassword, setNewPassword] = useState('');
            const [confirmPassword, setConfirmPassword] = useState('');
            const [showPassword, setShowPassword] = useState(false);
            const [passwordError, setPasswordError] = useState<string | null>(null);

            // Làm sạch lỗi khi người dùng thay đổi giá trị của newPassword hoặc confirmPassword
            const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>, setField: (value: string) => void) => {
              setField(e.target.value);
              if (passwordError) setPasswordError(null); // Xóa lỗi khi người dùng bắt đầu nhập lại
            };

            const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              if (newPassword !== confirmPassword) {
                setPasswordError("Passwords do not match");
                return;
              }
              setPasswordError(null); // Xóa lỗi nếu mật khẩu khớp

              if (updateDeviceData && door && device) {
                handleChangePassword(
                  updateDeviceData.doorId,
                  device.data,
                  newPassword
                );
              }
            };

            return (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => handlePasswordChange(e, setNewPassword)}
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>

                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password again"
                        value={confirmPassword}
                        onChange={(e) => handlePasswordChange(e, setConfirmPassword)}
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>

                    {passwordError && (
                      <p className="text-red-500 text-sm">{passwordError}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading || !!passwordError}>
                    {isLoading ? "Updating..." : "Change Password"}
                  </Button>
                </div>
              </form>
            );
          })()}
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
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                if (deleteDevice) {
                  handleDeleteDevice(deleteDevice.doorId, deleteDevice.deviceIndex);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
          <button onClick={() => setError(null)} className="ml-4 text-red-900">Dismiss</button>
        </div>
      )}
    </>
  )
}