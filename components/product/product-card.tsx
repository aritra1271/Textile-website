"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/hooks/use-wishlist"
import { Star, Heart, Eye, Phone, Mail, MessageCircle } from "lucide-react"
import type { Product } from "@/lib/database"

interface ProductCardProps {
  product: Product
  showActions?: boolean
}

export default function ProductCard({ product, showActions = true }: ProductCardProps) {
  const { toggleItem, isWishlisted } = useWishlist()
  const [isToggling, setIsToggling] = useState(false)

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsToggling(true)
    await toggleItem(product.id)
    setIsToggling(false)
  }

  const handleContact = (method: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    switch (method) {
      case "phone":
        window.open("tel:+917595858158")
        break
      case "email":
        window.open("mailto:orders@sanjibtextile.com?subject=Inquiry about " + product.name)
        break
      case "whatsapp":
        window.open("https://wa.me/917595858158?text=Hi, I'm interested in " + product.name)
        break
    }
  }

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-black">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Link href={`/products/${product.id}`}>
            <Image
              src={product.images[0] || "/placeholder.svg?height=300&width=300"}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </Link>

          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.is_featured && <Badge className="bg-red-600 font-bold uppercase tracking-wide">Featured</Badge>}
            {discountPercentage > 0 && (
              <Badge className="bg-black font-bold uppercase tracking-wide">{discountPercentage}% OFF</Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="destructive" className="font-bold uppercase tracking-wide">
                Out of Stock
              </Badge>
            )}
          </div>

          {showActions && (
            <Button
              size="icon"
              variant="secondary"
              className={`absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                isWishlisted(product.id) ? "bg-red-100 border-red-300" : ""
              }`}
              onClick={handleWishlistToggle}
              disabled={isToggling}
            >
              <Heart className={`h-4 w-4 ${isWishlisted(product.id) ? "fill-red-600 text-red-600" : ""}`} />
            </Button>
          )}
        </div>

        <div className="p-4">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-black text-lg mb-2 hover:text-red-600 transition-colors uppercase tracking-wide">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium">
              ({product.rating}) • {product.review_count} reviews
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-black text-red-600">₹{product.price}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-lg text-gray-500 line-through font-medium">₹{product.original_price}</span>
            )}
          </div>

          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600 font-medium">
              Stock: {product.stock > 0 ? product.stock : "Out of stock"}
            </p>
            <Badge variant="outline" className="font-bold uppercase tracking-wide">
              {product.category}
            </Badge>
          </div>

          <div className="space-y-2">
            <Link href={`/products/${product.id}`}>
              <Button className="w-full bg-black hover:bg-red-600 font-bold uppercase tracking-wide">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </Link>

            {showActions && (
              <div className="grid grid-cols-3 gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => handleContact("phone", e)}
                  className="text-xs font-bold border-2 hover:border-black"
                >
                  <Phone className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => handleContact("whatsapp", e)}
                  className="text-xs font-bold border-2 hover:border-black"
                >
                  <MessageCircle className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => handleContact("email", e)}
                  className="text-xs font-bold border-2 hover:border-black"
                >
                  <Mail className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
