"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member?: any;
}

export function MemberModal({ isOpen, onClose, member }: MemberModalProps) {
  const [formData, setFormData] = useState({
    // Required fields
    firstName: "",
    lastName: "",
    gender: "",
    dobMonth: "",
    dobDay: "",
    phone: "",
    address: "",

    // Optional fields
    dobYear: "",
    email: "",
    contactPerson: "",
    city: "",
    country: "",
    familyId: "",
    occupation: "",
    maritalStatus: "single",
    membershipStatus: "visitor",
    isBaptised: false,
    baptismDate: "",
    baptismLocation: "",
    baptismChurch: "",
    ministry: "",
    profilePhoto: "",
    notes: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (member) {
      setFormData({
        firstName: member.firstName || "",
        lastName: member.lastName || "",
        gender: member.gender || "",
        dobMonth: member.dobMonth || "",
        dobDay: member.dobDay || "",
        phone: member.phone || "",
        address: member.address || "",
        dobYear: member.dobYear || "",
        email: member.email || "",
        contactPerson: member.contactPerson || "",
        city: member.city || "",
        country: member.country || "",
        familyId: member.familyId || "",
        occupation: member.occupation || "",
        maritalStatus: member.maritalStatus || "single",
        membershipStatus: member.membershipStatus || "visitor",
        isBaptised: member.isBaptised || false,
        baptismDate: member.baptismDate || "",
        baptismLocation: member.baptismLocation || "",
        baptismChurch: member.baptismChurch || "",
        ministry: member.ministry || "",
        profilePhoto: member.profilePhoto || "",
        notes: member.notes || "",
      });
      setImagePreview(member.profilePhoto || null);
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        gender: "",
        dobMonth: "",
        dobDay: "",
        phone: "",
        address: "",
        dobYear: "",
        email: "",
        contactPerson: "",
        city: "",
        country: "",
        familyId: "",
        occupation: "",
        maritalStatus: "single",
        membershipStatus: "visitor",
        isBaptised: false,
        baptismDate: "",
        baptismLocation: "",
        baptismChurch: "",
        ministry: "",
        profilePhoto: "",
        notes: "",
      });
      setImagePreview(null);
    }
  }, [member, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, profilePhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{member ? "Edit Member" : "Add New Member"}</DialogTitle>
          <DialogDescription>
            {member
              ? "Update member information"
              : "Add a new member to the church directory"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={imagePreview || "/placeholder.svg?height=96&width=96"}
                  alt="Profile"
                />
                <AvatarFallback>
                  {formData.firstName && formData.lastName
                    ? formData.firstName[0] + formData.lastName[0]
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0">
                <Label htmlFor="picture" className="cursor-pointer">
                  <div className="rounded-full bg-primary p-1 text-primary-foreground">
                    <Upload className="h-4 w-4" />
                  </div>
                </Label>
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Required Fields Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Personal Information <span className="text-destructive">*</span>
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">
                      Gender <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        setFormData({ ...formData, gender: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Select
                      value={formData.maritalStatus}
                      onValueChange={(value) =>
                        setFormData({ ...formData, maritalStatus: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dobMonth">
                      Birth Month <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.dobMonth}
                      onValueChange={(value) =>
                        setFormData({ ...formData, dobMonth: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="January">January</SelectItem>
                        <SelectItem value="February">February</SelectItem>
                        <SelectItem value="March">March</SelectItem>
                        <SelectItem value="April">April</SelectItem>
                        <SelectItem value="May">May</SelectItem>
                        <SelectItem value="June">June</SelectItem>
                        <SelectItem value="July">July</SelectItem>
                        <SelectItem value="August">August</SelectItem>
                        <SelectItem value="September">September</SelectItem>
                        <SelectItem value="October">October</SelectItem>
                        <SelectItem value="November">November</SelectItem>
                        <SelectItem value="December">December</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dobDay">
                      Birth Day <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="dobDay"
                      type="number"
                      min="1"
                      max="31"
                      placeholder="DD"
                      value={formData.dobDay}
                      onChange={(e) =>
                        setFormData({ ...formData, dobDay: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dobYear">Birth Year (Optional)</Label>
                    <Input
                      id="dobYear"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      placeholder="YYYY"
                      value={formData.dobYear}
                      onChange={(e) =>
                        setFormData({ ...formData, dobYear: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Family Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Contact & Family <span className="text-destructive">*</span>
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Address <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Street address"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City (Optional)</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country (Optional)</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPerson">
                    Emergency Contact Person (Optional)
                  </Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactPerson: e.target.value,
                      })
                    }
                    placeholder="Name of emergency contact"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="familyId">Family ID (Optional)</Label>
                  <Input
                    id="familyId"
                    value={formData.familyId}
                    onChange={(e) =>
                      setFormData({ ...formData, familyId: e.target.value })
                    }
                    placeholder="Link to family records"
                  />
                </div>
              </div>
            </div>

            {/* Church Information - Optional */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Church Information{" "}
                <span className="text-muted-foreground text-sm">
                  (Optional)
                </span>
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="membershipStatus">Membership Status</Label>
                  <Select
                    value={formData.membershipStatus}
                    onValueChange={(value) =>
                      setFormData({ ...formData, membershipStatus: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visitor">Visitor</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation (Optional)</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) =>
                      setFormData({ ...formData, occupation: e.target.value })
                    }
                    placeholder="Member's occupation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ministry">Ministry (Optional)</Label>
                  <Input
                    id="ministry"
                    value={formData.ministry}
                    onChange={(e) =>
                      setFormData({ ...formData, ministry: e.target.value })
                    }
                    placeholder="Ministry or group involvement"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Additional notes about the member"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Baptism Information - Optional */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Baptism Information{" "}
                <span className="text-muted-foreground text-sm">
                  (Optional)
                </span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isBaptised"
                    checked={formData.isBaptised}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        isBaptised: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="isBaptised">Member is baptized</Label>
                </div>

                {formData.isBaptised && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="baptismDate">Baptism Date</Label>
                      <Input
                        id="baptismDate"
                        type="date"
                        value={formData.baptismDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            baptismDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="baptismLocation">Baptism Location</Label>
                      <Input
                        id="baptismLocation"
                        value={formData.baptismLocation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            baptismLocation: e.target.value,
                          })
                        }
                        placeholder="Church or location where baptized"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="baptismChurch">
                        Baptizing Church (Optional)
                      </Label>
                      <Input
                        id="baptismChurch"
                        value={formData.baptismChurch}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            baptismChurch: e.target.value,
                          })
                        }
                        placeholder="Church where baptism occurred"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {member ? "Update Member" : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
