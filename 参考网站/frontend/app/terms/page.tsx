/**
 * Terms of Service Page - Smart Home TechHub
 */

import { siteConfig } from '@/config/site.config';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: 'Terms of Service - SmartHome TechHub',
    description: 'Terms of Service and Use of Content policy for SmartHome TechHub',
  };
}

export default function TermsOfServicePage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-brand-bg py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-h1 md:text-display text-slate-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-slate-600">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm space-y-8">

            {/* Agreement to Terms */}
            <section>
              <h2 className="text-h2 mb-4">1. Agreement to Terms</h2>
              <p className="text-body mb-4">
                By accessing or using SmartHome TechHub (the "Website"), operated by SmartHome TechHub ("we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Website.
              </p>
              <p className="text-body">
                These Terms constitute a legally binding agreement between you and SmartHome TechHub. We reserve the right to modify these Terms at any time, and your continued use of the Website following any changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Use of Content */}
            <section>
              <h2 className="text-h2 mb-4">2. Use of Content</h2>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">2.1 Content Ownership</h3>
              <p className="text-body mb-4">
                All content on SmartHome TechHub, including but not limited to text, graphics, logos, images, videos, software, and other materials ("Content"), is owned by SmartHome TechHub or its licensors and is protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">2.2 Permitted Use</h3>
              <p className="text-body mb-4">You may access and use the Content for the following purposes:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Personal, non-commercial use</li>
                <li>Educational purposes with proper attribution</li>
                <li>Sharing links to our content on social media</li>
                <li>Quoting brief excerpts (up to 100 words) with attribution to SmartHome TechHub</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">2.3 Prohibited Uses</h3>
              <p className="text-body mb-4">Without our express written permission, you may not:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Copy, reproduce, modify, translate, or create derivative works of our Content</li>
                <li>Republish full articles or substantial portions on your website</li>
                <li>Use our Content for commercial purposes without written consent</li>
                <li>Remove or alter any copyright, trademark, or attribution notices</li>
                <li>Scrape, harvest, or data mine our Content</li>
                <li>Use automated systems to access our Content without permission</li>
                <li>Reverse engineer any software or technology on our Website</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">2.4 Content Licensing</h3>
              <p className="text-body">
                For permission to use our Content beyond what is permitted in these Terms, please contact us at licensing@smarthometechhub.com. We offer content licensing options for publishers, businesses, and organizations.
              </p>
            </section>

            {/* User Conduct */}
            <section>
              <h2 className="text-h2 mb-4">3. User Conduct</h2>
              <p className="text-body mb-4">By using our Website, you agree to:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Use the Website only for lawful purposes</li>
                <li>Not attempt to gain unauthorized access to our systems or networks</li>
                <li>Not use the Website to transmit malware, viruses, or harmful code</li>
                <li>Not interfere with other users' enjoyment of the Website</li>
                <li>Not post spam, fake reviews, or misleading information</li>
                <li>Respect the intellectual property rights of others</li>
                <li>Not impersonate SmartHome TechHub or any other person or entity</li>
              </ul>
              <p className="text-body">
                We reserve the right to terminate or restrict access to our Website for users who violate these Terms.
              </p>
            </section>

            {/* Affiliate Links and Advertising */}
            <section>
              <h2 className="text-h2 mb-4">4. Affiliate Links and Advertising</h2>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">4.1 Affiliate Disclosure</h3>
              <p className="text-body mb-4">
                SmartHome TechHub participates in various affiliate marketing programs, including Amazon Associates, ShareASale, and others. This means we may earn a commission when you make a purchase through our affiliate links at no additional cost to you.
              </p>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">4.2 Editorial Independence</h3>
              <p className="text-body mb-4">
                <strong>Our editorial content is independent and unbiased.</strong> Affiliate relationships do not influence our product reviews, recommendations, or opinions. We only recommend products we genuinely believe offer value to our readers.
              </p>
              <p className="text-body mb-4">
                We maintain the following principles:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>We do not accept payment for positive reviews</li>
                <li>We test products thoroughly before making recommendations</li>
                <li>We disclose affiliate relationships clearly</li>
                <li>We update reviews based on ongoing testing</li>
                <li>We welcome feedback about products we recommend</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mb-3 mt-4">4.3 Third-Party Websites</h3>
              <p className="text-body">
                Our Website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of these websites. Your interaction with these websites is governed by their terms and conditions.
              </p>
            </section>

            {/* Product Reviews and Recommendations */}
            <section>
              <h2 className="text-h2 mb-4">5. Product Reviews and Recommendations</h2>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">5.1 Testing Methodology</h3>
              <p className="text-body mb-4">
                Our product recommendations are based on hands-on testing, research, and expertise. We disclose our testing methods in each review. However, product performance can vary based on individual circumstances, and we cannot guarantee results.
              </p>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">5.2 Pricing and Availability</h3>
              <p className="text-body mb-4">
                Prices and availability mentioned on our Website are subject to change. We strive to keep information accurate but cannot guarantee the completeness or timeliness of product information. Always verify pricing and availability on the retailer's website before purchasing.
              </p>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">5.3 No Warranty</h3>
              <p className="text-body">
                We provide product reviews and recommendations for informational purposes only. We do not warrant the quality, safety, or suitability of any products featured on our Website. Always consult manufacturer specifications and user manuals before purchasing smart home appliances.
              </p>
            </section>

            {/* User Comments and Submissions */}
            <section>
              <h2 className="text-h2 mb-4">6. User Comments and Submissions</h2>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">6.1 User-Generated Content</h3>
              <p className="text-body mb-4">
                If you submit comments, questions, or other content to our Website, you grant SmartHome TechHub a non-exclusive, royalty-free, perpetual, and worldwide license to use, display, reproduce, and distribute such content for any purpose.
              </p>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">6.2 Comment Guidelines</h3>
              <p className="text-body mb-4">We encourage constructive comments but reserve the right to remove or moderate content that:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Contains spam, advertising, or self-promotion</li>
                <li>Is defamatory, abusive, or harassing</li>
                <li>Violates the privacy rights of others</li>
                <li>Contains hate speech or discriminatory language</li>
                <li>Is off-topic or irrelevant</li>
                <li>Violates any applicable laws</li>
              </ul>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-h2 mb-4">7. Disclaimers</h2>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">7.1 "As Is" and "As Available"</h3>
              <p className="text-body mb-4">
                The Website is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">7.2 Technical Accuracy</h3>
              <p className="text-body mb-4">
                While we strive for accuracy, we do not warrant that:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>The Website will be uninterrupted, secure, or error-free</li>
                <li>Content is always accurate, complete, or up-to-date</li>
                <li>The Website will function with your particular equipment or software</li>
                <li>Defects will be corrected</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">7.3 Professional Advice Disclaimer</h3>
              <p className="text-body">
                The Content on this Website is for informational purposes only and does not constitute professional advice (technical, financial, legal, or otherwise). Always consult with qualified professionals for specific advice regarding smart home installation, electrical work, or home automation systems.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-h2 mb-4">8. Limitation of Liability</h2>
              <p className="text-body mb-4">
                To the fullest extent permitted by applicable law, SmartHome TechHub shall not be liable for:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Indirect, incidental, special, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Personal injury or property damage resulting from product use</li>
                <li>Actions taken based on reliance on our Content</li>
                <li>Malware or viruses that may infect your computer</li>
              </ul>
              <p className="text-body">
                Our total liability shall not exceed the amount you paid (if any) to access the Website. Some jurisdictions do not allow the exclusion of certain warranties or limitations of liability, so the above limitations may not apply to you.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-h2 mb-4">9. Intellectual Property</h2>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">9.1 Trademarks</h3>
              <p className="text-body mb-4">
                SmartHome TechHub, the SmartHome TechHub logo, and other trademarks, service marks, and trade names displayed on our Website are registered or unregistered trademarks of SmartHome TechHub. Nothing on our Website should be construed as granting any license or right to use any trademark displayed on our Website.
              </p>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">9.2 DMCA Notice and Takedown</h3>
              <p className="text-body mb-4">
                We respect the intellectual property rights of others and comply with the Digital Millennium Copyright Act (DMCA). If you believe your copyrighted work has been copied in a way that constitutes copyright infringement, please provide our designated agent with the following information:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Your physical or electronic signature</li>
                <li>Description of the copyrighted work you claim has been infringed</li>
                <li>Description of where the infringing material is located on our Website</li>
                <li>Your address, telephone number, and email address</li>
                <li>Statement of good faith belief that the disputed use is unauthorized</li>
                <li>Statement that the information is accurate, under penalty of perjury</li>
              </ul>
              <p className="text-body mt-4">
                <strong>DMCA Agent Contact:</strong> legal@smarthometechhub.com
              </p>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-h2 mb-4">10. Indemnification</h2>
              <p className="text-body">
                You agree to indemnify, defend, and hold harmless SmartHome TechHub, its officers, directors, employees, contractors, agents, and affiliates from and against any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Your use of the Website</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>User-submitted content you post on our Website</li>
              </ul>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-h2 mb-4">11. Termination</h2>
              <p className="text-body">
                We reserve the right to terminate or suspend your access to our Website immediately, without prior notice, for any breach of these Terms. Upon termination, your right to use the Website will cease, and all provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-h2 mb-4">12. Governing Law and Dispute Resolution</h2>
              <p className="text-body">
                These Terms shall be governed by and construed in accordance with the laws of the United States. Any disputes arising from these Terms shall be resolved through good faith negotiations. If negotiations fail, disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
              </p>
            </section>

            {/* General Provisions */}
            <section>
              <h2 className="text-h2 mb-4">13. General Provisions</h2>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and SmartHome TechHub.</li>
                <li><strong>Severability:</strong> If any provision is found invalid, the remaining provisions remain in full force.</li>
                <li><strong>Waiver:</strong> Failure to enforce any provision does not constitute a waiver.</li>
                <li><strong>Assignment:</strong> You may not assign these Terms without our consent.</li>
                <li><strong>Force Majeure:</strong> We are not liable for delays due to circumstances beyond our control.</li>
              </ul>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-h2 mb-4">14. Contact Us</h2>
              <p className="text-body mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <p className="text-slate-700 mb-2"><strong>General Inquiries:</strong> legal@smarthometechhub.com</p>
                <p className="text-slate-700 mb-2"><strong>Content Licensing:</strong> licensing@smarthometechhub.com</p>
                <p className="text-slate-700 mb-2"><strong>DMCA Agent:</strong> legal@smarthometechhub.com</p>
                <p className="text-slate-700"><strong>Website:</strong> smarthometechhub.com</p>
              </div>
            </section>

          </div>

          {/* Bottom Note */}
          <div className="mt-8 text-center text-sm text-slate-600">
            <p>
              By using SmartHome TechHub, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
            <p className="mt-2">
              &copy; {currentYear} SmartHome TechHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
