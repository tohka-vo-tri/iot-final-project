"use client"

import axios from "axios"
import { format } from "date-fns"
import {
    ArrowDownIcon,
    ArrowUpIcon,
    CarIcon as CaretSortIcon,
    ChevronLeft,
    ChevronRight,
    Fingerprint,
    Tag,
} from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AccessLog {
    id: string
    userId: string
    timeStamp: string
    method: "RFID" | "FINGERPRINT" | "KEY"
}

type SortConfig = {
    key: keyof AccessLog
    direction: "asc" | "desc"
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function AccessLogsTable() {
    const [logs, setLogs] = useState<AccessLog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [sort, setSort] = useState<SortConfig>({
        key: "timeStamp",
        direction: "desc",
    })
    const [searchUserId, setSearchUserId] = useState("")

    const itemsPerPage = 10
    const totalPages = Math.max(1, Math.ceil(logs.length / itemsPerPage))

    // Fetch logs only on initial mount
    useEffect(() => {
        fetchLogs()
    }, [])

    const fetchLogs = async (userId?: string) => {
        try {
            setIsLoading(true)
            const url = userId
                ? `${baseUrl}/history/${userId}` 
                : `${baseUrl}/history` 
            const response = await axios.get<{ allHistory: AccessLog[] }>(url)
            setLogs(response.data.allHistory ?? [])
            console.log("Fetched logs:", response.data.allHistory)
        } catch (error) {
            console.error("Error fetching logs:", error)
            setLogs([])
        } finally {
            setIsLoading(false)
        }
    }
    

    const handleSearch = () => {
        fetchLogs(searchUserId) // Trigger fetch with current searchUserId
        setCurrentPage(1) // Reset to first page
    }

    const sortData = (data: AccessLog[], sortConfig: SortConfig) => {
        return [...data].sort((a, b) => {
            if (sortConfig.key === "timeStamp") {
                const dateA = new Date(a[sortConfig.key])
                const dateB = new Date(b[sortConfig.key])
                return sortConfig.direction === "asc" 
                    ? dateA.getTime() - dateB.getTime() 
                    : dateB.getTime() - dateA.getTime()
            }

            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1
            return 0
        })
    }

    const handleSort = (key: keyof AccessLog) => {
        setSort((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }))
        setCurrentPage(1)
    }

    const getSortIcon = (key: keyof AccessLog) => {
        if (sort.key !== key) return <CaretSortIcon className="ml-2 h-4 w-4" />
        return sort.direction === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
        ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
        )
    }

    const sortedData = sortData(logs, sort)
    const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Access Logs</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Search Input and Button */}
                <div className="mb-4 flex gap-2">
                    <Input
                        placeholder="Search by User ID"
                        value={searchUserId}
                        onChange={(e) => setSearchUserId(e.target.value)}
                        className="max-w-sm"
                    />
                    <Button onClick={handleSearch}>Search</Button>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 data-[state=open]:bg-accent">
                                                        User ID
                                                        {getSortIcon("userId")}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start">
                                                    <DropdownMenuItem onClick={() => handleSort("userId")}>
                                                        Sort {sort.key === "userId" && sort.direction === "asc" ? "Descending" : "Ascending"}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableHead>
                                        <TableHead>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 data-[state=open]:bg-accent">
                                                        Time
                                                        {getSortIcon("timeStamp")}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start">
                                                    <DropdownMenuItem onClick={() => handleSort("timeStamp")}>
                                                        Sort {sort.key === "timeStamp" && sort.direction === "asc" ? "Descending" : "Ascending"}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableHead>
                                        <TableHead>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 data-[state=open]:bg-accent">
                                                        Method
                                                        {getSortIcon("method")}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start">
                                                    <DropdownMenuItem onClick={() => handleSort("method")}>
                                                        Sort {sort.key === "method" && sort.direction === "asc" ? "Descending" : "Ascending"}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center">
                                                {searchUserId ? "No logs found for this User ID" : "No logs available"}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedData.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell>{log.userId || "Unknown"}</TableCell>
                                                <TableCell>{log.timeStamp ? format(new Date(log.timeStamp), "PPpp") : "N/A"}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {log.method === "RFID" ? (
                                                            <Tag className="h-4 w-4" />
                                                        ) : (
                                                            <Fingerprint className="h-4 w-4" />
                                                        )}
                                                        {log.method || "Unknown"}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="h-8 w-8"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                    </PaginationItem>

                                    {[...Array(totalPages)].map((_, i) => {
                                        const page = i + 1
                                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                            return (
                                                <PaginationItem key={page}>
                                                    <Button
                                                        variant={currentPage === page ? "default" : "outline"}
                                                        size="icon"
                                                        onClick={() => setCurrentPage(page)}
                                                        className="h-8 w-8"
                                                    >
                                                        {page}
                                                    </Button>
                                                </PaginationItem>
                                            )
                                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )
                                        }
                                        return null
                                    })}

                                    <PaginationItem>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="h-8 w-8"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}