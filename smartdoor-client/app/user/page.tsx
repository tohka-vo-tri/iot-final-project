"use client"

import { useEffect,useState } from "react"
import { Fingerprint, Plus, Tag, Trash2, X } from 'lucide-react'
import axios from "axios";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

interface UserData {
  name: string
  rfid: string | null
  fingerprint: string | null
}

export default function UserDetailPage() {
  const [userData, setUserData] = useState<UserData>({
    name: "John Doe",
    rfid: null,
    fingerprint: null,
  })
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/user");
        setUserData(response.data);
      } catch (err) {
        setError("Failed to fetch user data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  const [isRFIDDialogOpen, setIsRFIDDialogOpen] = useState(false)
  const [isFingerprintDialogOpen, setIsFingerprintDialogOpen] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    type: "rfid" | "fingerprint" | null
  }>({
    isOpen: false,
    type: null,
  })

  const [newRFID, setNewRFID] = useState("")
  const [newFingerprint, setNewFingerprint] = useState("")

  const handleAddRFID = () => {
    setUserData(prev => ({ ...prev, rfid: newRFID }))
    setNewRFID("")
    setIsRFIDDialogOpen(false)
  }

  const handleAddFingerprint = async () => {
    try {
      const response = await axios.post("http://localhost:8080/user/add-fingerprint", {
        fingerprint: newFingerprint,
      });
  
      if (response.status === 200) {
        setUserData((prev) => ({ ...prev, fingerprint: newFingerprint }));
        setNewFingerprint("");
        setIsFingerprintDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to add fingerprint:", error);
    }
  };
  
  const handleDelete = async (type: "rfid" | "fingerprint") => {
    try {
      const response = await axios.delete(`http://localhost:8080/user/delete-${type}`);
  
      if (response.status === 200) {
        setUserData((prev) => ({ ...prev, [type]: null }));
        setDeleteDialog({ isOpen: false, type: null });
      }
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={userData.name}
              onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          {/* RFID Field */}
          <div className="space-y-2">
            <Label>RFID Card</Label>
            <div className="flex items-center gap-2">
              {userData.rfid ? (
                <div className="flex-1 flex items-center gap-2 p-2 bg-muted rounded-md">
                  <Tag className="h-4 w-4" />
                  <span className="flex-1">{userData.rfid}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setDeleteDialog({ isOpen: true, type: "rfid" })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsRFIDDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add RFID Card
                </Button>
              )}
            </div>
          </div>

          {/* Fingerprint Field */}
          <div className="space-y-2">
            <Label>Fingerprint</Label>
            <div className="flex items-center gap-2">
              {userData.fingerprint ? (
                <div className="flex-1 flex items-center gap-2 p-2 bg-muted rounded-md">
                  <Fingerprint className="h-4 w-4" />
                  <span className="flex-1">{userData.fingerprint}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setDeleteDialog({ isOpen: true, type: "fingerprint" })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsFingerprintDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Fingerprint
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RFID Dialog */}
      <Dialog open={isRFIDDialogOpen} onOpenChange={setIsRFIDDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add RFID Card</DialogTitle>
            <DialogDescription>
              Please scan your RFID card or enter the card number manually.
            </DialogDescription>
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
            <DialogDescription>
              Please scan your fingerprint or enter the fingerprint ID manually.
            </DialogDescription>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={deleteDialog.isOpen} 
        onOpenChange={(isOpen) => setDeleteDialog({ isOpen, type: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the {deleteDialog.type === "rfid" ? "RFID card" : "fingerprint"} 
              from your profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteDialog.type && handleDelete(deleteDialog.type)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
