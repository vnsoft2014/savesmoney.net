export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy explaining how we collect and use data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl min-h-[90vh] mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <section className="space-y-6 text-gray-700 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            1. Information We Collect
          </h2>
          <p>
            When you register using Facebook Login, we may collect:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Name</li>
            <li>Email address</li>
            <li>Public profile information</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            2. How We Use Information
          </h2>
          <p>
            We use your information to create and manage your account,
            personalize your experience, and improve our services.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            3. Third-Party Services
          </h2>
          <p>
            We may use third-party services such as Facebook Login and analytics
            providers. We do not sell your personal information.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            4. Data Security
          </h2>
          <p>
            We implement reasonable security measures to protect your data.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            5. Contact
          </h2>
          <p>
            For privacy-related questions, contact: support@yourdomain.com
          </p>
        </div>
      </section>
    </div>
  );
}