"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createProduct, updateProduct, type Product } from "@/lib/database"
import { toast } from "@/hooks/use-toast"
import { Loader2, Plus, X, Upload } from "lucide-react"

interface ProductFormProps {
  product?: Product
  onSuccess: () => void
  onCancel: () => void
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    original_price: product?.original_price?.toString() || "",
    category: product?.category || "",
    stock: product?.stock?.toString() || "",
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    rating: product?.rating?.toString() || "4.5",
    review_count: product?.review_count?.toString() || "0",
  })

  const [colors, setColors] = useState<string[]>(product?.colors || [])
  const [sizes, setSizes] = useState<string[]>(product?.sizes || [])
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [features, setFeatures] = useState<string[]>(product?.features || [])
  const [specifications, setSpecifications] = useState<Record<string, string>>(product?.specifications || {})

  const [newColor, setNewColor] = useState("")
  const [newSize, setNewSize] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [newSpecKey, setNewSpecKey] = useState("")
  const [newSpecValue, setNewSpecValue] = useState("")

  // Image upload handling
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          setImages((prev) => [...prev, result])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("Form submission started")

      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        original_price: formData.original_price ? Number.parseFloat(formData.original_price) : null,
        category: formData.category,
        colors,
        sizes,
        images: images.length > 0 ? images : ["/placeholder.svg?height=300&width=300"],
        stock: Number.parseInt(formData.stock),
        rating: Number.parseFloat(formData.rating),
        review_count: Number.parseInt(formData.review_count),
        features,
        specifications,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        discount_percentage: formData.original_price
          ? Math.round(
              ((Number.parseFloat(formData.original_price) - Number.parseFloat(formData.price)) /
                Number.parseFloat(formData.original_price)) *
                100,
            )
          : 0,
      }

      console.log("Product data prepared:", productData)

      if (product) {
        await updateProduct(product.id, productData)
        toast({
          title: "Product updated",
          description: "Product has been updated successfully",
        })
      } else {
        await createProduct(productData as any)
        toast({
          title: "Product created",
          description: "Product has been created successfully",
        })
      }

      onSuccess()
    } catch (err: any) {
      console.error("Product form error:", err)
      setError(err.message || "Failed to save product")
    } finally {
      setLoading(false)
    }
  }

  const addColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor])
      setNewColor("")
    }
  }

  const removeColor = (color: string) => {
    setColors(colors.filter((c) => c !== color))
  }

  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize])
      setNewSize("")
    }
  }

  const removeSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size))
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const addFeature = () => {
    if (newFeature && !features.includes(newFeature)) {
      setFeatures([...features, newFeature])
      setNewFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    setFeatures(features.filter((f) => f !== feature))
  }

  const addSpecification = () => {
    if (newSpecKey && newSpecValue && !specifications[newSpecKey]) {
      setSpecifications({ ...specifications, [newSpecKey]: newSpecValue })
      setNewSpecKey("")
      setNewSpecValue("")
    }
  }

  const removeSpecification = (key: string) => {
    const newSpecs = { ...specifications }
    delete newSpecs[key]
    setSpecifications(newSpecs)
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Shorts">Shorts</SelectItem>
                  <SelectItem value="Joggers">Joggers</SelectItem>
                  <SelectItem value="Leggings">Leggings</SelectItem>
                  <SelectItem value="Track Pants">Track Pants</SelectItem>
                  <SelectItem value="Sweatpants">Sweatpants</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
              disabled={loading}
            />
          </div>

          {/* Pricing in Rupees */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price (₹) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  id="price"
                  type="number"
                  step="1"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="pl-8"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="original_price">Original Price (₹)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  id="original_price"
                  type="number"
                  step="1"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                  className="pl-8"
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Colors */}
          <div>
            <Label>Available Colors</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                disabled={loading}
              />
              <Button type="button" onClick={addColor} disabled={loading}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <Badge key={color} variant="secondary" className="flex items-center gap-1">
                  {color}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeColor(color)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <Label>Available Sizes</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add size"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                disabled={loading}
              />
              <Button type="button" onClick={addSize} disabled={loading}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <Badge key={size} variant="secondary" className="flex items-center gap-1">
                  {size}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeSize(size)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label>Product Images</Label>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={loading}
                  className="hidden"
                  id="image-upload"
                />
                <Label
                  htmlFor="image-upload"
                  className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <Upload className="h-5 w-5" />
                  Upload Images from Device
                </Label>
                <span className="text-sm text-gray-500">Select multiple images (JPG, PNG, WebP)</span>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div>
            <Label>Product Features</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add feature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                disabled={loading}
              />
              <Button type="button" onClick={addFeature} disabled={loading}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <span className="flex-1 text-sm">{feature}</span>
                  <X className="h-4 w-4 cursor-pointer" onClick={() => removeFeature(feature)} />
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div>
            <Label>Specifications</Label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Input
                placeholder="Specification name"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                disabled={loading}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Specification value"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  disabled={loading}
                />
                <Button type="button" onClick={addSpecification} disabled={loading}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 p-2 border rounded">
                  <span className="font-medium">{key}:</span>
                  <span className="flex-1">{value}</span>
                  <X className="h-4 w-4 cursor-pointer" onClick={() => removeSpecification(key)} />
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                disabled={loading}
              />
              <Label htmlFor="is_active">Active Product</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                disabled={loading}
              />
              <Label htmlFor="is_featured">Featured Product</Label>
            </div>
          </div>

          {/* Rating & Reviews */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="review_count">Review Count</Label>
              <Input
                id="review_count"
                type="number"
                value={formData.review_count}
                onChange={(e) => setFormData({ ...formData, review_count: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {product ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
