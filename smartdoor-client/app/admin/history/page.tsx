"use client"

import axios from "axios"
import { useEffect, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function AccessLogsTable() {
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
      const [history, setHistory] = useState<HistoryLog[]>([])
      const [isLoading, setIsLoading] = useState(false)
      const [error, setError] = useState<string | null>(null)
      const fetchData = async () => {
        setIsLoading(true)
        try {
          const [historyResponse] = await Promise.all([

            axios.get<{ allHistory: HistoryLog[] }>(`${baseUrl}/logs/getall`)
          ])
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