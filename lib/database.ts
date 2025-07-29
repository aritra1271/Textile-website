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

// Helper function to check if table exists
async function tableExists(tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase.from(tableName).select("*").limit(1)
    return !error || error.code !== "42P01"
  } catch {
    return false
  }
}

// Test database connection
export async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase.from("products").select("count", { count: "exact" }).limit(1)

    if (error) {
      console.error("Database connection test failed:", error)
      return { success: false, error: error.message }
    }

    console.log("Database connection successful")
    return { success: true, count: data }
  } catch (err: any) {
    console.error("Database connection error:", err)
    return { success: false, error: err.message }
  }
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
  try {
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
      console.error("Error fetching products:", error)
      if (error.code === "42P01") return []
      throw new Error(`Failed to fetch products: ${error.message}`)
    }

    return data as Product[]
  } catch (err: any) {
    console.error("getProducts error:", err)
    return []
  }
}

export async function searchProducts(query: string) {
  if (!query.trim()) return []

  try {
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
  } catch (err: any) {
    console.error("searchProducts error:", err)
    return []
  }
}

export async function getProduct(id: number) {
  try {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).eq("is_active", true).single()

    if (error) {
      console.error("Error fetching product:", error)
      if (error.code === "42P01" || error.code === "PGRST116") return null
      throw new Error(`Failed to fetch product: ${error.message}`)
    }
    return data as Product
  } catch (err: any) {
    console.error("getProduct error:", err)
    return null
  }
}

export async function getFeaturedProducts() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(8)

    if (error) {
      console.error("Error fetching featured products:", error)
      if (error.code === "42P01") return []
      throw new Error(`Failed to fetch featured products: ${error.message}`)
    }
    return data as Product[]
  } catch (err: any) {
    console.error("getFeaturedProducts error:", err)
    return []
  }
}

export async function createProduct(product: Omit<Product, "id" | "created_at" | "updated_at">) {
  console.log("=== PRODUCT CREATION START ===")
  console.log("Input product data:", JSON.stringify(product, null, 2))

  try {
    // Test database connection first
    const connectionTest = await testDatabaseConnection()
    if (!connectionTest.success) {
      throw new Error(`Database connection failed: ${connectionTest.error}`)
    }

    // Validate required fields
    const validationErrors: string[] = []

    if (!product.name || typeof product.name !== "string" || product.name.trim().length < 2) {
      validationErrors.push("Product name must be at least 2 characters long")
    }

    if (!product.description || typeof product.description !== "string" || product.description.trim().length < 10) {
      validationErrors.push("Product description must be at least 10 characters long")
    }

    if (!product.category || typeof product.category !== "string") {
      validationErrors.push("Product category is required")
    }

    if (!product.price || typeof product.price !== "number" || product.price <= 0) {
      validationErrors.push("Product price must be a number greater than 0")
    }

    if (typeof product.stock !== "number" || product.stock < 0) {
      validationErrors.push("Stock quantity must be a non-negative number")
    }

    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(", ")}`)
    }

    // Prepare product data with proper defaults
    const productData = {
      name: product.name.trim(),
      description: product.description.trim(),
      price: Number(product.price),
      original_price: product.original_price ? Number(product.original_price) : null,
      category: product.category,
      colors: Array.isArray(product.colors) && product.colors.length > 0 ? product.colors : ["Black"],
      sizes: Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : ["M"],
      images:
        Array.isArray(product.images) && product.images.length > 0
          ? product.images
          : ["/placeholder.svg?height=300&width=300"],
      stock: Number(product.stock),
      rating: Number(product.rating) || 4.5,
      review_count: Number(product.review_count) || 0,
      features:
        Array.isArray(product.features) && product.features.length > 0
          ? product.features
          : ["High Quality", "Comfortable Fit"],
      specifications:
        product.specifications &&
        typeof product.specifications === "object" &&
        Object.keys(product.specifications).length > 0
          ? product.specifications
          : { Material: "Cotton Blend", Care: "Machine Wash" },
      is_active: Boolean(product.is_active),
      is_featured: Boolean(product.is_featured),
      discount_percentage:
        product.original_price && product.price
          ? Math.round(
              ((Number(product.original_price) - Number(product.price)) / Number(product.original_price)) * 100,
            )
          : 0,
    }

    console.log("Processed product data:", JSON.stringify(productData, null, 2))

    // Insert into database
    const { data, error } = await supabase.from("products").insert([productData]).select().single()

    if (error) {
      console.error("=== SUPABASE INSERT ERROR ===")
      console.error("Error code:", error.code)
      console.error("Error message:", error.message)
      console.error("Error details:", error.details)
      console.error("Error hint:", error.hint)
      console.error("Full error object:", JSON.stringify(error, null, 2))

      // Provide more specific error messages
      let errorMessage = "Failed to create product"

      if (error.code === "42P01") {
        errorMessage = "Products table does not exist. Please run the database setup script."
      } else if (error.code === "23505") {
        errorMessage = "A product with this name already exists."
      } else if (error.code === "23514") {
        errorMessage = "Product data violates database constraints. Please check your input values."
      } else if (error.code === "42501") {
        errorMessage = "Permission denied. Please check your database permissions."
      } else if (error.message) {
        errorMessage = `Database error: ${error.message}`
      }

      throw new Error(errorMessage)
    }

    if (!data) {
      throw new Error("Product was created but no data was returned")
    }

    console.log("=== PRODUCT CREATION SUCCESS ===")
    console.log("Created product:", JSON.stringify(data, null, 2))

    return data as Product
  } catch (err: any) {
    console.error("=== PRODUCT CREATION ERROR ===")
    console.error("Error type:", typeof err)
    console.error("Error message:", err?.message)
    console.error("Error stack:", err?.stack)
    console.error("Full error:", JSON.stringify(err, null, 2))

    // Re-throw with a more descriptive message
    const errorMessage = err?.message || "Unknown error occurred while creating product"
    throw new Error(errorMessage)
  }
}

export async function updateProduct(id: number, updates: Partial<Product>) {
  try {
    const { data, error } = await supabase
      .from("products")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating product:", error)
      throw new Error(`Failed to update product: ${error.message}`)
    }

    return data as Product
  } catch (err: any) {
    console.error("updateProduct error:", err)
    throw new Error(err?.message || "Failed to update product")
  }
}

export async function deleteProduct(id: number) {
  try {
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Error deleting product:", error)
      throw new Error(`Failed to delete product: ${error.message}`)
    }
  } catch (err: any) {
    console.error("deleteProduct error:", err)
    throw new Error(err?.message || "Failed to delete product")
  }
}

// Category functions
export async function getCategories() {
  try {
    const { data, error } = await supabase.from("categories").select("*").eq("is_active", true).order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      if (error.code === "42P01") return []
      throw new Error(`Failed to fetch categories: ${error.message}`)
    }
    return data as Category[]
  } catch (err: any) {
    console.error("getCategories error:", err)
    return []
  }
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

// Analytics functions - Made resilient to missing tables
export async function trackProductView(productId: number, userId?: string) {
  try {
    // Check if table exists first
    const exists = await tableExists("product_views")
    if (!exists) {
      console.log("product_views table does not exist, skipping tracking")
      return
    }

    const insertData: any = {
      product_id: productId,
    }

    if (userId) {
      insertData.user_id = userId
    }

    const { error } = await supabase.from("product_views").insert([insertData])

    if (error) {
      console.log("Error tracking product view:", error.message)
    }
  } catch (err) {
    console.log("trackProductView error:", err)
  }
}

export async function trackWebsiteVisit(pageUrl: string, userId?: string) {
  try {
    // Check if table exists first
    const exists = await tableExists("website_visits")
    if (!exists) {
      console.log("website_visits table does not exist, skipping tracking")
      return
    }

    const insertData: any = {
      page_url: pageUrl,
    }

    if (userId) {
      insertData.user_id = userId
    }

    const { error } = await supabase.from("website_visits").insert([insertData])

    if (error) {
      console.log("Error tracking website visit:", error.message)
    }
  } catch (err) {
    console.log("trackWebsiteVisit error:", err)
  }
}

export async function getLiveAnalytics() {
  try {
    // Check if analytics tables exist
    const productViewsExists = await tableExists("product_views")
    const websiteVisitsExists = await tableExists("website_visits")
    const wishlistsExists = await tableExists("wishlists")

    const [productsResult, usersResult, revenueResult] = await Promise.all([
      supabase.from("products").select("id", { count: "exact" }).eq("is_active", true),
      supabase.from("profiles").select("id", { count: "exact" }),
      supabase.from("products").select("price").eq("is_active", true),
    ])

    // Only query analytics tables if they exist
    let wishlistsResult = { count: 0 }
    let visitsResult = { count: 0 }

    if (wishlistsExists) {
      wishlistsResult = await supabase.from("wishlists").select("id", { count: "exact" })
    }

    if (websiteVisitsExists) {
      visitsResult = await supabase.from("website_visits").select("id", { count: "exact" })
    }

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
    // Check if analytics tables exist
    const productViewsExists = await tableExists("product_views")
    const wishlistsExists = await tableExists("wishlists")

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

    let viewCounts: any[] = []
    let wishlistCounts: any[] = []

    // Only get analytics if tables exist
    if (productViewsExists) {
      const { data, error } = await supabase
        .from("product_views")
        .select("product_id")
        .gte("viewed_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      if (!error) viewCounts = data || []
    }

    if (wishlistsExists) {
      const { data, error } = await supabase.from("wishlists").select("product_id")

      if (!error) wishlistCounts = data || []
    }

    // Combine data
    const analytics =
      products?.map((product) => {
        const views = viewCounts.filter((v) => v.product_id === product.id).length || 0
        const wishlists = wishlistCounts.filter((w) => w.product_id === product.id).length || 0

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
    // Check if analytics tables exist
    const productViewsExists = await tableExists("product_views")

    const { data: categories, error } = await supabase
      .from("categories")
      .select(`
        id,
        name,
        product_count
      `)
      .eq("is_active", true)

    if (error) throw error

    let viewsByCategory: Record<string, number> = {}

    // Only get view analytics if table exists
    if (productViewsExists) {
      const { data: categoryViews, error: viewsError } = await supabase
        .from("product_views")
        .select(`
          product_id,
          products!inner(category)
        `)
        .gte("viewed_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      if (!viewsError && categoryViews) {
        viewsByCategory = categoryViews.reduce((acc: Record<string, number>, view: any) => {
          const category = view.products.category
          acc[category] = (acc[category] || 0) + 1
          return acc
        }, {})
      }
    }

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
