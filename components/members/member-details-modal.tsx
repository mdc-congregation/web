"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Mail, Phone, Home, Users, Church, Award, Calendar } from "lucide-react"
import { formatDate } from "@/utils/date-helpers"

interface MemberDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  member: any
}

export function MemberDetailsModal({ isOpen, onClose, member }: MemberDetailsModalProps) {
  if (!member) return null

  const fullName = `${member.firstName} ${member.lastName}`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Member Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <div className="flex flex-col items-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={member.avatar || "/placeholder.svg?height=128&width=128"} alt={fullName} />
              <AvatarFallback className="text-2xl">
                {member.firstName?.[0]}
                {member.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold mt-4">{fullName}</h2>
            <Badge
              className="mt-2"
              variant={member.status === "active" ? "default" : member.status === "inactive" ? "secondary" : "outline"}
            >
              {member.status}
            </Badge>
          </div>

          <div className="flex-1">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="church">Church</TabsTrigger>
                <TabsTrigger value="contributions">Contributions</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Date of Birth:</span>
                        <span>{member.dateOfBirth ? formatDate(member.dateOfBirth) : "Not specified"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Baptism Status:</span>
                        <span>{member.isBaptized ? "Baptized" : "Not baptized"}</span>
                      </div>

                      {member.isBaptized && (
                        <>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Baptism Date:</span>
                            <span>{formatDate(member.baptismDate)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Church className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Baptism Location:</span>
                            <span>{member.baptismLocation || "Not specified"}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Email:</span>
                      <span>{member.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Phone:</span>
                      <span>{member.phone || "Not specified"}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <Home className="h-4 w-4 text-muted-foreground mt-1" />
                      <span className="font-medium">Address:</span>
                      <span>{member.address || "Not specified"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Family:</span>
                      <span>{member.family || "Not specified"}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="church" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Church Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Join Date:</span>
                        <span>{member.joinDate ? formatDate(member.joinDate) : "Not specified"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Church className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Ministry:</span>
                        <span>{member.ministry || "Not assigned"}</span>
                      </div>
                    </div>

                    {member.notes && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Notes:</h4>
                        <p className="text-sm text-muted-foreground">{member.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contributions" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tithes & Contributions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {member.contributions && member.contributions.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Total This Year</p>
                            <p className="text-2xl font-bold">${member.yearlyTotal || "0.00"}</p>
                          </div>
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Last Contribution</p>
                            <p className="text-2xl font-bold">${member.lastContribution?.amount || "0.00"}</p>
                            <p className="text-xs text-muted-foreground">
                              {member.lastContribution?.date ? formatDate(member.lastContribution.date) : "N/A"}
                            </p>
                          </div>
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Monthly Average</p>
                            <p className="text-2xl font-bold">${member.monthlyAverage || "0.00"}</p>
                          </div>
                        </div>

                        <h4 className="font-medium mt-6 mb-2">Recent Contributions</h4>
                        <div className="space-y-2">
                          {member.contributions.map((contribution: any, index: number) => (
                            <div key={index} className="flex justify-between items-center border-b pb-2">
                              <div>
                                <p className="font-medium">${contribution.amount}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(contribution.date)}</p>
                              </div>
                              <Badge variant="outline">{contribution.type}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">No contribution records found</div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
