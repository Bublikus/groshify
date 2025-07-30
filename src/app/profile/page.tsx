"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Download,
  Eye,
  Key,
  Link,
  Mail,
  Settings,
  Shield,
  Unlink,
  Upload,
  User,
} from "lucide-react";
import { useState } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/ui/typography";
import { CURRENCIES, DATE_FORMATS, LANGUAGES } from "@/constants/app";

// Mock data - in real app this would come from API
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  timezone: "America/New_York",
  preferences: {
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    language: "en",
    notifications: {
      email: true,
      push: true,
      sms: false,
      weeklyReport: true,
      monthlyReport: true,
      spendingAlerts: true,
      budgetReminders: true,
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      marketing: false,
    },
  },
  integrations: [
    {
      id: 1,
      name: "Bank of America",
      type: "bank",
      status: "connected",
      lastSync: "2024-01-15T10:30:00Z",
      icon: "🏦",
    },
    {
      id: 2,
      name: "Chase Bank",
      type: "bank",
      status: "connected",
      lastSync: "2024-01-15T09:15:00Z",
      icon: "🏦",
    },
    {
      id: 3,
      name: "Google Sheets",
      type: "export",
      status: "connected",
      lastSync: "2024-01-14T16:45:00Z",
      icon: "📊",
    },
    {
      id: 4,
      name: "Telegram Bot",
      type: "notification",
      status: "disconnected",
      lastSync: null,
      icon: "🤖",
    },
  ],
};

function ProfileHeader() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle>{mockUser.name}</CardTitle>
            <CardDescription>{mockUser.email}</CardDescription>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">Premium</Badge>
              <Badge variant="outline">Member since Jan 2024</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

function PersonalInformation() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </div>
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={mockUser.name} disabled={!isEditing} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={mockUser.email} disabled={!isEditing} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" defaultValue={mockUser.phone} disabled={!isEditing} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" defaultValue={mockUser.location} disabled={!isEditing} />
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-2 pt-4">
            <Button>Save Changes</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Preferences() {
  const [currency, setCurrency] = useState(mockUser.preferences.currency);
  const [dateFormat, setDateFormat] = useState(mockUser.preferences.dateFormat);
  const [language, setLanguage] = useState(mockUser.preferences.language);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Preferences
        </CardTitle>
        <CardDescription>Customize your app experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CURRENCIES).map(([code, currency]) => (
                  <SelectItem key={code} value={code}>
                    {currency.symbol} {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFormat">Date Format</Label>
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DATE_FORMATS).map(([format, label]) => (
                  <SelectItem key={format} value={format}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LANGUAGES).map(([code, lang]) => (
                  <SelectItem key={code} value={code}>
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div>
          <Typography variant="small" className="font-medium mb-3">
            Notifications
          </Typography>
          <div className="space-y-3">
            {Object.entries(mockUser.preferences.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <Typography variant="small" className="font-medium">
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground">
                    Receive {key.replace(/([A-Z])/g, " $1").toLowerCase()} notifications
                  </Typography>
                </div>
                <Switch defaultChecked={value} />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <Typography variant="small" className="font-medium mb-3">
            Privacy & Data
          </Typography>
          <div className="space-y-3">
            {Object.entries(mockUser.preferences.privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <Typography variant="small" className="font-medium">
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground">
                    Allow {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </Typography>
                </div>
                <Switch defaultChecked={value} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Integrations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Integrations
        </CardTitle>
        <CardDescription>Connect your accounts and services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockUser.integrations.map((integration) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{integration.icon}</div>
                <div>
                  <Typography variant="small" className="font-medium">
                    {integration.name}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground">
                    {integration.type} • {integration.status}
                  </Typography>
                  {integration.lastSync && (
                    <Typography variant="small" className="text-muted-foreground">
                      Last sync: {new Date(integration.lastSync).toLocaleDateString()}
                    </Typography>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {integration.status === "connected" ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <Button variant="outline" size="sm">
                      <Unlink className="h-4 w-4 mr-1" />
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <Button size="sm">
                      <Link className="h-4 w-4 mr-1" />
                      Connect
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          ))}

          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Typography variant="small" className="text-muted-foreground mb-2">
              Add more integrations
            </Typography>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm">
                <CreditCard className="h-4 w-4 mr-1" />
                Connect Bank
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Import Data
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-1" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Security() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security
        </CardTitle>
        <CardDescription>Manage your account security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-muted-foreground" />
              <div>
                <Typography variant="small" className="font-medium">
                  Password
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  Last changed 30 days ago
                </Typography>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <Typography variant="small" className="font-medium">
                  Two-Factor Authentication
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  Add an extra layer of security
                </Typography>
              </div>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <div>
                <Typography variant="small" className="font-medium">
                  Login History
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  View recent login activity
                </Typography>
              </div>
            </div>
            <Button variant="outline" size="sm">
              View History
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DataManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Data Management
        </CardTitle>
        <CardDescription>Export, import, or delete your data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 border rounded-lg">
            <Typography variant="small" className="font-medium mb-2">
              Export Data
            </Typography>
            <Typography variant="small" className="text-muted-foreground mb-3">
              Download all your financial data in various formats
            </Typography>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                CSV
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                JSON
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <Typography variant="small" className="font-medium mb-2">
              Import Data
            </Typography>
            <Typography variant="small" className="text-muted-foreground mb-3">
              Import transactions from external sources
            </Typography>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-1" />
                CSV
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-1" />
                Excel
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <Typography variant="small" className="font-medium text-red-800 mb-2">
            Danger Zone
          </Typography>
          <Typography variant="small" className="text-red-700 mb-3">
            These actions cannot be undone. Please be careful.
          </Typography>
          <div className="flex gap-2">
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
            <Button variant="outline" size="sm">
              Clear All Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <Typography variant="h1">Profile & Settings</Typography>
          <Typography variant="muted">
            Manage your account, preferences, and integrations.
          </Typography>
        </div>

        {/* Profile Header */}
        <ProfileHeader />

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <PersonalInformation />
            <Preferences />
            <Security />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Integrations />
            <DataManagement />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
