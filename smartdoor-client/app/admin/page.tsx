import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDefaultPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Welcome to Admin Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400">
            Select an option from the sidebar to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
