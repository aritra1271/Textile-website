import { supabase } from "./supabase"

export interface Product {
  id: number
  name: string
  description: string
  price: number
  original_price: number | null
  category: string
  colors: string[]
  sizes: string[]
  images: string[]
  stock: number
  rating: number
  review_count: number
  features: string[]
  specifications: Record<string, string>
  is_active: boolean
  is_featured: boolean
  discount_percentage: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  description: string
  image: string
  product_count: number
  is_active: boolean
  created_at: string
}

export interface BusinessSettings {
  id: number
  business_name: string
  tagline: string
  description: string
  phone: string
  email: string
  whatsapp: string
  address: string
  logo_url: string
  hero_title: string
  hero_subtitle: string
  hero_image: string
  primary_color?: string
  secondary_color?: string
  font_style?: string
  show_contact_bar?: boolean
  contact_bar_message?: string
  facebook_url?: string
  instagram_url?: string
  twitter_url?: string
  linkedin_url?: string
  created_at: string
  updated_at: string
}

export interface AboutContent {
  id: number
  hero_title: string
  hero_subtitle: string
  story_title: string
  story_content: string
  story_image: string
  values_title: string
  values_subtitle: string
  team_title: string
  team_subtitle: string
  contact_title: string
  contact_subtitle: string
  statistics: {
    customers: number
    products: number
    rating: number
    years: number
  }
  created_at: string
  updated_at: string
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: number
  created_at: string
  product?: Product
}

export interface ProductView {
  id: string
  product_id: number
  user_id: string | null
  ip_address: string
  viewed_at: string
}

export interface WebsiteVisit {
  id: string
  user_id: string | null
  ip_address: string
  page_url: string
  visited_at: string
}

// Product functions
export async function getProducts(filters?: {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  colors?: string[]
  sortBy?: string
}) {
  let query = supabase.from("products").select("*").eq("is_active", true)

  if (filters?.category && filters.category !== "all") {
    query = query.eq("category", filters.category)
  }

  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`)
  }

  if (filters?.minPrice) {
    query = query.gte("price", filters.minPrice)
  }

  if (filters?.maxPrice) {
    query = query.lte("price", filters.maxPrice)
  }

  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case "price-low":
        query = query.order("price", { ascending: true })
        break
      case "price-high":
        query = query.order("price", { ascending: false })
        break
      case "rating":
        query = query.order("rating", { ascending: false })
        break
      case "newest":
        query = query.order("created_at", { ascending: false })
        break
      default:
        query = query.order("created_at", { ascending: false })
    }
  }

  const { data, error } = await query

  if (error) {
    if (error.code === "42P01") return []
    throw error
  }
  return data as Product[]
}

export async function searchProducts(query: string) {
  if (!query.trim()) return []

  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, images, category")
    .eq("is_active", true)
    .or(`name.ilike.%${query}%, description.ilike.%${query}%, category.ilike.%${query}%`)
    .limit(10)

  if (error) {
    console.error("Search error:", error)
    return []
  }
  return data
}

export async function getProduct(id: number) {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).eq("is_active", true).single()

  if (error) {
    if (error.code === "42P01") return null
    throw error
  }
  return data as Product
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(8)

  if (error) {
    if (error.code === "42P01") return []
    throw error
  }
  return data as Product[]
}

export async function createProduct(product: Omit<Product, "id" | "created_at" | "updated_at">) {
  console.log("Creating product:", product)

  const { data, error } = await supabase.from("products").insert([product]).select().single()

  if (error) {
    console.error("Product creation error:", error)
    throw error
  }

  console.log("Product created successfully:", data)
  return data as Product
}

export async function updateProduct(id: number, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from("products")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as Product
}

export async function deleteProduct(id: number) {
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) throw error
}

// Category functions
export async function getCategories() {
  const { data, error } = await supabase.from("categories").select("*").eq("is_active", true).order("name")

  if (error) {
    if (error.code === "42P01") return []
    throw error
  }
  return data as Category[]
}

// Business settings functions
export async function getBusinessSettings() {
  try {
    const { data, error } = await supabase.from("business_settings").select("*").eq("id", 1).single()

    if (error) {
      console.error("Error fetching business settings:", error)
      return {
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
      } as BusinessSettings
    }

    return data as BusinessSettings
  } catch (error) {
    console.error("Error in getBusinessSettings:", error)
    return null
  }
}

export async function updateBusinessSettings(updates: Partial<BusinessSettings>) {
  try {
    console.log("Starting business settings update with data:", updates)

    const { data, error } = await supabase
      .from("business_settings")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1)
      .select()
      .single()

    if (error) {
      console.error("Supabase update error:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log("Business settings updated successfully:", data)
    return data as BusinessSettings
  } catch (error) {
    console.error("Error in updateBusinessSettings:", error)
    throw error
  }
}

// About content functions
export async function getAboutContent() {
  try {
    const { data, error } = await supabase.from("about_content").select("*").eq("id", 1).single()

    if (error) {
      console.error("Error fetching about content:", error)
      return null
    }

    return data as AboutContent
  } catch (error) {
    console.error("Error in getAboutContent:", error)
    return null
  }
}

export async function updateAboutContent(updates: Partial<AboutContent>) {
  try {
    const { data, error } = await supabase
      .from("about_content")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1)
      .select()
      .single()

    if (error) {
      console.error("About content update error:", error)
      throw error
    }

    return data as AboutContent
  } catch (error) {
    console.error("Error in updateAboutContent:", error)
    throw error
  }
}

// Analytics functions - Made flexible to handle different table schemas
export async function trackProductView(productId: number, userId?: string) {
  try {
    // Try with minimal required fields first
    const insertData: any = {
      product_id: productId,
    }

    // Add optional fields if provided
    if (userId) {
      insertData.user_id = userId
    }

    // Try to add ip_address if the column exists
    try {
      insertData.ip_address = "127.0.0.1"
    } catch {
      // If ip_address column doesn't exist, continue without it
    }

    const { error } = await supabase.from("product_views").insert([insertData])

    // Silently ignore all errors - analytics shouldn't break the app
  } catch (err) {
    // Silently fail - analytics shouldn't break the app
  }
}

export async function trackWebsiteVisit(pageUrl: string, userId?: string) {
  try {
    // Try with minimal required fields first
    const insertData: any = {
      page_url: pageUrl,
    }

    // Add optional fields if provided
    if (userId) {
      insertData.user_id = userId
    }

    // Try to add ip_address if the column exists
    try {
      insertData.ip_address = "127.0.0.1"
    } catch {
      // If ip_address column doesn't exist, continue without it
    }

    const { error } = await supabase.from("website_visits").insert([insertData])

    // Silently ignore all errors - analytics shouldn't break the app
  } catch (err) {
    // Silently fail - analytics shouldn't break the app
  }
}

export async function getLiveAnalytics() {
  try {
    const [productsResult, usersResult, wishlistsResult, visitsResult, revenueResult] = await Promise.all([
      supabase.from("products").select("id", { count: "exact" }).eq("is_active", true),
      supabase.from("profiles").select("id", { count: "exact" }),
      supabase.from("wishlists").select("id", { count: "exact" }),
      supabase.from("website_visits").select("id", { count: "exact" }),
      supabase.from("products").select("price").eq("is_active", true),
    ])

    // Calculate estimated revenue (sum of all product prices)
    const totalRevenue = revenueResult.data?.reduce((sum, product) => sum + (product.price || 0), 0) || 0

    return {
      totalProducts: productsResult.count || 0,
      totalCustomers: usersResult.count || 0,
      totalWishlists: wishlistsResult.count || 0,
      totalVisits: visitsResult.count || 0,
      estimatedRevenue: Math.round(totalRevenue * 0.1), // Estimate based on 10% conversion
    }
  } catch (error) {
    console.error("Error getting live analytics:", error)
    return {
      totalProducts: 0,
      totalCustomers: 0,
      totalWishlists: 0,
      totalVisits: 0,
      estimatedRevenue: 0,
    }
  }
}

export async function getProductAnalytics() {
  try {
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select(`
        id,
        name,
        category,
        price,
        stock,
        rating,
        review_count
      `)
      .eq("is_active", true)

    if (productsError) throw productsError

    // Get view counts for each product
    const { data: viewCounts, error: viewsError } = await supabase
      .from("product_views")
      .select("product_id")
      .gte("viewed_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

    if (viewsError) throw viewsError

    // Get wishlist counts for each product
    const { data: wishlistCounts, error: wishlistError } = await supabase.from("wishlists").select("product_id")

    if (wishlistError) throw wishlistError

    // Combine data
    const analytics =
      products?.map((product) => {
        const views = viewCounts?.filter((v) => v.product_id === product.id).length || 0
        const wishlists = wishlistCounts?.filter((w) => w.product_id === product.id).length || 0

        return {
          ...product,
          views,
          wishlists,
          engagement: views + wishlists * 2, // Weighted engagement score
        }
      }) || []

    return analytics.sort((a, b) => b.engagement - a.engagement)
  } catch (error) {
    console.error("Error getting product analytics:", error)
    return []
  }
}

export async function getCategoryAnalytics() {
  try {
    const { data: categories, error } = await supabase
      .from("categories")
      .select(`
        id,
        name,
        product_count
      `)
      .eq("is_active", true)

    if (error) throw error

    // Get view counts by category
    const { data: categoryViews, error: viewsError } = await supabase
      .from("product_views")
      .select(`
        product_id,
        products!inner(category)
      `)
      .gte("viewed_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    if (viewsError) throw viewsError

    // Calculate views per category
    const viewsByCategory =
      categoryViews?.reduce((acc: Record<string, number>, view: any) => {
        const category = view.products.category
        acc[category] = (acc[category] || 0) + 1
        return acc
      }, {}) || {}

    return (
      categories?.map((category) => ({
        ...category,
        views: viewsByCategory[category.name] || 0,
      })) || []
    )
  } catch (error) {
    console.error("Error getting category analytics:", error)
    return []
  }
}

// Wishlist functions
export async function getWishlist(userId: string) {
  try {
    const { data, error } = await supabase
      .from("wishlists")
      .select(`
        *,
        product:products(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Wishlist fetch error:", error)
      return []
    }

    return data as WishlistItem[]
  } catch (error) {
    console.error("Error in getWishlist:", error)
    return []
  }
}

export async function addToWishlist(userId: string, productId: number) {
  const { data, error } = await supabase
    .from("wishlists")
    .insert([{ user_id: userId, product_id: productId }])
    .select()
    .single()

  if (error) throw error
  return data as WishlistItem
}

export async function removeFromWishlist(userId: string, productId: number) {
  const { error } = await supabase.from("wishlists").delete().eq("user_id", userId).eq("product_id", productId)

  if (error) throw error
}

export async function isInWishlist(userId: string, productId: number) {
  const { data, error } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single()

  if (error && error.code !== "PGRST116") throw error
  return !!data
}
