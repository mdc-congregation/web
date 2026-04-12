"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle2, Loader2, ShieldPlus } from "lucide-react"
import { registerUser, type AuthUser, getAuthUser } from "@/utils/auth"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type CreatedUser = {
  id: string
  firstname: string
  lastname: string
  email: string
  phone?: string
}

const initialFormState = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
}

export function UserSettings() {
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [createdUsers, setCreatedUsers] = useState<CreatedUser[]>([])
  const [formData, setFormData] = useState(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setCurrentUser(getAuthUser())
  }, [])

  const handleChange = (field: keyof typeof initialFormState, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      const message = "Passwords do not match."
      setError(message)
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: message,
      })
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await registerUser({
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      })

      const newUser = response.data.user

      setCreatedUsers((prev) => [
        {
          id: String(newUser.id),
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          email: newUser.email,
          phone: newUser.phone,
        },
        ...prev.filter((user) => user.id !== String(newUser.id)),
      ])
      setFormData(initialFormState)

      toast({
        title: "User registered",
        description: `${newUser.firstname} ${newUser.lastname} can now sign in through the API-backed login flow.`,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed."
      setError(message)
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>Create Dashboard User</CardTitle>
          <CardDescription>
            Register users from inside the dashboard using the API `POST /register` endpoint.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstname">First name</Label>
                <Input
                  id="firstname"
                  value={formData.firstname}
                  onChange={(event) => handleChange("firstname", event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Last name</Label>
                <Input
                  id="lastname"
                  value={formData.lastname}
                  onChange={(event) => handleChange("lastname", event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(event) => handleChange("phone", event.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(event) => handleChange("password", event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(event) => handleChange("confirmPassword", event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground">
              The current API registration service assigns new users the default <strong>admin</strong> role.
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <ShieldPlus className="mr-2 h-4 w-4" />
                    Register User
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Session</CardTitle>
            <CardDescription>The active dashboard session remains in place after user creation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
              <div className="space-y-1">
                <p className="font-medium">
                  {currentUser ? `${currentUser.firstname} ${currentUser.lastname}` : "Authenticated user"}
                </p>
                <p className="text-sm text-muted-foreground">{currentUser?.email ?? "Session loaded from API token"}</p>
              </div>
            </div>
            <Separator />
            <div className="flex flex-wrap gap-2">
              {(currentUser?.roles ?? []).map((role) => (
                <Badge key={role.id} variant="secondary">
                  {role.name}
                </Badge>
              ))}
              {(!currentUser?.roles || currentUser.roles.length === 0) && <Badge variant="outline">No roles loaded</Badge>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recently Created</CardTitle>
            <CardDescription>Users created during this dashboard session.</CardDescription>
          </CardHeader>
          <CardContent>
            {createdUsers.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                No users have been registered from this session yet.
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {createdUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.firstname} {user.lastname}</TableCell>
                        <TableCell>{user.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
