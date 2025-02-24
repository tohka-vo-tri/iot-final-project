"use client"

import axios from "axios"
import { Fingerprint, Lock, Plus, Tag, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Device {
  id: string;
  name: string;
  rfid?: string;
  fingerprint?: string;
  password?: string; // Add Password Property
}

interface UserData {
  id: string
  email: string
  name: string
  devices: Device[]
}

export default function UserDetailPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)

  // Dialog states
  const [isNewDeviceDialogOpen, setIsNewDeviceDialogOpen] = useState(false)
  const [isDeviceDetailsDialogOpen, setIsDeviceDetailsDialogOpen] = useState(false); // New Dialog
  const [isRFIDDialogOpen, setIsRFIDDialogOpen] = useState(false)
  const [isFingerprintDialogOpen, setIsFingerprintDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false) //Password Dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    type: "rfid" | "fingerprint" | "password" | null  //Password
    deviceId?: string
  }>({
    isOpen: false,
    type: null,
  })
  const [token, setToken] = useState<string | null>(null)

  // Form states
  const [newDeviceName, setNewDeviceName] = useState("")
  const [newRFID, setNewRFID] = useState("")
  const [newFingerprint, setNewFingerprint] = useState("")
  const [newPassword, setNewPassword] = useState("") //Password

  

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token")
      setToken(storedToken)
    }
    
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserData()
    }
  }, [token])

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUserData(response.data)
    } catch (err) {
      setError("Failed to fetch user data.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDevice = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/devices/init-device`,
        { name: newDeviceName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setUserData((prev) =>
        prev
          ? {
              ...prev,
              devices: [...prev.devices, response.data],
            }
          : null,
      )

      setNewDeviceName("")
      setIsNewDeviceDialogOpen(false)
    } catch (error) {
      console.error("Failed to create device:", error)
    }
  }

  const handleAddRFID = async () => {
    if (!selectedDevice) return

    try {
      const response = await axios.post(
        `${baseUrl}/devices/${selectedDevice.id}/rfid`,
        { rfid: newRFID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setUserData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          devices: prev.devices.map((device) =>
            device.id === selectedDevice.id ? { ...device, rfid: newRFID } : device,
          ),
        }
      })

      setNewRFID("")
      setIsRFIDDialogOpen(false)
       setIsDeviceDetailsDialogOpen(true); // Re-open the device details dialog after the update.
    } catch (error) {
      console.error("Failed to add RFID:", error)
    }
  }

  const handleAddFingerprint = async () => {
    if (!selectedDevice) return

    try {
      const response = await axios.post(
        `${baseUrl}/devices/${selectedDevice.id}/fingerprint`,
        { fingerprint: newFingerprint },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setUserData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          devices: prev.devices.map((device) =>
            device.id === selectedDevice.id ? { ...device, fingerprint: newFingerprint } : device,
          ),
        }
      })

      setNewFingerprint("")
      setIsFingerprintDialogOpen(false)
       setIsDeviceDetailsDialogOpen(true); // Re-open the device details dialog after the update.
    } catch (error) {
      console.error("Failed to add fingerprint:", error)
    }
  }

   //Password Function
    const handleAddPassword = async () => {
        if (!selectedDevice) return;

        try {
            const response = await axios.post(
                `${baseUrl}/devices/${selectedDevice.id}/password`, // Replace with your actual API endpoint
                { password: newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUserData((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    devices: prev.devices.map((device) =>
                        device.id === selectedDevice.id ? { ...device, password: newPassword } : device
                    ),
                };
            });

            setNewPassword("");
            setIsPasswordDialogOpen(false);
            setIsDeviceDetailsDialogOpen(true); // Re-open the device details dialog after the update.
        } catch (error) {
            console.error("Failed to add password:", error);
        }
    };

  const handleDelete = async (deviceId: string, type: "rfid" | "fingerprint" | "password") => { //Password
    try {
      await axios.delete(`${baseUrl}/devices/${deviceId}/${type}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setUserData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          devices: prev.devices.map((device) => (device.id === deviceId ? { ...device, [type]: undefined } : device)),
        }
      })

      setDeleteDialog({ isOpen: false, type: null })
      setIsDeviceDetailsDialogOpen(true); // Re-open the device details dialog after the update.
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error)
    }
  }

  if (loading) return <div className="text-center mt-10">Loading...</div>
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>
  if (!userData) return <div className="text-center mt-10">No user data found</div>

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">User Profile</CardTitle>
          <Button variant="outline" onClick={() => setIsNewDeviceDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={userData.name} disabled />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={userData.email} disabled />
          </div>

          {/* Devices */}
          <div className="space-y-2">
            <Label>Devices</Label>
            <Accordion type="single" collapsible className="w-full">
              {userData.devices.map((device) => (
                <AccordionItem key={device.id} value={device.id}>
                  <AccordionTrigger onClick={() => {
                      setSelectedDevice(device);
                      setIsDeviceDetailsDialogOpen(true);
                  }}>
                    {device.name}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </CardContent>
      </Card>

      {/* New Device Dialog */}
      <Dialog open={isNewDeviceDialogOpen} onOpenChange={setIsNewDeviceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogDescription>Enter a name for your new device.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deviceName">Device Name</Label>
              <Input
                id="deviceName"
                placeholder="Enter device name"
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewDeviceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDevice} disabled={!newDeviceName}>
              Create Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Device Details Dialog */}
      <Dialog open={isDeviceDetailsDialogOpen} onOpenChange={setIsDeviceDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedDevice?.name || "Device Details"}</DialogTitle>
            <DialogDescription>Manage RFID, Fingerprint, and Password for this device.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">

            {/* RFID Management */}
            <div className="space-y-2">
              <Label>RFID Card</Label>
              <div className="flex items-center gap-2">
                {selectedDevice?.rfid ? (
                  <div className="flex-1 flex items-center gap-2 p-2 bg-muted rounded-md">
                    <Tag className="h-4 w-4" />
                    <span className="flex-1">{selectedDevice.rfid}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() =>
                        setDeleteDialog({
                          isOpen: true,
                          type: "rfid",
                          deviceId: selectedDevice.id,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsDeviceDetailsDialogOpen(false);
                      setIsRFIDDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add RFID Card
                  </Button>
                )}
              </div>
            </div>

            {/* Fingerprint Management */}
            <div className="space-y-2">
              <Label>Fingerprint</Label>
              <div className="flex items-center gap-2">
                {selectedDevice?.fingerprint ? (
                  <div className="flex-1 flex items-center gap-2 p-2 bg-muted rounded-md">
                    <Fingerprint className="h-4 w-4" />
                    <span className="flex-1">{selectedDevice.fingerprint}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() =>
                        setDeleteDialog({
                          isOpen: true,
                          type: "fingerprint",
                          deviceId: selectedDevice.id,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsDeviceDetailsDialogOpen(false);
                      setIsFingerprintDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Fingerprint
                  </Button>
                )}
              </div>
            </div>

               {/* Password Management */}
               <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="flex items-center gap-2">
                        {selectedDevice?.password ? (
                            <div className="flex-1 flex items-center gap-2 p-2 bg-muted rounded-md">
                                <Lock className="h-4 w-4" />
                                <span className="flex-1">{selectedDevice.password}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={() =>
                                        setDeleteDialog({
                                            isOpen: true,
                                            type: "password",
                                            deviceId: selectedDevice.id,
                                        })
                                    }
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setIsDeviceDetailsDialogOpen(false);
                                    setIsPasswordDialogOpen(true);
                                }}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Password
                            </Button>
                        )}
                    </div>
                </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeviceDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RFID Dialog */}
      <Dialog open={isRFIDDialogOpen} onOpenChange={setIsRFIDDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add RFID Card</DialogTitle>
            <DialogDescription>Please scan your RFID card or enter the card number manually.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rfid">RFID Number</Label>
              <Input
                id="rfid"
                placeholder="Enter RFID number"
                value={newRFID}
                onChange={(e) => setNewRFID(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRFIDDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRFID} disabled={!newRFID}>
              Add Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fingerprint Dialog */}
      <Dialog open={isFingerprintDialogOpen} onOpenChange={setIsFingerprintDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Fingerprint</DialogTitle>
            <DialogDescription>Please scan your fingerprint or enter the fingerprint ID manually.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fingerprint">Fingerprint ID</Label>
              <Input
                id="fingerprint"
                placeholder="Enter fingerprint ID"
                value={newFingerprint}
                onChange={(e) => setNewFingerprint(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFingerprintDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFingerprint} disabled={!newFingerprint}>
              Add Fingerprint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

         {/* Password Dialog */}
         <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Password</DialogTitle>
                        <DialogDescription>Enter a password for the device.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddPassword} disabled={!newPassword}>
                            Add Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.isOpen} onOpenChange={(isOpen) => setDeleteDialog({ isOpen, type: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the {deleteDialog.type === "rfid" ? "RFID card" : deleteDialog.type === "fingerprint" ? "fingerprint" : "password"}
              from your device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                deleteDialog.type && deleteDialog.deviceId && handleDelete(deleteDialog.deviceId, deleteDialog.type)
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}