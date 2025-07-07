export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-black mb-8 uppercase tracking-tight">Return Policy</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Return Window</h2>
            <p className="text-gray-700 leading-relaxed">
              You have 30 days from the date of purchase to return items for a full refund, provided they are in
              original condition with tags attached.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Return Process</h2>
            <p className="text-gray-700 leading-relaxed">
              To initiate a return, please contact us at orders@sanjibtextile.com with your order number and reason for
              return.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Refund Processing</h2>
            <p className="text-gray-700 leading-relaxed">
              Refunds will be processed within 5-7 business days after we receive your returned items.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              For any questions about returns, please contact us at:
              <br />
              Email: orders@sanjibtextile.com
              <br />
              Phone: +91 7595858158
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
