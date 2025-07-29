"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Search, User, Phone, Mail, MessageCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useWishlist } from "@/hooks/use-wishlist"
import { getBusinessSettings, searchProducts, type BusinessSettings } from "@/lib/database"
import UserMenu from "@/components/auth/user-menu"

interface SearchResult {
  id: number
  name: string
  price: number
  images: string[]
  category: string
}

export default function Header() {
  const { user } = useAuth()
  const { wishlistCount } = useWishlist()
  const router = useRouter()
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    fetchBusinessSettings()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchBusinessSettings = async () => {
    try {
      const settings = await getBusinessSettings()
      setBusinessSettings(settings)
    } catch (error) {
      console.error("Error fetching business settings:", error)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (!query.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)
    setShowResults(true)

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchProducts(query)
        setSearchResults(results)
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300)
  }

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false)
    setSearchQuery("")
    router.push(`/products/${result.id}`)
  }

  const handleCategorySearch = (category: string) => {
    setShowResults(false)
    setSearchQuery("")
    router.push(`/categories?category=${encodeURIComponent(category)}`)
  }

  const getCategoryResults = () => {
    const categories = ["Shorts", "Joggers", "Leggings", "Track Pants", "Sweatpants"]
    return categories.filter(
      (category) =>
        category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        searchQuery.toLowerCase().includes(category.toLowerCase().substring(0, 4)),
    )
  }

  return (
    <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50">
      {/* Contact Bar */}
      {businessSettings?.show_contact_bar && (
        <div className="bg-black text-white py-2 px-4">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              {businessSettings.phone && (
                <a
                  href={`tel:${businessSettings.phone}`}
                  className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">{businessSettings.phone}</span>
                </a>
              )}
              {businessSettings.email && (
                <a
                  href={`mailto:${businessSettings.email}`}
                  className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">{businessSettings.email}</span>
                </a>
              )}
              {businessSettings.whatsapp && (
                <a
                  href={`https://wa.me/${businessSettings.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="font-medium">WhatsApp Available</span>
                </a>
              )}
            </div>
            <div className="mt-2 sm:mt-0">
              <span className="font-medium">
                {businessSettings.contact_bar_message || "Free shipping on orders over ₹999"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            {businessSettings?.logo_url ? (
              <img
                src={businessSettings.logo_url || "/placeholder.svg"}
                alt={businessSettings.business_name || "Sanjib Textile"}
                className="h-10 w-10 object-contain"
              />
            ) : (
              <div className="bg-black text-white px-3 py-2 rounded font-black text-lg">ST</div>
            )}
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">
                {businessSettings?.business_name || "Sanjib Textile"}
              </h1>
              <p className="text-xs text-gray-600 font-medium">{businessSettings?.tagline || "Premium Sportswear"}</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-black font-bold uppercase tracking-wide transition-colors"
            >
              Home
            </Link>
            <Link
              href="/categories"
              className="text-gray-700 hover:text-black font-bold uppercase tracking-wide transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-black font-bold uppercase tracking-wide transition-colors"
            >
              About
            </Link>
            {user?.is_admin && (
              <Link
                href="/admin"
                className="text-red-600 hover:text-red-800 font-bold uppercase tracking-wide transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
                className="pl-10 pr-4 py-2 w-full border-2 border-gray-200 focus:border-black rounded-lg font-medium"
              />
            </div>

            {/* Search Results Dropdown */}
            {showResults && (searchResults.length > 0 || getCategoryResults().length > 0 || isSearching) && (
              <Card className="absolute top-full left-0 right-0 mt-2 border-2 border-gray-200 shadow-lg z-50 max-h-96 overflow-y-auto">
                <CardContent className="p-0">
                  {isSearching ? (
                    <div className="p-4 text-center">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Searching...</p>
                    </div>
                  ) : (
                    <>
                      {/* Category Suggestions */}
                      {getCategoryResults().length > 0 && (
                        <div className="border-b border-gray-100">
                          <div className="p-3 bg-gray-50">
                            <h4 className="text-xs font-bold uppercase tracking-wide text-gray-600">Categories</h4>
                          </div>
                          {getCategoryResults().map((category) => (
                            <button
                              key={category}
                              onClick={() => handleCategorySearch(category)}
                              className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">{category}</span>
                                <Badge variant="secondary" className="text-xs">
                                  Category
                                </Badge>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Product Results */}
                      {searchResults.length > 0 && (
                        <div>
                          <div className="p-3 bg-gray-50">
                            <h4 className="text-xs font-bold uppercase tracking-wide text-gray-600">Products</h4>
                          </div>
                          {searchResults.map((result) => (
                            <button
                              key={result.id}
                              onClick={() => handleResultClick(result)}
                              className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                            >
                              <div className="flex items-center space-x-3">
                                <img
                                  src={result.images[0] || "/placeholder.svg"}
                                  alt={result.name}
                                  className="w-10 h-10 object-cover rounded border"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 truncate">{result.name}</p>
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">{result.category}</p>
                                    <p className="font-bold text-black">₹{result.price}</p>
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* No Results */}
                      {!isSearching &&
                        searchResults.length === 0 &&
                        getCategoryResults().length === 0 &&
                        searchQuery && (
                          <div className="p-4 text-center">
                            <p className="text-sm text-gray-600">No products found for "{searchQuery}"</p>
                            <p className="text-xs text-gray-500 mt-1">Try searching for shorts, joggers, or leggings</p>
                          </div>
                        )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/account/wishlist" className="relative">
                  <Heart className="h-6 w-6 text-gray-700 hover:text-red-600 transition-colors" />
                  {wishlistCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-600 text-white text-xs">
                      {wishlistCount}
                    </Badge>
                  )}
                </Link>
                <UserMenu />
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-gray-200 hover:border-black font-bold bg-transparent"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-black hover:bg-red-600 font-bold uppercase tracking-wide">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
