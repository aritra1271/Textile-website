export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-black mb-8 uppercase tracking-tight">Privacy Policy</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed">
              We collect information you provide directly to us, such as when you create an account, make a purchase, or
              contact us for support.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, process transactions,
              and communicate with you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at orders@sanjibtextile.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
