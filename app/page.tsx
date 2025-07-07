"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ArrowRight, Heart, Eye, ShoppingBag } from "lucide-react"
import ProductCard from "@/components/product/product-card"
import {
  getFeaturedProducts,
  getBusinessSettings,
  trackWebsiteVisit,
  type Product,
  type BusinessSettings,
} from "@/lib/database"
import { useAuth } from "@/hooks/use-auth"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchData()
    // Track homepage visit
    trackWebsiteVisit("/", user?.id)
  }, [user])

  const fetchData = async () => {
    try {
      const [products, settings] = await Promise.all([getFeaturedProducts(), getBusinessSettings()])
      setFeaturedProducts(products)
      setBusinessSettings(settings)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const defaultSettings = {
    business_name: "Sanjib Textile",
    hero_title: "Premium Sportswear for Every Athlete",
    hero_subtitle: "Discover our collection of high-quality bottom wear designed for performance, comfort, and style.",
    hero_image: "",
  }

  const settings = businessSettings || defaultSettings

  const categories = [
    {
      name: "Athletic Shorts",
      description: "High-performance shorts for training",
      image: "/placeholder.svg?height=300&width=400",
      href: "/categories?category=Shorts",
    },
    {
      name: "Training Joggers",
      description: "Comfortable joggers for everyday wear",
      image: "/placeholder.svg?height=300&width=400",
      href: "/categories?category=Joggers",
    },
    {
      name: "Compression Leggings",
      description: "High-compression leggings for support",
      image: "/placeholder.svg?height=300&width=400",
      href: "/categories?category=Leggings",
    },
    {
      name: "Track Pants",
      description: "Professional track pants for athletes",
      image: "/placeholder.svg?height=300&width=400",
      href: "/categories?category=Track Pants",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-black via-gray-900 to-red-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          {settings.hero_image ? (
            <Image
              src={settings.hero_image || "/placeholder.svg"}
              alt="Hero background"
              fill
              className="object-cover opacity-30"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-black via-gray-900 to-red-900"></div>
          )}
        </div>
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-black mb-6 uppercase tracking-tight leading-tight">
              {settings.hero_title}
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90 font-medium max-w-3xl mx-auto leading-relaxed">
              {settings.hero_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/categories">
                <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-black uppercase tracking-wide transform hover:scale-105 transition-all duration-300 shadow-lg">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-black uppercase tracking-wide transform hover:scale-105 transition-all duration-300 bg-transparent"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-4 uppercase tracking-tight">Shop by Category</h2>
            <p className="text-xl text-gray-600 font-medium">Find the perfect sportswear for your needs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link key={category.name} href={category.href}>
                <Card className="group cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 border-gray-200 hover:border-black">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-black mb-2 uppercase tracking-wide">{category.name}</h3>
                      <p className="text-gray-600 font-medium">{category.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-4 uppercase tracking-tight">Featured Products</h2>
            <p className="text-xl text-gray-600 font-medium">Our most popular and highly-rated sportswear</p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">No featured products available yet.</p>
              <Link href="/categories">
                <Button className="mt-4 bg-black hover:bg-red-600 font-bold uppercase tracking-wide">
                  Browse All Products
                </Button>
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/categories">
              <Button className="bg-black hover:bg-red-600 text-white px-8 py-4 text-lg font-black uppercase tracking-wide transform hover:scale-105 transition-all duration-300">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-4 uppercase tracking-tight">Why Choose Us?</h2>
            <p className="text-xl opacity-90 font-medium">Experience the difference with our premium sportswear</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-black mb-3 uppercase tracking-wide">Premium Quality</h3>
              <p className="opacity-90 font-medium">High-quality materials and construction for lasting performance</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-black mb-3 uppercase tracking-wide">Customer Love</h3>
              <p className="opacity-90 font-medium">Thousands of satisfied customers trust our products</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-black mb-3 uppercase tracking-wide">Tested Performance</h3>
              <p className="opacity-90 font-medium">Every product is tested by real athletes in real conditions</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-black mb-3 uppercase tracking-wide">Easy Shopping</h3>
              <p className="opacity-90 font-medium">Simple ordering process with fast, reliable delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-black mb-6 uppercase tracking-tight">Ready to Elevate Your Game?</h2>
          <p className="text-xl mb-8 opacity-90 font-medium max-w-2xl mx-auto">
            Join thousands of athletes who trust {settings.business_name} for their sportswear needs
          </p>
          <Link href="/categories">
            <Button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 text-lg font-black uppercase tracking-wide transform hover:scale-105 transition-all duration-300 shadow-lg">
              Start Shopping Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
