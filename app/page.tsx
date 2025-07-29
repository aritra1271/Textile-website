"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShoppingBag, TrendingUp, Award, Users } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useWishlist } from "@/hooks/use-wishlist"
import {
  getBusinessSettings,
  getFeaturedProducts,
  getCategories,
  trackWebsiteVisit,
  type BusinessSettings,
  type Product,
  type Category,
} from "@/lib/database"
import ProductCard from "@/components/product/product-card"

export default function HomePage() {
  const { user } = useAuth()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
    // Track homepage visit
    if (typeof window !== "undefined") {
      trackWebsiteVisit(window.location.pathname, user?.id)
    }
  }, [user])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [settingsData, productsData, categoriesData] = await Promise.allSettled([
        getBusinessSettings(),
        getFeaturedProducts(),
        getCategories(),
      ])

      // Handle business settings
      if (settingsData.status === "fulfilled" && settingsData.value) {
        setBusinessSettings(settingsData.value)
      } else {
        console.warn("Failed to load business settings, using defaults")
        setBusinessSettings({
          id: 1,
          business_name: "Sanjib Textile",
          tagline: "Premium Sportswear for Every Athlete",
          description: "We create premium sportswear that empowers athletes at every level.",
          phone: "+91 7595858158",
          email: "orders@sanjibtextile.com",
          whatsapp: "+91 7595858158",
          address: "India",
          logo_url: "",
          hero_title: "Premium Sportswear for Every Athlete",
          hero_subtitle:
            "Discover our collection of high-quality bottom wear designed for performance, comfort, and style.",
          hero_image: "",
          facebook_url: "https://facebook.com/sanjibtextile",
          instagram_url: "https://instagram.com/sanjibtextile",
          twitter_url: "https://twitter.com/sanjibtextile",
          linkedin_url: "https://linkedin.com/company/sanjibtextile",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }

      // Handle featured products
      if (productsData.status === "fulfilled") {
        setFeaturedProducts(productsData.value)
      } else {
        console.warn("Failed to load featured products")
        setFeaturedProducts([])
      }

      // Handle categories
      if (categoriesData.status === "fulfilled") {
        setCategories(categoriesData.value)
      } else {
        console.warn("Failed to load categories")
        setCategories([])
      }
    } catch (err) {
      console.error("Error fetching homepage data:", err)
      setError("Failed to load page content. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  const handleWishlistToggle = async (productId: number) => {
    if (!user) {
      // Redirect to login or show login modal
      return
    }

    try {
      const inWishlist = await isInWishlist(user.id, productId)
      if (inWishlist) {
        await removeFromWishlist(user.id, productId)
      } else {
        await addToWishlist(user.id, productId)
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        {businessSettings?.hero_image && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{ backgroundImage: `url(${businessSettings.hero_image})` }}
          />
        )}

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-3/4 mx-auto bg-gray-700" />
                <Skeleton className="h-6 w-1/2 mx-auto bg-gray-700" />
                <Skeleton className="h-12 w-48 mx-auto bg-gray-700" />
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight leading-tight">
                  {businessSettings?.hero_title || "Premium Sportswear for Every Athlete"}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-300 font-medium leading-relaxed">
                  {businessSettings?.hero_subtitle ||
                    "Discover our collection of high-quality bottom wear designed for performance, comfort, and style."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/categories">
                    <Button
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wide px-8 py-4 text-lg"
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Shop Now
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white text-white hover:bg-white hover:text-black font-bold uppercase tracking-wide px-8 py-4 text-lg bg-transparent"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative bg-black/40 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-black mb-2">10K+</div>
                <div className="text-gray-300 font-medium uppercase tracking-wide">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black mb-2">500+</div>
                <div className="text-gray-300 font-medium uppercase tracking-wide">Products</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black mb-2">4.8★</div>
                <div className="text-gray-300 font-medium uppercase tracking-wide">Rating</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black mb-2">5+</div>
                <div className="text-gray-300 font-medium uppercase tracking-wide">Years</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight">Shop by Category</h2>
            <p className="text-xl text-gray-600 font-medium">Find the perfect athletic wear for your workout</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-2 border-gray-200">
                  <CardContent className="p-0">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link key={category.id} href={`/categories?category=${encodeURIComponent(category.name)}`}>
                  <Card className="border-2 border-gray-200 hover:border-black transition-all duration-300 hover:shadow-lg group">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <img
                          src={category.image || "/placeholder.svg?height=200&width=400"}
                          alt={category.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=200&width=400"
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-black mb-2 uppercase tracking-wide group-hover:text-red-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-gray-600 font-medium mb-3">{category.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="font-bold">
                            {category.product_count} Products
                          </Badge>
                          <span className="text-sm font-bold text-red-600 group-hover:text-black transition-colors">
                            Shop Now →
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight">Featured Products</h2>
            <p className="text-xl text-gray-600 font-medium">Our most popular and trending items</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="border-2 border-gray-200">
                  <CardContent className="p-0">
                    <Skeleton className="h-64 w-full" />
                    <div className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-6 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onWishlistToggle={() => handleWishlistToggle(product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <ShoppingBag className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">No Featured Products Yet</h3>
              <p className="text-gray-500">Check back soon for our latest featured items!</p>
              <Link href="/categories">
                <Button className="mt-4 bg-black hover:bg-red-600 font-bold uppercase tracking-wide">
                  Browse All Products
                </Button>
              </Link>
            </div>
          )}

          {featuredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/categories">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-black hover:bg-black hover:text-white font-bold uppercase tracking-wide px-8 bg-transparent"
                >
                  View All Products
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight">Why Choose Us</h2>
            <p className="text-xl text-gray-600 font-medium">Experience the difference with our premium sportswear</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-gray-200 hover:border-black transition-all duration-300 text-center p-8">
              <div className="text-red-600 mb-6">
                <Award className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-wide">Premium Quality</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                We use only the finest materials and craftsmanship to ensure our products meet the highest standards of
                quality and durability.
              </p>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-black transition-all duration-300 text-center p-8">
              <div className="text-red-600 mb-6">
                <TrendingUp className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-wide">Performance Focused</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                Our designs are engineered for optimal performance, comfort, and style to help you achieve your fitness
                goals.
              </p>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-black transition-all duration-300 text-center p-8">
              <div className="text-red-600 mb-6">
                <Users className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-wide">Customer First</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                We prioritize customer satisfaction with excellent service, easy returns, and continuous support for
                your fitness journey.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight">
            Ready to Elevate Your Workout?
          </h2>
          <p className="text-xl mb-8 text-gray-300 font-medium max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust {businessSettings?.business_name || "Sanjib Textile"} for
            their athletic wear needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/categories">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 font-bold uppercase tracking-wide px-8 py-4 text-lg"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Start Shopping
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black font-bold uppercase tracking-wide px-8 py-4 text-lg bg-transparent"
              >
                Learn Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
