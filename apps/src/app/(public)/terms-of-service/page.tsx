export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service for using our website and Facebook Login.",
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl min-h-[90vh] mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <section className="space-y-6 text-gray-700 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>
            Welcome to [Your Website Name]. By accessing or using our website,
            you agree to comply with these Terms of Service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Use of Our Service</h2>
          <p>
            You agree not to misuse our services, attempt unauthorized access,
            or engage in illegal activities.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            3. Account Registration (Including Facebook Login)
          </h2>
          <p>
            Users may register using email or Facebook Login. When signing in
            via Facebook, we may collect your public profile information and
            email address.
          </p>
          <p>
            We do not post to your Facebook account without your explicit
            permission.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. Deals & Pricing</h2>
          <p>
            We display promotional deals sourced from third-party retailers.
            Prices and availability may change without notice. All purchases
            are made directly with the retailer.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            5. Limitation of Liability
          </h2>
          <p>
            We are not responsible for pricing errors, expired deals, or issues
            arising from third-party websites.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">6. Contact</h2>
          <p>
            If you have questions, please contact us at: support@yourdomain.com
          </p>
        </div>
      </section>
    </div>
  );
}