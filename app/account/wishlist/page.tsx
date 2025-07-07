"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Star, Heart, Trash2, ShoppingBag } from "lucide-react"
import ProtectedRoute from "@/components/auth/protected-route"

// Mock product data - in real app, this would come from your products table
const mockProducts = [
  {
    id: 1,
    name: "Athletic Performance Shorts",
    price: 29.99,
    originalPrice: 39.99,
    category: "Shorts",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.5,
    stock: 25,
    discount: 25,
  },
  {
    id: 3,
    name: "Compression Leggings",
    price: 34.99,
    originalPrice: 44.99,
    category: "Leggings",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    stock: 30,
    discount: 22,
  },
]

interface WishlistItem {
  id: string
  product_id: number
  created_at: string
}

function WishlistContent() {
  const { user } = useAuth()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchWishlist()
    }
  }, [user])

  const fetchWishlist = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("wishlists")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setWishlistItems(data || [])
    } catch (error) {
      console.error("Error fetching wishlist:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: number) => {
    if (!user) return

    try {
      const { error } = await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_id", productId)

      if (error) throw error

      setWishlistItems((prev) => prev.filter((item) => item.product_id !== productId))
    } catch (error) {
      console.error("Error removing from wishlist:", error)
    }
  }

  // Filter products that are in wishlist
  const wishlistedProducts = mockProducts.filter((product) =>
    wishlistItems.some((item) => item.product_id === product.id),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlistedProducts.length} {wishlistedProducts.length === 1 ? "item" : "items"} saved for later
          </p>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start adding products you love to keep track of them</p>
            <Link href="/categories">
              <Button>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistedProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      {product.discount > 0 && <Badge className="bg-red-500">{product.discount}% OFF</Badge>}
                    </div>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-4 right-4"
                      onClick={() => removeFromWishlist(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
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
                      <span className="text-sm text-gray-600">({product.rating})</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/products/${product.id}`} className="flex-1">
                        <Button className="w-full" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" onClick={() => removeFromWishlist(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  )
}
