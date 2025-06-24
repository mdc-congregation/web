"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, MessageSquare } from "lucide-react"

interface SMSCreditsModalProps {
  isOpen: boolean
  onClose: () => void
}

const creditPackages = [
  { id: "100", credits: 100, price: 10, popular: false },
  { id: "500", credits: 500, price: 45, popular: true },
  { id: "1000", credits: 1000, price: 85, popular: false },
  { id: "2500", credits: 2500, price: 200, popular: false },
  { id: "5000", credits: 5000, price: 375, popular: false },
]

export function SMSCreditsModal({ isOpen, onClose }: SMSCreditsModalProps) {
  const [selectedPackage, setSelectedPackage] = useState("500")
  const [paymentMethod, setPaymentMethod] = useState("card")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("SMS credits purchase:", { selectedPackage, paymentMethod })
    onClose()
  }

  const selectedPkg = creditPackages.find((pkg) => pkg.id === selectedPackage)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Buy SMS Credits</DialogTitle>
          <DialogDescription>Purchase SMS credits to send messages to your members</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Current Balance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Current Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2,450 Credits</div>
                <p className="text-sm text-muted-foreground">Approximately 2,450 SMS messages</p>
              </CardContent>
            </Card>

            {/* Package Selection */}
            <div className="space-y-4">
              <Label>Select Credit Package</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {creditPackages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={`cursor-pointer transition-colors relative ${
                      selectedPackage === pkg.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {pkg.popular && <Badge className="absolute -top-2 left-4">Most Popular</Badge>}
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{pkg.credits.toLocaleString()} Credits</CardTitle>
                      <CardDescription>${pkg.price}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        ${(pkg.price / pkg.credits).toFixed(3)} per SMS
                      </div>
                      {pkg.credits >= 500 && (
                        <div className="text-sm text-green-600 font-medium">
                          Save {Math.round((1 - pkg.price / pkg.credits / 0.12) * 100)}%
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Details */}
            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input id="expiryDate" placeholder="MM/YY" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input id="cardName" placeholder="John Doe" required />
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{selectedPkg?.credits.toLocaleString()} SMS Credits</span>
                    <span>${selectedPkg?.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Processing Fee</span>
                    <span>$2.00</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>${selectedPkg ? selectedPkg.price + 2 : 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Purchase Credits - ${selectedPkg ? selectedPkg.price + 2 : 0}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
