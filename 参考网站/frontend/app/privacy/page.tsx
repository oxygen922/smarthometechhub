/**
 * Privacy Policy Page - Smart Home TechHub
 */

import { siteConfig } from '@/config/site.config';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: 'Privacy Policy - SmartHome TechHub',
    description: 'Learn how SmartHome TechHub collects, uses, and protects your personal information.',
  };
}

export default function PrivacyPolicyPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-brand-bg py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-h1 md:text-display text-slate-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-subtitle text-slate-600">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm space-y-8">

            {/* Introduction */}
            <section>
              <h2 className="text-h2 mb-4">Our Commitment to Your Privacy</h2>
              <p className="text-body mb-4">
                At SmartHome TechHub, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website smarthometechhub.com. Please read this policy carefully.
              </p>
              <p className="text-body">
                By using SmartHome TechHub, you consent to the data practices described in this policy. If you do not agree with the terms of this privacy policy, please do not access our website.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-h2 mb-4">1. Information We Collect</h2>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">1.1 Information You Provide to Us</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li><strong>Email Address:</strong> When you subscribe to our newsletter</li>
                <li><strong>Contact Information:</strong> When you reach out via our contact form</li>
                <li><strong>Comments and Feedback:</strong> When you leave comments or participate in discussions</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">1.2 Information Automatically Collected</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong>Usage Data:</strong> Pages viewed, time spent, links clicked, navigation paths</li>
                <li><strong>Cookies and Tracking Technologies:</strong> See our Cookie Policy below</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">1.3 Third-Party Services</h3>
              <p className="text-body">
                We use third-party services that may collect information about you, including Google Analytics, email service providers, and affiliate networks. These third parties have their own privacy policies.
              </p>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-h2 mb-4">2. How We Use Your Information</h2>
              <p className="text-body mb-4">We use the information we collect for the following purposes:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>To deliver and improve our content and services</li>
                <li>To send you newsletters, updates, and promotional content (with your consent)</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To analyze website traffic and user behavior to improve user experience</li>
                <li>To detect, prevent, and address technical issues and security threats</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-h2 mb-4">3. Cookies and Tracking Technologies</h2>
              <p className="text-body mb-4">
                We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
              </p>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">Types of Cookies We Use:</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                <li><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>

              <p className="text-body">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
              </p>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-h2 mb-4">4. Third-Party Services and Affiliates</h2>
              <p className="text-body mb-4">
                SmartHome TechHub contains links to third-party websites and uses affiliate marketing programs. We are not responsible for the privacy practices of these third parties.
              </p>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">Affiliate Links:</h3>
              <p className="text-body mb-4">
                Some links on our website are affiliate links. If you make a purchase through these links, we may earn a commission at no additional cost to you. We only recommend products we genuinely believe in. Affiliate relationships do not influence our editorial opinions.
              </p>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">Third-Party Services We Use:</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                <li><strong>Email Service Providers:</strong> For newsletter delivery and management</li>
                <li><strong>Affiliate Networks:</strong> Including Amazon Associates, ShareASale, and others</li>
                <li><strong>Content Delivery Networks:</strong> For faster content delivery</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-h2 mb-4">5. Data Security</h2>
              <p className="text-body mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no method of transmission over the Internet is 100% secure.
              </p>
              <p className="text-body">
                We do not store credit card information or payment details. All payments are processed through secure third-party payment processors.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-h2 mb-4">6. Your Privacy Rights</h2>
              <p className="text-body mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Objection:</strong> Object to processing of your personal data</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Data Portability:</strong> Request transfer of your data</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              </ul>
              <p className="text-body">
                To exercise these rights, please contact us at privacy@smarthometechhub.com
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-h2 mb-4">7. Children's Privacy</h2>
              <p className="text-body">
                Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will delete such information.
              </p>
            </section>

            {/* International Users */}
            <section>
              <h2 className="text-h2 mb-4">8. International Data Transfers</h2>
              <p className="text-body">
                SmartHome TechHub may transfer and process your information in countries other than your own. We ensure that your data is protected in accordance with this Privacy Policy and applicable laws, including the EU-U.S. Data Privacy Framework and UK Extension.
              </p>
            </section>

            {/* Policy Updates */}
            <section>
              <h2 className="text-h2 mb-4">9. Updates to This Privacy Policy</h2>
              <p className="text-body">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-h2 mb-4">10. Contact Us</h2>
              <p className="text-body mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <p className="text-slate-700 mb-2"><strong>Email:</strong> privacy@smarthometechhub.com</p>
                <p className="text-slate-700 mb-2"><strong>Website:</strong> smarthometechhub.com</p>
                <p className="text-slate-700"><strong>Mailing Address:</strong> SmartHome TechHub Editorial Team</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
