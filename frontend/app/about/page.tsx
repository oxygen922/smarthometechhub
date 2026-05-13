import { siteConfig } from '@/config/site.config';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: 'About Us - ' + siteConfig.name,
    description: 'Learn about ' + siteConfig.name + ' and our mission to provide the best travel guides and insights.',
  };
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-bg py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-5xl font-bold text-brand-dark mb-8">
            About Us
          </h1>

          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            <section>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At {siteConfig.name}, we believe that travel is more than just visiting new places—it's about discovering new perspectives, creating lasting memories, and connecting with cultures around the world. Our mission is to provide comprehensive, accurate, and inspiring travel information that helps you plan unforgettable journeys.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
                What We Offer
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-brand-primary mr-3">✓</span>
                  <span>Expertly curated travel guides and itineraries</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-primary mr-3">✓</span>
                  <span>Up-to-date destination information and travel tips</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-primary mr-3">✓</span>
                  <span>Honest reviews and recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-primary mr-3">✓</span>
                  <span>Practical advice for travelers of all experience levels</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
                Our Team
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our team consists of passionate travelers, writers, and photographers who have explored destinations across the globe. We combine firsthand experience with thorough research to bring you content that is both inspiring and practical.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
                Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We'd love to hear from you! Whether you have questions, suggestions, or just want to share your travel stories, feel free to <Link href="/contact" className="text-brand-primary hover:underline">get in touch</Link>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
