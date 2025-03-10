import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Gistr",
  description: "Privacy policy and data handling practices for Gistr",
};

export default function PrivacyPolicy() {
  return (
    <article className="prose dark:prose-invert max-w-none space-y-8 p-4">
      <h1 className="text-4xl font-bold">Privacy Policy for Gistr</h1>

      <p className="text-lg">
        <strong>Effective Date:</strong> January 10, 2025
      </p>

      <p className="text-lg leading-relaxed">
        Gistr (referred to as &quot;we,&quot; &quot;our,&quot; or
        &quot;us&quot;) operates the web application at{" "}
        <a
          href="https://app.getgistr.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          https://app.getgistr.com
        </a>
        (&quot;Website&quot;) and the Gistr Chrome Extension
        (&quot;Extension&quot;). This Privacy Policy explains how we collect,
        use, and safeguard your data when you use our services.
      </p>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">1. Information We Collect</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">a. Account Information</h3>
          <p className="text-lg">
            When you sign up for Gistr, we collect the following personal
            information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Email address:</strong> Required for account creation and
              authentication.
            </li>
            <li>
              <strong>Password:</strong> Used for securing your account.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">b. Saved Summaries</h3>
          <p className="text-lg">
            We store your saved article summaries, including metadata like URLs,
            titles, and user-provided ratings or tags.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">c. Chrome Extension Data</h3>
          <p className="text-lg">The Gistr Chrome Extension stores:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Your Supabase access and refresh tokens for authentication
              purposes.
            </li>
            <li>
              Your saved summaries for offline access and synchronization with
              the web app.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">d. Non-Personal Information</h3>
          <p className="text-lg">
            We may collect anonymized or aggregated usage data, such as:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Browser type</li>
            <li>Device information</li>
            <li>Interaction patterns with our Website and Extension</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            e. Cookies and Tracking Technologies
          </h3>
          <p className="text-lg">
            We use cookies and similar technologies to enhance user experience
            and analyze app performance. These may include session cookies for
            login persistence and analytics cookies for improving our services.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">2. How We Use Your Data</h2>
        <p className="text-lg">We use the collected data to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide, maintain, and improve our services.</li>
          <li>Authenticate users and secure accounts.</li>
          <li>
            Synchronize saved article summaries across the Website and
            Extension.
          </li>
          <li>Enhance user experience through personalized features.</li>
          <li>
            Analyze usage trends and optimize our platform&apos;s performance.
          </li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">3. Data Sharing and Disclosure</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">a. Service Providers</h3>
          <p className="text-lg">
            We may share your data with third-party providers like Supabase,
            which handles data storage and authentication. These providers
            adhere to strict data protection policies.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">b. Legal Compliance</h3>
          <p className="text-lg">
            We may disclose your data if required to do so by law or if we
            believe such action is necessary to comply with legal obligations or
            protect the rights, property, or safety of our users.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">c. Aggregated Data</h3>
          <p className="text-lg">
            Non-personal, anonymized data may be shared with third parties for
            analytical purposes.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">4. Data Storage and Security</h2>
        <div className="space-y-4">
          <p className="text-lg">
            <strong>Data Storage:</strong> Your data is securely stored in our
            Supabase database, which employs encryption and industry-standard
            security practices.
          </p>
          <p className="text-lg">
            <strong>Access Tokens:</strong> Chrome Extension access and refresh
            tokens are securely stored locally on your device and are never
            shared with unauthorized parties.
          </p>
          <p className="text-lg">
            <strong>Security Measures:</strong> We implement HTTPS, encryption,
            and regular security audits to protect your data from unauthorized
            access, alteration, or disclosure.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">5. Your Rights</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            a. Access and Update Information
          </h3>
          <p className="text-lg">
            You can access and update your account information through the Gistr
            web application.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">b. Data Deletion</h3>
          <p className="text-lg">
            You may request the deletion of your account and associated data by
            contacting us at{" "}
            <a href="mailto:jcgentr@icloud.com" className="hover:underline">
              jcgentr@icloud.com
            </a>
            .
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">c. Cookie Preferences</h3>
          <p className="text-lg">
            You can manage your cookie preferences through your browser
            settings.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">
          6. Changes to This Privacy Policy
        </h2>
        <p className="text-lg">
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page, and we will notify you of significant updates
          via email or app notifications. Continued use of our services after
          the changes take effect constitutes your acceptance of the revised
          Privacy Policy.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">7. Contact Us</h2>
        <p className="text-lg">
          If you have any questions or concerns about this Privacy Policy,
          please contact us at:
        </p>
        <p className="text-lg">
          <strong>Email:</strong>{" "}
          <a href="mailto:jcgentr@icloud.com" className="hover:underline">
            jcgentr@icloud.com
          </a>
        </p>
        <p className="text-lg">
          <strong>Mailing Address:</strong> 309 Laurel Oak Ct., Spartanburg, SC,
          29306
        </p>
      </section>

      <p className="text-lg italic">
        Thank you for trusting Gistr to enhance your reading experience.
      </p>
    </article>
  );
}
