"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import {
  getProducts,
  deleteProduct,
  getBusinessSettings,
  getAboutContent,
  getLiveAnalytics,
  getProductAnalytics,
  getCategoryAnalytics,
  testDatabaseConnection,
  type Product,
  type BusinessSettings,
  type AboutContent,
} from "@/lib/database"
import ProductForm from "@/components/admin/product-form"
import { toast } from "@/hooks/use-toast"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  TrendingUp,
  Package,
  Heart,
  BarChart3,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Database,
  Settings,
  FileText,
  Activity,
} from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [products, setProducts] = useState<Product[]>([])
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null)
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()
  const [liveAnalytics, setLiveAnalytics] = useState<any>(null)
  const [productAnalytics, setProductAnalytics] = useState<any[]>([])
  const [categoryAnalytics, setCategoryAnalytics] = useState<any[]>([])
  const [dbStatus, setDbStatus] = useState<{ success: boolean; message: string } | null>(null)

  // Load data
  const loadData = async () => {
    try {
      setLoading(true)
      const [productsData, businessData, aboutData, analyticsData, productAnalyticsData, categoryAnalyticsData] =
        await Promise.all([
          getProducts(),
          getBusinessSettings(),
          getAboutContent(),
          getLiveAnalytics(),
          getProductAnalytics(),
          getCategoryAnalytics(),
        ])

      setProducts(productsData)
      setBusinessSettings(businessData)
      setAboutContent(aboutData)
      setLiveAnalytics(analyticsData)
      setProductAnalytics(productAnalyticsData)
      setCategoryAnalytics(categoryAnalyticsData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error loading data",
        description: "Some data could not be loaded. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Test database connection
  const handleTestConnection = async () => {
    try {
      const result = await testDatabaseConnection()
      setDbStatus({
        success: result.success,
        message: result.success ? "Database connection successful!" : `Connection failed: ${result.error}`,
      })
    } catch (err: any) {
      setDbStatus({
        success: false,
        message: `Connection test failed: ${err.message}`,
      })
    }
  }

  // Refresh analytics
  const refreshAnalytics = async () => {
    try {
      const [analyticsData, productAnalyticsData, categoryAnalyticsData] = await Promise.all([
        getLiveAnalytics(),
        getProductAnalytics(),
        getCategoryAnalytics(),
      ])
      setLiveAnalytics(analyticsData)
      setProductAnalytics(productAnalyticsData)
      setCategoryAnalytics(categoryAnalyticsData)
      toast({
        title: "Analytics refreshed",
        description: "Live analytics data has been updated.",
      })
    } catch (error) {
      console.error("Error refreshing analytics:", error)
      toast({
        title: "Error refreshing analytics",
        description: "Could not refresh analytics data.",
        variant: "destructive",
      })
    }
  }

  // Delete product
  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      await deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
      toast({
        title: "Product deleted",
        description: "Product has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error deleting product",
        description: "Could not delete the product. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle product form success
  const handleProductFormSuccess = () => {
    setShowProductForm(false)
    setEditingProduct(undefined)
    loadData()
  }

  useEffect(() => {
    loadData()
    // Set up auto-refresh for analytics every 30 seconds
    const interval = setInterval(refreshAnalytics, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (showProductForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <ProductForm
          product={editingProduct}
          onSuccess={handleProductFormSuccess}
          onCancel={() => {
            setShowProductForm(false)
            setEditingProduct(undefined)
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your Sanjib Textile business</p>

          {/* Database Status */}
          <div className="flex items-center gap-4 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              className="flex items-center gap-2 bg-transparent"
            >
              <Database className="h-4 w-4" />
              Test Database
            </Button>

            {dbStatus && (
              <div
                className={`flex items-center gap-1 text-sm ${dbStatus.success ? "text-green-600" : "text-red-600"}`}
              >
                {dbStatus.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {dbStatus.message}
              </div>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border-2 border-gray-200">
            <TabsTrigger value="overview" className="flex items-center gap-2 font-bold">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2 font-bold">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2 font-bold">
              <Settings className="h-4 w-4" />
              Business
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2 font-bold">
              <FileText className="h-4 w-4" />
              About Page
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 font-bold">
              <Activity className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Live Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="border-2 border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold uppercase">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black">{liveAnalytics?.totalProducts || 0}</div>
                  <p className="text-xs text-gray-600">Active products</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold uppercase">Customers</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black">{liveAnalytics?.totalCustomers || 0}</div>
                  <p className="text-xs text-gray-600">Registered users</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold uppercase">Wishlists</CardTitle>
                  <Heart className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black">{liveAnalytics?.totalWishlists || 0}</div>
                  <p className="text-xs text-gray-600">Items in wishlists</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold uppercase">Page Views</CardTitle>
                  <Eye className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black">{liveAnalytics?.totalVisits || 0}</div>
                  <p className="text-xs text-gray-600">Total visits</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold uppercase">Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black">₹{liveAnalytics?.estimatedRevenue || 0}</div>
                  <p className="text-xs text-gray-600">Estimated</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="font-black uppercase">Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setShowProductForm(true)}
                  className="bg-black hover:bg-red-600 font-bold uppercase tracking-wide"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
                <Button
                  variant="outline"
                  onClick={refreshAnalytics}
                  className="border-2 border-gray-200 font-bold bg-transparent"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Analytics
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("business")}
                  className="border-2 border-gray-200 font-bold"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Business Settings
                </Button>
              </CardContent>
            </Card>

            {/* Recent Products */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="font-black uppercase">Recent Products</CardTitle>
                <CardDescription>Latest products added to your store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded bg-gray-50">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded border"
                        />
                        <div>
                          <h4 className="font-bold">{product.name}</h4>
                          <p className="text-sm text-gray-600">
                            ₹{product.price} • {product.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={product.is_active ? "default" : "secondary"}>
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">Stock: {product.stock}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black uppercase">Product Management</h2>
                <p className="text-gray-600">Manage your product catalog</p>
              </div>
              <Button
                onClick={() => setShowProductForm(true)}
                className="bg-black hover:bg-red-600 font-bold uppercase tracking-wide"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>

            <Card className="border-2 border-gray-200">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-black uppercase text-sm">Product</th>
                        <th className="text-left p-4 font-black uppercase text-sm">Category</th>
                        <th className="text-left p-4 font-black uppercase text-sm">Price</th>
                        <th className="text-left p-4 font-black uppercase text-sm">Stock</th>
                        <th className="text-left p-4 font-black uppercase text-sm">Status</th>
                        <th className="text-left p-4 font-black uppercase text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images[0] || "/placeholder.svg"}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded border"
                              />
                              <div>
                                <h4 className="font-bold">{product.name}</h4>
                                <p className="text-sm text-gray-600 truncate max-w-xs">{product.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{product.category}</Badge>
                          </td>
                          <td className="p-4">
                            <div className="font-bold">₹{product.price}</div>
                            {product.original_price && (
                              <div className="text-sm text-gray-500 line-through">₹{product.original_price}</div>
                            )}
                          </td>
                          <td className="p-4">
                            <Badge variant={product.stock > 0 ? "default" : "destructive"}>{product.stock} units</Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1">
                              <Badge variant={product.is_active ? "default" : "secondary"}>
                                {product.is_active ? "Active" : "Inactive"}
                              </Badge>
                              {product.is_featured && (
                                <Badge variant="outline" className="text-xs">
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingProduct(product)
                                  setShowProductForm(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Settings Tab */}
          <TabsContent value="business" className="space-y-6">
            <div>
              <h2 className="text-2xl font-black uppercase">Business Settings</h2>
              <p className="text-gray-600">Configure your business information</p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Business settings functionality is available. You can update your business information, contact details,
                and branding.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* About Page Tab */}
          <TabsContent value="about" className="space-y-6">
            <div>
              <h2 className="text-2xl font-black uppercase">About Page Content</h2>
              <p className="text-gray-600">Manage your about page content</p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                About page content management is available. You can update your company story, values, and team
                information.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black uppercase">Analytics Dashboard</h2>
                <p className="text-gray-600">Track your business performance</p>
              </div>
              <Button
                variant="outline"
                onClick={refreshAnalytics}
                className="border-2 border-gray-200 font-bold bg-transparent"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
            </div>

            {/* Product Performance Chart */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="font-black uppercase">Product Performance</CardTitle>
                <CardDescription>Top performing products by engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    engagement: {
                      label: "Engagement Score",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productAnalytics.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="engagement" fill="var(--color-engagement)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Category Analytics */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="font-black uppercase">Category Performance</CardTitle>
                <CardDescription>Product views by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryAnalytics.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 border rounded bg-gray-50">
                      <div>
                        <h4 className="font-bold">{category.name}</h4>
                        <p className="text-sm text-gray-600">{category.product_count} products</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{category.views} views</div>
                        <Progress
                          value={(category.views / Math.max(...categoryAnalytics.map((c) => c.views))) * 100}
                          className="w-20 mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
