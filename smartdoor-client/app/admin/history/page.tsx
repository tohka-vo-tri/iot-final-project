"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HistoryLog {
  _id: string;
  roomId: string;
  nameRoom: string;
  deviceId: string;
  nameDevice: string;
  nameUser: string;
  action: "open" | "close" | "sign_password";
  timeStamp: Date | string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AccessLogsTable() {
  // Existing state
  const [history, setHistory] = useState<HistoryLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state for pagination, sorting, and searching
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Fixed at 10, can be made configurable
  const [sortField, setSortField] = useState<keyof HistoryLog>("timeStamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data (unchanged)
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [historyResponse] = await Promise.all([
        axios.get<{ allHistory: HistoryLog[] }>(`${baseUrl}/logs/getall`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
      ]);
      const historyData = Array.isArray(historyResponse.data.allHistory)
        ? historyResponse.data.allHistory
        : [];
      setHistory(historyData);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter data based on search term
  const filteredHistory = history.filter((log) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      log.roomId.toLowerCase().includes(searchLower) ||
      log.nameRoom.toLowerCase().includes(searchLower) ||
      log.deviceId.toLowerCase().includes(searchLower) ||
      log.nameDevice.toLowerCase().includes(searchLower) ||
      log.nameUser.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower)
    );
  });

  // Sort filtered data
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortField === "timeStamp") {
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      return sortOrder === "asc"
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortOrder === "asc" ? (aValue > bValue ? 1 : -1) : (bValue > aValue ? 1 : -1);
  });

  // Paginate sorted data
  const totalItems = sortedHistory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedHistory.slice(startIndex, endIndex);

  // Handle sorting when clicking table headers
  const handleSort = (field: keyof HistoryLog) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to first page on sort change
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search Input */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>

        {/* Loading/Error/No Data States */}
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-destructive">{error}</p>}
        {!isLoading && !error && history.length === 0 && (
          <p>No history records found.</p>
        )}

        {/* Table */}
        {currentItems.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    onClick={() => handleSort("roomId")}
                    className="cursor-pointer"
                  >
                    Room ID {sortField === "roomId" && (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("nameRoom")}
                    className="cursor-pointer"
                  >
                    Room Name {sortField === "nameRoom" && (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("deviceId")}
                    className="cursor-pointer"
                  >
                    Device Data {sortField === "deviceId" && (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("nameDevice")}
                    className="cursor-pointer"
                  >
                    Auth Method {sortField === "nameDevice" && (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("nameUser")}
                    className="cursor-pointer"
                  >
                    User Name {sortField === "nameUser" && (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("action")}
                    className="cursor-pointer"
                  >
                    Action {sortField === "action" && (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("timeStamp")}
                    className="cursor-pointer"
                  >
                    Timestamp {sortField === "timeStamp" && (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>{log.roomId}</TableCell>
                    <TableCell>{log.nameRoom}</TableCell>
                    <TableCell>
                      {log.nameDevice === "Password" ? "**********************" : log.deviceId}
                    </TableCell>
                    <TableCell>{log.nameDevice}</TableCell>
                    <TableCell>{log.nameUser}</TableCell>
                    <TableCell className="capitalize">{log.action}</TableCell>
                    <TableCell>
                      {new Date(log.timeStamp).toLocaleDateString()}{" "}
                      {new Date(log.timeStamp).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-between items-center">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}