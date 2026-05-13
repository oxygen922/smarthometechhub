/**
 * Disclaimer Page - Smart Home TechHub
 */

import { siteConfig } from '@/config/site.config';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: 'Disclaimer - SmartHome TechHub',
    description: 'Disclaimer and limitations of liability for SmartHome TechHub',
  };
}

export default function DisclaimerPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-brand-bg py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-h1 md:text-display text-slate-900 mb-4">
              Disclaimer
            </h1>
            <p className="text-lg text-slate-600">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm space-y-8">

            {/* General Disclaimer */}
            <section className="bg-brand-light/50 rounded-lg p-6 border-l-4 border-brand-primary">
              <h2 className="text-h2 mb-4">General Disclaimer</h2>
              <p className="text-body mb-4">
                The information provided on SmartHome TechHub ("Website") is for general informational and educational purposes only. All information on the Website is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Website.
              </p>
              <p className="text-body">
                Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the Website or reliance on any information provided on the Website. Your use of the Website and your reliance on any information on the Website is solely at your own risk.
              </p>
            </section>

            {/* Product Reviews Disclaimer */}
            <section>
              <h2 className="text-h2 mb-4">1. Product Reviews and Recommendations</h2>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">1.1 Independent Testing</h3>
              <p className="text-body mb-4">
                SmartHome TechHub conducts independent product testing based on our own methodologies and resources. While we strive for thoroughness and objectivity, our reviews reflect our personal experiences and opinions. Individual results may vary based on:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Home environment (size, layout, flooring type)</li>
                <li>Personal preferences and expectations</li>
                <li>Product firmware versions and updates</li>
                <li>Regional availability and feature differences</li>
                <li>User technical expertise</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">1.2 No Guarantee of Performance</h3>
              <p className="text-body mb-4">
                We do not guarantee that any product will perform satisfactorily for your specific needs. Smart home appliance performance can vary significantly based on individual circumstances. We strongly recommend:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Reading multiple reviews before making purchasing decisions</li>
                <li>Testing products in person when possible</li>
                <li>Understanding return policies before purchasing</li>
                <li>Considering your specific use case and environment</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">1.3 Product Availability and Pricing</h3>
              <p className="text-body">
                Product prices, availability, and specifications mentioned on our Website are subject to change without notice. We strive to keep information current but cannot guarantee real-time accuracy. Always verify pricing and availability on the retailer's official website before making a purchase.
              </p>
            </section>

            {/* Affiliate Link Disclaimer */}
            <section>
              <h2 className="text-h2 mb-4">2. Affiliate Link Disclosure</h2>

              <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-lg p-6 mb-4">
                <h3 className="text-lg font-semibold text-brand-primary mb-3">⚠️ Affiliate Disclosure</h3>
                <p className="text-body mb-4">
                  SmartHome TechHub participates in affiliate marketing programs, including Amazon Associates, ShareASale, CJ Affiliate, and other programs. This means we earn commissions from qualifying purchases made through our affiliate links.
                </p>
                <p className="text-body mb-4">
                  <strong>Important points to understand:</strong>
                </p>
                <ul className="list-disc list-inside text-slate-700 space-y-2">
                  <li>Commission earnings do NOT influence our editorial opinions</li>
                  <li>We do NOT accept payment for positive reviews</li>
                  <li>Our recommendations are based on genuine testing and research</li>
                  <li>Affiliate relationships help support our testing operations</li>
                  <li>You pay the same price whether you use our link or not</li>
                </ul>
              </div>

              <p className="text-body">
                Our editorial content is created independently of our affiliate partnerships. We believe in transparency and clearly mark affiliate links where applicable. If you have questions about our affiliate relationships, please contact us at transparency@smarthometechhub.com
              </p>
            </section>

            {/* Technical Advice Disclaimer */}
            <section>
              <h2 className="text-h2 mb-4">3. Technical Advice and Installation</h2>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">3.1 Not Professional Advice</h3>
              <p className="text-body mb-4">
                Content on SmartHome TechHub, including installation guides, troubleshooting tips, and technical advice, is for informational purposes only and does NOT constitute professional technical advice.
              </p>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">3.2 Electrical and Installation Work</h3>
              <p className="text-body mb-4">
                Many smart home devices require electrical installation or modification. We strongly recommend:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Hiring licensed electricians for hardwired installations</li>
                <li>Consulting manufacturer installation guides</li>
                <li>Following local building codes and regulations</li>
                <li>Turning off power before any electrical work</li>
                <li>Using appropriate safety equipment</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">3.3 Network and Security Setup</h3>
              <p className="text-body">
                Smart home devices connect to your home network and may introduce security considerations. We provide security best practices, but we cannot guarantee protection against all cyber threats. Always use strong passwords, enable two-factor authentication when available, and keep device firmware updated.
              </p>
            </section>

            {/* User Responsibility Disclaimer */}
            <section>
              <h2 className="text-h2 mb-4">4. User Responsibility</h2>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">4.1 Research Before Purchasing</h3>
              <p className="text-body mb-4">
                Users are solely responsible for conducting their own research before making purchasing decisions. Consider:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Reading multiple independent reviews</li>
                <li>Checking manufacturer specifications and warranty terms</li>
                <li>Verifying product compatibility with your existing setup</li>
                <li>Understanding return policies and customer support options</li>
                <li>Considering long-term costs (subscriptions, replacement parts, etc.)</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">4.2 Product Use and Safety</h3>
              <p className="text-body">
                Users are responsible for using smart home products safely and in accordance with manufacturer instructions. SmartHome TechHub is not responsible for injuries, property damage, or other losses resulting from product misuse, improper installation, or failure to follow safety guidelines.
              </p>
            </section>

            {/* External Links Disclaimer */}
            <section>
              <h2 className="text-h2 mb-4">5. External Links and Third-Party Content</h2>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">5.1 Third-Party Websites</h3>
              <p className="text-body mb-4">
                Our Website may contain links to external websites, including:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Product manufacturer websites</li>
                <li>Online retailers (Amazon, Best Buy, Home Depot, etc.)</li>
                <li>Other review sites and publications</li>
                <li>Industry news and resources</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">5.2 No Endorsement</h3>
              <p className="text-body">
                These links are provided for convenience and do not signify our endorsement of those websites or their content. We are not responsible for the content, privacy practices, or terms of service of external websites. Always review the policies of any third-party website you visit.
              </p>
            </section>

            {/* Test Results Disclaimer */}
            <section>
              <h2 className="text-h2 mb-4">6. Testing Methodology Limitations</h2>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">6.1 Controlled Environment</h3>
              <p className="text-body mb-4">
                Our product tests are conducted in controlled environments that may differ from your home conditions. Factors that may affect performance include:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Home size and layout</li>
                <li>Flooring types and carpet pile height</li>
                <li>Wi-Fi network strength and configuration</li>
                <li>Presence of pets and children</li>
                <li>Climate and environmental conditions</li>
                <li>Smart home ecosystem compatibility</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">6.2 Sample Variations</h3>
              <p className="text-body">
                We test specific product samples, and manufacturing variations can occur. The product you receive may perform differently than our test unit. We encourage reading multiple reviews to understand the range of user experiences.
              </p>
            </section>

            {/* Software and Firmware Disclaimer */}
            <section>
              <h2 className="text-h2 mb-4">7. Software and Firmware Updates</h2>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">7.1 Changing Features</h3>
              <p className="text-body mb-4">
                Smart home products rely on software and firmware that manufacturers frequently update. These updates can:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Add or remove features</li>
                <li>Change user interface and functionality</li>
                <li>Affect performance and reliability</li>
                <li>Introduce new bugs or fix existing ones</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">7.2 Review Currency</h3>
              <p className="text-body">
                We strive to update our reviews when significant changes occur, but we cannot guarantee real-time accuracy. Always check recent user reviews and manufacturer announcements for the latest product information.
              </p>
            </section>

            {/* Privacy Disclaimer */}
            <section>
              <h2 className="text-h2 mb-4">8. Data Privacy and Smart Devices</h2>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">8.1 Data Collection</h3>
              <p className="text-body mb-4">
                Many smart home devices collect and transmit data, including:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Usage patterns and schedules</li>
                <li>Voice recordings (for voice assistants)</li>
                <li>Camera footage (for security devices)</li>
                <li>Device location and network information</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">8.2 User Responsibility</h3>
              <p className="text-body">
                While we may discuss device privacy features, users are responsible for understanding and managing their privacy settings. Review manufacturer privacy policies and make informed decisions about data collection before purchasing smart home devices.
              </p>
            </section>

            {/* Legal Disclaimer */}
            <section>
              <h2 className="text-h2 mb-4">9. Legal Disclaimer</h2>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">9.1 No Legal Advice</h3>
              <p className="text-body mb-4">
                Content on SmartHome TechHub does not constitute legal advice. Laws regarding:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Smart device recording and surveillance</li>
                <li>Data privacy and consumer protection</li>
                <li>Homeowner association rules</li>
                <li>Building codes and permits</li>
              </ul>
              <p className="text-body mb-4">
                Vary by jurisdiction. Consult qualified legal professionals for advice specific to your situation.
              </p>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">9.2 Intellectual Property</h3>
              <p className="text-body">
                All content on SmartHome TechHub is protected by copyright law. Unauthorized reproduction, distribution, or use of our content is prohibited. See our <Link href="/terms" className="text-brand-primary hover:text-brand-accent underline">Terms of Service</Link> for details on content use permissions.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-h2 mb-4">10. Limitation of Liability</h2>

              <p className="text-body mb-4">
                To the maximum extent permitted by applicable law, SmartHome TechHub, its owners, editors, contributors, and affiliates shall not be liable for:
              </p>

              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, data, business opportunities, or savings</li>
                <li>Personal injury or property damage resulting from product use</li>
                <li>Decisions made based on information on our Website</li>
                <li>Malware, viruses, or other harmful code</li>
                <li>Website interruptions or technical errors</li>
              </ul>

              <p className="text-body">
                In no event shall SmartHome TechHub's total liability exceed the amount, if any, you paid to access our Website. Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so the above limitations may not fully apply to you.
              </p>
            </section>

            {/* Updates to Disclaimer */}
            <section>
              <h2 className="text-h2 mb-4">11. Updates and Modifications</h2>
              <p className="text-body">
                We reserve the right to modify this Disclaimer at any time. Changes will be posted on this page with an updated revision date. Your continued use of the Website following any changes constitutes acceptance of the updated Disclaimer. We encourage you to review this Disclaimer periodically.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-h2 mb-4">12. Questions and Feedback</h2>
              <p className="text-body mb-4">
                If you have questions about this Disclaimer or our practices, please contact us:
              </p>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <p className="text-slate-700 mb-2"><strong>General Inquiries:</strong> contact@smarthometechhub.com</p>
                <p className="text-slate-700 mb-2"><strong>Affiliate Disclosure Questions:</strong> transparency@smarthometechhub.com</p>
                <p className="text-slate-700"><strong>Legal Matters:</strong> legal@smarthometechhub.com</p>
              </div>
            </section>

            {/* Bottom Note */}
            <div className="bg-brand-light/30 rounded-lg p-6 border border-slate-200">
              <p className="text-body text-center">
                <strong>Remember:</strong> Smart home technology is constantly evolving. What works well today may need updates or replacement tomorrow. Our goal is to provide honest, helpful information to guide your decisions, but only you can determine what products best suit your needs and circumstances.
              </p>
            </div>

          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center text-sm text-slate-600 space-y-2">
            <p>
              This Disclaimer is part of our Terms of Service. Please also review our{' '}
              <Link href="/privacy" className="text-brand-primary hover:text-brand-accent underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/terms" className="text-brand-primary hover:text-brand-accent underline">
                Terms of Service
              </Link>.
            </p>
            <p>
              &copy; {currentYear} SmartHome TechHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
