"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Plus,
  Edit,
  Trash2,
  Heart,
  BarChart3,
  Package,
  Users,
  DollarSign,
  Settings,
  Save,
  Phone,
  Mail,
  MessageCircle,
  Loader2,
  Eye,
  TrendingUp,
  Upload,
} from "lucide-react"
import ProtectedRoute from "@/components/auth/protected-route"
import {
  getBusinessSettings,
  updateBusinessSettings,
  getProducts,
  deleteProduct,
  getCategories,
  getLiveAnalytics,
  getProductAnalytics,
  getCategoryAnalytics,
  getAboutContent,
  updateAboutContent,
  type BusinessSettings,
  type Product,
  type AboutContent,
} from "@/lib/database"
import { toast } from "@/hooks/use-toast"
import ProductForm from "@/components/admin/product-form"

function AdminDashboard() {
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null)
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState([])
  const [liveAnalytics, setLiveAnalytics] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalWishlists: 0,
    totalVisits: 0,
    estimatedRevenue: 0,
  })
  const [productAnalytics, setProductAnalytics] = useState<any[]>([])
  const [categoryAnalytics, setCategoryAnalytics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Product management states
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Form states for business settings
  const [settingsForm, setSettingsForm] = useState({
    business_name: "",
    tagline: "",
    description: "",
    phone: "",
    email: "",
    whatsapp: "",
    address: "",
    hero_title: "",
    hero_subtitle: "",
    logo_url: "",
    hero_image: "",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    linkedin_url: "",
  })

  // About content form
  const [aboutForm, setAboutForm] = useState({
    hero_title: "",
    hero_subtitle: "",
    story_title: "",
    story_content: "",
    story_image: "",
    values_title: "",
    values_subtitle: "",
    team_title: "",
    team_subtitle: "",
    contact_title: "",
    contact_subtitle: "",
  })

  useEffect(() => {
    fetchAllData()
    // Refresh analytics every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchAllData = async () => {
    try {
      const [settingsData, aboutData, productsData, categoriesData] = await Promise.all([
        getBusinessSettings(),
        getAboutContent(),
        getProducts(),
        getCategories(),
      ])

      if (settingsData) {
        setBusinessSettings(settingsData)
        setSettingsForm({
          business_name: settingsData.business_name || "",
          tagline: settingsData.tagline || "",
          description: settingsData.description || "",
          phone: settingsData.phone || "",
          email: settingsData.email || "",
          whatsapp: settingsData.whatsapp || "",
          address: settingsData.address || "",
          hero_title: settingsData.hero_title || "",
          hero_subtitle: settingsData.hero_subtitle || "",
          logo_url: settingsData.logo_url || "",
          hero_image: settingsData.hero_image || "",
          facebook_url: settingsData.facebook_url || "",
          instagram_url: settingsData.instagram_url || "",
          twitter_url: settingsData.twitter_url || "",
          linkedin_url: settingsData.linkedin_url || "",
        })
      }

      if (aboutData) {
        setAboutContent(aboutData)
        setAboutForm({
          hero_title: aboutData.hero_title || "",
          hero_subtitle: aboutData.hero_subtitle || "",
          story_title: aboutData.story_title || "",
          story_content: aboutData.story_content || "",
          story_image: aboutData.story_image || "",
          values_title: aboutData.values_title || "",
          values_subtitle: aboutData.values_subtitle || "",
          team_title: aboutData.team_title || "",
          team_subtitle: aboutData.team_subtitle || "",
          contact_title: aboutData.contact_title || "",
          contact_subtitle: aboutData.contact_subtitle || "",
        })
      }

      setProducts(productsData)
      setCategories(categoriesData)

      await fetchAnalytics()
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const [liveData, productData, categoryData] = await Promise.all([
        getLiveAnalytics(),
        getProductAnalytics(),
        getCategoryAnalytics(),
      ])

      setLiveAnalytics(liveData)
      setProductAnalytics(productData)
      setCategoryAnalytics(categoryData)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    }
  }

  const handleUpdateSettings = async (updates: Partial<BusinessSettings>) => {
    setSaving(true)
    try {
      const updatedSettings = await updateBusinessSettings(updates)
      setBusinessSettings(updatedSettings)
      setSettingsForm((prev) => ({ ...prev, ...updates }))

      toast({
        title: "Settings updated",
        description: "Changes will appear across your website",
      })

      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateAbout = async (updates: Partial<AboutContent>) => {
    setSaving(true)
    try {
      const updatedAbout = await updateAboutContent(updates)
      setAboutContent(updatedAbout)
      setAboutForm((prev) => ({ ...prev, ...updates }))

      toast({
        title: "About content updated",
        description: "Changes will appear on your about page",
      })
    } catch (error) {
      console.error("Error updating about content:", error)
      toast({
        title: "Error",
        description: "Failed to update about content",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleProductSuccess = () => {
    setIsAddingProduct(false)
    setEditingProduct(null)
    fetchAllData()
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      await deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
      toast({
        title: "Product deleted",
        description: "Product has been removed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (result) {
        if (field.startsWith("about_")) {
          const aboutField = field.replace("about_", "")
          setAboutForm((prev) => ({ ...prev, [aboutField]: result }))
        } else {
          setSettingsForm((prev) => ({ ...prev, [field]: result }))
        }
      }
    }
    reader.readAsDataURL(file)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-5xl font-black mb-2 uppercase tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg font-medium">Manage your Sanjib Textile business</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-black text-white">
            <TabsTrigger value="overview" className="font-bold uppercase tracking-wide data-[state=active]:bg-red-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="font-bold uppercase tracking-wide data-[state=active]:bg-red-600">
              Products
            </TabsTrigger>
            <TabsTrigger value="business" className="font-bold uppercase tracking-wide data-[state=active]:bg-red-600">
              Business
            </TabsTrigger>
            <TabsTrigger value="about" className="font-bold uppercase tracking-wide data-[state=active]:bg-red-600">
              About Page
            </TabsTrigger>
            <TabsTrigger value="contact" className="font-bold uppercase tracking-wide data-[state=active]:bg-red-600">
              Contact
            </TabsTrigger>
            <TabsTrigger value="analytics" className="font-bold uppercase tracking-wide data-[state=active]:bg-red-600">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="border-2 border-gray-200 hover:border-black transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-black uppercase tracking-wide">Products</CardTitle>
                  <Package className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black">{liveAnalytics.totalProducts}</div>
                  <p className="text-xs text-muted-foreground font-medium">Active inventory</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 hover:border-black transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-black uppercase tracking-wide">Customers</CardTitle>
                  <Users className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black">{liveAnalytics.totalCustomers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground font-medium">Registered users</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 hover:border-black transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-black uppercase tracking-wide">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black">₹{liveAnalytics.estimatedRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground font-medium">Estimated sales</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 hover:border-black transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-black uppercase tracking-wide">Wishlists</CardTitle>
                  <Heart className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black">{liveAnalytics.totalWishlists}</div>
                  <p className="text-xs text-muted-foreground font-medium">Customer interests</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 hover:border-black transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-black uppercase tracking-wide">Visits</CardTitle>
                  <Eye className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black">{liveAnalytics.totalVisits}</div>
                  <p className="text-xs text-muted-foreground font-medium">Website visits</p>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription className="font-medium">
                Live analytics update every 30 seconds. All data reflects real-time customer interactions with your
                website.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black uppercase tracking-tight">Product Management</h2>
              <Button
                onClick={() => setIsAddingProduct(true)}
                className="bg-black hover:bg-red-600 font-bold uppercase tracking-wide"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {isAddingProduct && (
              <ProductForm onSuccess={handleProductSuccess} onCancel={() => setIsAddingProduct(false)} />
            )}

            {editingProduct && (
              <ProductForm
                product={editingProduct}
                onSuccess={handleProductSuccess}
                onCancel={() => setEditingProduct(null)}
              />
            )}

            {!isAddingProduct && !editingProduct && (
              <Card className="border-2 border-gray-200">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-black uppercase">Product</TableHead>
                        <TableHead className="font-black uppercase">Category</TableHead>
                        <TableHead className="font-black uppercase">Price</TableHead>
                        <TableHead className="font-black uppercase">Stock</TableHead>
                        <TableHead className="font-black uppercase">Status</TableHead>
                        <TableHead className="font-black uppercase">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="flex items-center gap-3">
                            <img
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <span className="font-medium">{product.name}</span>
                          </TableCell>
                          <TableCell className="font-medium">{product.category}</TableCell>
                          <TableCell className="font-bold">₹{product.price}</TableCell>
                          <TableCell className="font-medium">{product.stock}</TableCell>
                          <TableCell>
                            <Badge variant={product.is_active ? "default" : "destructive"} className="font-bold">
                              {product.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingProduct(product)}
                                className="border-2 hover:border-black"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="border-2 hover:border-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Business Settings Tab */}
          <TabsContent value="business" className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight">Business Settings</h2>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="font-black uppercase tracking-wide">Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="business-name" className="font-bold">
                      Business Name
                    </Label>
                    <Input
                      id="business-name"
                      value={settingsForm.business_name}
                      onChange={(e) => setSettingsForm((prev) => ({ ...prev, business_name: e.target.value }))}
                      className="border-2 border-gray-200 focus:border-black font-medium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagline" className="font-bold">
                      Tagline
                    </Label>
                    <Input
                      id="tagline"
                      value={settingsForm.tagline}
                      onChange={(e) => setSettingsForm((prev) => ({ ...prev, tagline: e.target.value }))}
                      className="border-2 border-gray-200 focus:border-black font-medium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="font-bold">
                      About Description
                    </Label>
                    <Textarea
                      id="description"
                      rows={3}
                      value={settingsForm.description}
                      onChange={(e) => setSettingsForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="border-2 border-gray-200 focus:border-black font-medium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="font-bold">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm((prev) => ({ ...prev, address: e.target.value }))}
                      className="border-2 border-gray-200 focus:border-black font-medium"
                    />
                  </div>
                  <Button
                    onClick={() =>
                      handleUpdateSettings({
                        business_name: settingsForm.business_name,
                        tagline: settingsForm.tagline,
                        description: settingsForm.description,
                        address: settingsForm.address,
                      })
                    }
                    disabled={saving}
                    className="bg-black hover:bg-red-600 font-bold uppercase tracking-wide"
                  >
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Update Business Info
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="font-black uppercase tracking-wide">Hero Section & Branding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="hero-title" className="font-bold">
                      Hero Title
                    </Label>
                    <Input
                      id="hero-title"
                      value={settingsForm.hero_title}
                      onChange={(e) => setSettingsForm((prev) => ({ ...prev, hero_title: e.target.value }))}
                      className="border-2 border-gray-200 focus:border-black font-medium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-subtitle" className="font-bold">
                      Hero Subtitle
                    </Label>
                    <Textarea
                      id="hero-subtitle"
                      rows={3}
                      value={settingsForm.hero_subtitle}
                      onChange={(e) => setSettingsForm((prev) => ({ ...prev, hero_subtitle: e.target.value }))}
                      className="border-2 border-gray-200 focus:border-black font-medium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo-upload" className="font-bold">
                      Logo Image
                    </Label>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "logo_url")}
                        className="hidden"
                      />
                      <Label
                        htmlFor="logo-upload"
                        className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        <Upload className="h-5 w-5" />
                        Upload Logo
                      </Label>
                      {settingsForm.logo_url && (
                        <img
                          src={settingsForm.logo_url || "/placeholder.svg"}
                          alt="Logo preview"
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="hero-image-upload" className="font-bold">
                      Hero Background Image
                    </Label>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        id="hero-image-upload"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "hero_image")}
                        className="hidden"
                      />
                      <Label
                        htmlFor="hero-image-upload"
                        className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        <Upload className="h-5 w-5" />
                        Upload Hero Image
                      </Label>
                      {settingsForm.hero_image && (
                        <img
                          src={settingsForm.hero_image || "/placeholder.svg"}
                          alt="Hero preview"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      handleUpdateSettings({
                        hero_title: settingsForm.hero_title,
                        hero_subtitle: settingsForm.hero_subtitle,
                        logo_url: settingsForm.logo_url,
                        hero_image: settingsForm.hero_image,
                      })
                    }
                    disabled={saving}
                    className="bg-black hover:bg-red-600 font-bold uppercase tracking-wide"
                  >
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Update Hero Section
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Social Media Links */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="font-black uppercase tracking-wide">Social Media Links</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook" className="font-bold">
                    Facebook URL
                  </Label>
                  <Input
                    id="facebook"
                    value={settingsForm.facebook_url}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, facebook_url: e.target.value }))}
                    placeholder="https://facebook.com/yourpage"
                    className="border-2 border-gray-200 focus:border-black font-medium"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram" className="font-bold">
                    Instagram URL
                  </Label>
                  <Input
                    id="instagram"
                    value={settingsForm.instagram_url}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, instagram_url: e.target.value }))}
                    placeholder="https://instagram.com/yourpage"
                    className="border-2 border-gray-200 focus:border-black font-medium"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter" className="font-bold">
                    Twitter URL
                  </Label>
                  <Input
                    id="twitter"
                    value={settingsForm.twitter_url}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, twitter_url: e.target.value }))}
                    placeholder="https://twitter.com/yourpage"
                    className="border-2 border-gray-200 focus:border-black font-medium"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin" className="font-bold">
                    LinkedIn URL
                  </Label>
                  <Input
                    id="linkedin"
                    value={settingsForm.linkedin_url}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, linkedin_url: e.target.value }))}
                    placeholder="https://linkedin.com/company/yourcompany"
                    className="border-2 border-gray-200 focus:border-black font-medium"
                  />
                </div>
                <div className="md:col-span-2">
                  <Button
                    onClick={() =>
                      handleUpdateSettings({
                        facebook_url: settingsForm.facebook_url,
                        instagram_url: settingsForm.instagram_url,
                        twitter_url: settingsForm.twitter_url,
                        linkedin_url: settingsForm.linkedin_url,
                      })
                    }
                    disabled={saving}
                    className="bg-black hover:bg-red-600 font-bold uppercase tracking-wide"
                  >
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Update Social Media Links
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Page Editor Tab */}
          <TabsContent value="about" className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight">About Page Editor</h2>
            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription className="font-medium">
                Edit your about page content. Changes will be reflected immediately on your website.
              </AlertDescription>
            </Alert>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="font-black uppercase tracking-wide">Hero Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="about-hero-title" className="font-bold">
                      Hero Title
                    </Label>
                    <Input
                      id="about-hero-title"
                      value={aboutForm.hero_title}
                      onChange={(e) => setAboutForm((prev) => ({ ...prev, hero_title: e.target.value }))}
                      className="border-2 border-gray-200 focus:border-black font-medium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="about-hero-subtitle" className="font-bold">
                      Hero Subtitle
                    </Label>
                    <Textarea
                      id="about-hero-subtitle"
                      rows={3}
                      value={aboutForm.hero_subtitle}
                      onChange={(e) => setAboutForm((prev) => ({ ...prev, hero_subtitle: e.target.value }))}
                      className="border-2 border-gray-200 focus:border-black font-medium"
                    />
                  </div>
                  <Button
                    onClick={() =>
                      handleUpdateAbout({
                        hero_title: aboutForm.hero_title,
                        hero_subtitle: aboutForm.hero_subtitle,
                      })
                    }
                    disabled={saving}
                    className="bg-black hover:bg-red-600 font-bold uppercase tracking-wide"
                  >
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Update Hero
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="font-black uppercase tracking-wide">Story Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="story-title" className="font-bold">
                      Story Title
                    </Label>
                    <Input
                      id="story-title"
                      value={aboutForm.story_title}
                      onChange={(e) => setAboutForm((prev) => ({ ...prev, story_title: e.target.value }))}
                      className="border-2 border-gray-200 focus:border-black font-medium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="story-content" className="font-bold">
                      Story Content
                    </Label>
                    <Textarea
                      id="story-content"
                      rows={5}
                      value={aboutForm.story_content}
                      onChange={(e) => setAboutForm((prev) => ({ ...prev, story_content: e.target.value }))}
                      className="border-2 border-gray-200 focus:border-black font-medium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="story-image-upload" className="font-bold">
                      Story Image
                    </Label>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        id="story-image-upload"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "about_story_image")}
                        className="hidden"
                      />
                      <Label
                        htmlFor="story-image-upload"
                        className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        <Upload className="h-5 w-5" />
                        Upload Story Image
                      </Label>
                      {aboutForm.story_image && (
                        <img
                          src={aboutForm.story_image || "/placeholder.svg"}
                          alt="Story preview"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      handleUpdateAbout({
                        story_title: aboutForm.story_title,
                        story_content: aboutForm.story_content,
                        story_image: aboutForm.story_image,
                      })
                    }
                    disabled={saving}
                    className="bg-black hover:bg-red-600 font-bold uppercase tracking-wide"
                  >
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Update Story
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="font-black uppercase tracking-wide">Values Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="values-title" className="font-bold">
                      Values Title
                    </Label>
                    <Input
                      id="values-title"
                      value={aboutForm.values_title}
                      onChange={(e) => setAboutForm((prev) => ({ ...prev, values_title: e.target.value }))}
                      className="border-2 border-gray-200 focus:border-black font-medium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="values-subtitle" className="font-bold">
                      Values Subtitle
                    </Label>
                    <Input
                      id="values-subtitle"
                      value={aboutForm.values_subtitle}
                      onChange={(e) => setAboutForm((prev) => ({ ...prev, values_subtitle: e.target.value }))}
                      className="border-2 border-gray-200 focus:border-black font-medium"
                    />
                  </div>
                  <Button
                    onClick={() =>
                      handleUpdateAbout({
                        values_title: aboutForm.values_title,
                        values_subtitle: aboutForm.values_subtitle,
                      })
                    }
                    disabled={saving}
                    className="bg-black hover:bg-red-600 font-bold uppercase tracking-wide"
                  >
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Update Values
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="font-black uppercase tracking-wide">Team & Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="team-title" className="font-bold">
                      Team Title
                    </Label>
                    <Input
                      id="team-title"
                      value={aboutForm.team_title}
                      onChange={(e) => setAboutForm((prev) => ({ ...prev, team_title: e.target.value }))}
                      className="border-2 border-gray-200 focus:border-black font-medium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="team-subtitle" className="font-bold">
                      Team Subtitle
                    </Label>
                    <Input
                      id="team-subtitle"
                      value={aboutForm.team_subtitle}
                      onChange={(e) => setAboutForm((prev) => ({ ...prev, team_subtitle: e.target.value }))}
                      className="border-2 border-gray-200 focus:border-black font-medium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-title" className="font-bold">
                      Contact CTA Title
                    </Label>
                    <Input
                      id="contact-title"
                      value={aboutForm.contact_title}
                      onChange={(e) => setAboutForm((prev) => ({ ...prev, contact_title: e.target.value }))}
                      className="border-2 border-gray-200 focus:border-black font-medium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-subtitle" className="font-bold">
                      Contact CTA Subtitle
                    </Label>
                    <Textarea
                      id="contact-subtitle"
                      rows={2}
                      value={aboutForm.contact_subtitle}
                      onChange={(e) => setAboutForm((prev) => ({ ...prev, contact_subtitle: e.target.value }))}
                      className="border-2 border-gray-200 focus:border-black font-medium"
                    />
                  </div>
                  <Button
                    onClick={() =>
                      handleUpdateAbout({
                        team_title: aboutForm.team_title,
                        team_subtitle: aboutForm.team_subtitle,
                        contact_title: aboutForm.contact_title,
                        contact_subtitle: aboutForm.contact_subtitle,
                      })
                    }
                    disabled={saving}
                    className="bg-black hover:bg-red-600 font-bold uppercase tracking-wide"
                  >
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Update Team & Contact
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contact Settings Tab */}
          <TabsContent value="contact" className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight">Contact Information</h2>
            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription className="font-medium">
                These contact details will appear in the header, footer, and contact sections throughout your website.
              </AlertDescription>
            </Alert>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="font-black uppercase tracking-wide flex items-center gap-2">
                    <Phone className="h-5 w-5 text-red-600" />
                    Phone Number
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="phone" className="font-bold">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 XXXXXXXXXX"
                      className="border-2 border-gray-200 focus:border-black font-medium"
                    />
                  </div>
                  <Button
                    onClick={() => handleUpdateSettings({ phone: settingsForm.phone })}
                    disabled={saving}
                    className="w-full bg-black hover:bg-red-600 font-bold uppercase tracking-wide"
                  >
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Update Phone
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="font-black uppercase tracking-wide flex items-center gap-2">
                    <Mail className="h-5 w-5 text-red-600" />
                    Email Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="font-bold">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="orders@sanjibtextile.com"
                      className="border-2 border-gray-200 focus:border-black font-medium"
                    />
                  </div>
                  <Button
                    onClick={() => handleUpdateSettings({ email: settingsForm.email })}
                    disabled={saving}
                    className="w-full bg-black hover:bg-red-600 font-bold uppercase tracking-wide"
                  >
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Update Email
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="font-black uppercase tracking-wide flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-red-600" />
                    WhatsApp Number
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="whatsapp" className="font-bold">
                      WhatsApp Number
                    </Label>
                    <Input
                      id="whatsapp"
                      value={settingsForm.whatsapp}
                      onChange={(e) => setSettingsForm((prev) => ({ ...prev, whatsapp: e.target.value }))}
                      placeholder="+91 XXXXXXXXXX"
                      className="border-2 border-gray-200 focus:border-black font-medium"
                    />
                  </div>
                  <Button
                    onClick={() => handleUpdateSettings({ whatsapp: settingsForm.whatsapp })}
                    disabled={saving}
                    className="w-full bg-black hover:bg-red-600 font-bold uppercase tracking-wide"
                  >
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Update WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="font-black uppercase tracking-wide">Update All Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() =>
                    handleUpdateSettings({
                      phone: settingsForm.phone,
                      email: settingsForm.email,
                      whatsapp: settingsForm.whatsapp,
                    })
                  }
                  disabled={saving}
                  className="w-full bg-red-600 hover:bg-black font-bold uppercase tracking-wide text-lg py-3"
                >
                  {saving ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
                  Save All Contact Changes
                </Button>
                <p className="text-sm text-gray-600 font-medium text-center">
                  This will update all contact information across your website including header, footer, and contact
                  sections.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight">Live Analytics & Insights</h2>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="font-black uppercase tracking-wide flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-red-600" />
                    Product Performance (Last 30 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productAnalytics.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex-1">
                          <span className="text-sm font-medium">{product.name}</span>
                          <div className="flex items-center gap-4 text-xs text-gray-600 font-medium mt-1">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {product.views} views
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {product.wishlists} wishlists
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">₹{product.price}</div>
                          <Badge variant="secondary" className="text-xs">
                            {product.stock} in stock
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="font-black uppercase tracking-wide">Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categoryAnalytics.map((category: any) => (
                      <div key={category.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="font-medium">{category.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {category.views} views
                          </span>
                          <Badge variant="secondary" className="font-bold">
                            {category.product_count} products
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription className="font-medium">
                Analytics data updates in real-time. Product views and wishlist additions are tracked automatically as
                customers interact with your website.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboard />
    </ProtectedRoute>
  )
}
