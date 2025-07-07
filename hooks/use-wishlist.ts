"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./use-auth"
import { getWishlist, addToWishlist, removeFromWishlist, type WishlistItem } from "@/lib/database"
import { toast } from "@/hooks/use-toast"

export function useWishlist() {
  const { user } = useAuth()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchWishlist()
    } else {
      setWishlistItems([])
      setLoading(false)
    }
  }, [user])

  const fetchWishlist = async () => {
    if (!user) return

    setLoading(true)
    try {
      const items = await getWishlist(user.id)
      setWishlistItems(items)
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      // Don't show error toast for wishlist fetch failures
      setWishlistItems([])
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (productId: number) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wishlist",
        variant: "destructive",
      })
      return false
    }

    try {
      await addToWishlist(user.id, productId)
      await fetchWishlist()
      toast({
        title: "Added to wishlist",
        description: "Item has been added to your wishlist",
      })
      return true
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive",
      })
      return false
    }
  }

  const removeItem = async (productId: number) => {
    if (!user) return false

    try {
      await removeFromWishlist(user.id, productId)
      await fetchWishlist()
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      })
      return true
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      })
      return false
    }
  }

  const toggleItem = async (productId: number) => {
    const isWishlisted = wishlistItems.some((item) => item.product_id === productId)
    if (isWishlisted) {
      return await removeItem(productId)
    } else {
      return await addItem(productId)
    }
  }

  const isWishlisted = (productId: number) => {
    return wishlistItems.some((item) => item.product_id === productId)
  }

  return {
    wishlistItems,
    loading,
    addItem,
    removeItem,
    toggleItem,
    isWishlisted,
    wishlistCount: wishlistItems.length,
  }
}
