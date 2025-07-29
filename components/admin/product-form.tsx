"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createProduct, updateProduct, type Product } from "@/lib/database"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, X, Save, Loader2, AlertCircle } from "lucide-react"

interface ProductFormProps {
  product?: Product
  onSuccess: () => void
  onCancel: () => void
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form state
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    original_price: product?.original_price || 0,
    category: product?.category || "",
    stock: product?.stock || 0,
    rating: product?.rating || 4.5,
    review_count: product?.review_count || 0,
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    colors: product?.colors || ["Black"],
    sizes: product?.sizes || ["M"],
    images: product?.images || ["/placeholder.svg?height=300&width=300"],
    features: product?.features || ["High Quality", "Comfortable Fit"],
    specifications: product?.specifications || { Material: "Cotton Blend", Care: "Machine Wash" },
  })

  // Available options
  const categories = ["Shorts", "Joggers", "Leggings", "Track Pants", "Sweatpants"]
  const availableColors = ["Black", "White", "Navy", "Grey", "Red", "Blue", "Green", "Purple", "Pink", "Yellow"]
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"]

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Product name must be at least 2 characters long"
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      newErrors.description = "Product description must be at least 10 characters long"
    }

    if (!formData.category) {
      newErrors.category = "Please select a category"
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0"
    }

    if (formData.original_price && formData.original_price < formData.price) {
      newErrors.original_price = "Original price must be greater than or equal to current price"
    }

    if (formData.stock < 0) {
      newErrors.stock = "Stock cannot be negative"
    }

    if (formData.colors.length === 0) {
      newErrors.colors = "At least one color must be selected"
    }

    if (formData.sizes.length === 0) {
      newErrors.sizes = "At least one size must be selected"
    }

    if (formData.features.length === 0) {
      newErrors.features = "At least one feature must be added"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        original_price: formData.original_price ? Number(formData.original_price) : null,
        stock: Number(formData.stock),
        rating: Number(formData.rating),
        review_count: Number(formData.review_count),
      }

      if (product) {
        await updateProduct(product.id, productData)
        toast({
          title: "Product Updated",
          description: "Product has been successfully updated",
        })
      } else {
        await createProduct(productData as any)
        toast({
          title: "Product Created",
          description: "Product has been successfully created",
        })
      }

      onSuccess()
    } catch (error: any) {
      console.error("Form submission error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle array inputs
  const addToArray = (field: "colors" | "sizes" | "features" | "images", value: string) => {
    if (value && !formData[field].includes(value)) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value],
      }))
    }
  }

  const removeFromArray = (field: "colors" | "sizes" | "features" | "images", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  // Handle specifications
  const addSpecification = (key: string, value: string) => {
    if (key && value) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [key]: value,
        },
      }))
    }
  }

  const removeSpecification = (key: string) => {
    setFormData((prev) => {
      const newSpecs = { ...prev.specifications }
      delete newSpecs[key]
      return {
        ...prev,
        specifications: newSpecs,
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" onClick={onCancel} className="mb-4 bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
        <h1 className="text-3xl font-black uppercase tracking-tight">{product ? "Edit Product" : "Add New Product"}</h1>
        <p className="text-gray-600">
          {product ? "Update product information" : "Create a new product for your store"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="font-black uppercase">Basic Information</CardTitle>
            <CardDescription>Essential product details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="font-bold">
                  Product Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className={`border-2 ${errors.name ? "border-red-500" : "border-gray-200"} focus:border-black`}
                  placeholder="Enter product name"
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="category" className="font-bold">
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className={`border-2 ${errors.category ? "border-red-500" : "border-gray-200"}`}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="font-bold">
                Description *
              </Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className={`border-2 ${errors.description ? "border-red-500" : "border-gray-200"} focus:border-black`}
                placeholder="Describe your product in detail"
              />
              {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="font-black uppercase">Pricing & Inventory</CardTitle>
            <CardDescription>Set pricing and stock information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price" className="font-bold">
                  Price (₹) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))}
                  className={`border-2 ${errors.price ? "border-red-500" : "border-gray-200"} focus:border-black`}
                />
                {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
              </div>

              <div>
                <Label htmlFor="original_price" className="font-bold">
                  Original Price (₹)
                </Label>
                <Input
                  id="original_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.original_price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, original_price: Number.parseFloat(e.target.value) || 0 }))
                  }
                  className={`border-2 ${errors.original_price ? "border-red-500" : "border-gray-200"} focus:border-black`}
                />
                {errors.original_price && <p className="text-sm text-red-600 mt-1">{errors.original_price}</p>}
              </div>

              <div>
                <Label htmlFor="stock" className="font-bold">
                  Stock Quantity *
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stock: Number.parseInt(e.target.value) || 0 }))}
                  className={`border-2 ${errors.stock ? "border-red-500" : "border-gray-200"} focus:border-black`}
                />
                {errors.stock && <p className="text-sm text-red-600 mt-1">{errors.stock}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Variants */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="font-black uppercase">Product Variants</CardTitle>
            <CardDescription>Available colors and sizes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Colors */}
            <div>
              <Label className="font-bold">Available Colors *</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.colors.map((color, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {color}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray("colors", index)} />
                  </Badge>
                ))}
              </div>
              <Select onValueChange={(value) => addToArray("colors", value)}>
                <SelectTrigger className="mt-2 border-2 border-gray-200">
                  <SelectValue placeholder="Add color" />
                </SelectTrigger>
                <SelectContent>
                  {availableColors
                    .filter((color) => !formData.colors.includes(color))
                    .map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.colors && <p className="text-sm text-red-600 mt-1">{errors.colors}</p>}
            </div>

            {/* Sizes */}
            <div>
              <Label className="font-bold">Available Sizes *</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.sizes.map((size, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {size}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray("sizes", index)} />
                  </Badge>
                ))}
              </div>
              <Select onValueChange={(value) => addToArray("sizes", value)}>
                <SelectTrigger className="mt-2 border-2 border-gray-200">
                  <SelectValue placeholder="Add size" />
                </SelectTrigger>
                <SelectContent>
                  {availableSizes
                    .filter((size) => !formData.sizes.includes(size))
                    .map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.sizes && <p className="text-sm text-red-600 mt-1">{errors.sizes}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="font-black uppercase">Product Features</CardTitle>
            <CardDescription>Key features and selling points</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="font-bold">Features *</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {feature}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray("features", index)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add feature"
                  className="border-2 border-gray-200"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const value = (e.target as HTMLInputElement).value.trim()
                      if (value) {
                        addToArray("features", value)
                        ;(e.target as HTMLInputElement).value = ""
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement
                    const value = input.value.trim()
                    if (value) {
                      addToArray("features", value)
                      input.value = ""
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {errors.features && <p className="text-sm text-red-600 mt-1">{errors.features}</p>}
            </div>

            {/* Specifications */}
            <div>
              <Label className="font-bold">Specifications</Label>
              <div className="space-y-2 mt-2">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Input value={key} readOnly className="flex-1 border-2 border-gray-200" />
                    <Input value={value} readOnly className="flex-1 border-2 border-gray-200" />
                    <Button type="button" variant="outline" size="sm" onClick={() => removeSpecification(key)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input placeholder="Specification name" className="border-2 border-gray-200" id="spec-key" />
                <Input placeholder="Specification value" className="border-2 border-gray-200" id="spec-value" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const keyInput = document.getElementById("spec-key") as HTMLInputElement
                    const valueInput = document.getElementById("spec-value") as HTMLInputElement
                    const key = keyInput.value.trim()
                    const value = valueInput.value.trim()
                    if (key && value) {
                      addSpecification(key, value)
                      keyInput.value = ""
                      valueInput.value = ""
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="font-black uppercase">Product Settings</CardTitle>
            <CardDescription>Visibility and status settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-bold">Active Product</Label>
                <p className="text-sm text-gray-600">Product will be visible to customers</p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-bold">Featured Product</Label>
                <p className="text-sm text-gray-600">Product will appear in featured sections</p>
              </div>
              <Switch
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_featured: checked }))}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rating" className="font-bold">
                  Rating (1-5)
                </Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, rating: Number.parseFloat(e.target.value) || 4.5 }))
                  }
                  className="border-2 border-gray-200 focus:border-black"
                />
              </div>

              <div>
                <Label htmlFor="review_count" className="font-bold">
                  Review Count
                </Label>
                <Input
                  id="review_count"
                  type="number"
                  min="0"
                  value={formData.review_count}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, review_count: Number.parseInt(e.target.value) || 0 }))
                  }
                  className="border-2 border-gray-200 focus:border-black"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Summary */}
        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fix the following errors before submitting:
              <ul className="list-disc list-inside mt-2">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            disabled={loading}
            className="bg-black hover:bg-red-600 font-bold uppercase tracking-wide"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {product ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {product ? "Update Product" : "Create Product"}
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
