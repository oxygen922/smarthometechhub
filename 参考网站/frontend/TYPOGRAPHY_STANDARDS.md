# Typography Standards - SmartHome TechHub

**Last Updated:** 2026-04-29

## Font Family Standard

All text uses **Inter** font family exclusively.

```css
font-family: var(--font-inter);
```

- Removed Playfair Display (serif font)
- Kept JetBrains Mono for code only
- All titles and body text use Inter

---

## Heading Sizes

| Tag | Desktop Size | Mobile Size | Line Height | Font Weight |
|-----|-------------|-------------|-------------|-------------|
| H1  | 32-36px     | 32px        | 1.2         | 700         |
| H2  | 28-32px     | 28px        | 1.25        | 700         |
| H3  | 24-28px     | 24px        | 1.3         | 600         |
| H4  | 20-24px     | 20px        | 1.35        | 600         |
| H5  | 18px        | 18px        | 1.4         | 600         |
| H6  | 16px        | 16px        | 1.4         | 600         |

### Special Display Sizes

- **Display**: 40-64px (Hero sections)
- **Headline**: 28-48px (Section headers)

---

## Hero Banner Standards

**Purpose:** Homepage hero section with maximum visual impact

| Element | Mobile (< 640px) | Tablet (640-1024px) | Desktop (1024px+) | Large (1280px+) |
|---------|------------------|---------------------|------------------|-----------------|
| **Main Title** | 36px (text-4xl) | 48px (text-5xl) | 60px (text-6xl) | 72px |
| **Subtitle Badge** | 14px (text-sm) | 16px (text-base) | 16px (text-base) | 16px |
| **Description** | 16px (text-base) | 18px (text-lg) | 20px (text-xl) | 24px (text-2xl) |
| **Button Text** | 14px (text-sm) | 14px (text-sm) | 16px (text-base) | 16px |
| **Line Height (Title)** | 1.1 | 1.1 | 1.1 | 1.1 |
| **Line Height (Description)** | 1.6 | 1.6 | 1.6 | 1.6 |

**CSS Classes:**
```tsx
<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[72px]">
  {title}
</h1>
<p className="text-base sm:text-lg md:text-xl lg:text-2xl">
  {description}
</p>
```

**Industry Standard Reference:**
- Apple.com: 56-80px hero titles
- Stripe.com: 48-72px hero titles
- Vercel.com: 48-64px hero titles
- Our implementation: 36-72px (competitive and balanced)

---

## Body Text Standards

| Element       | Size  | Line Height | Margin Bottom |
|---------------|-------|-------------|---------------|
| Body Text     | 18px  | 1.6         | 20px          |
| Body Compact  | 18px  | 1.5         | 20px          |
| Body Relaxed  | 18px  | 1.8         | 20px          |
| Small Body    | 16px  | 1.6         | 16px          |
| Subtitle      | 16-18px | 1.5       | -             |
| Caption       | 14px  | 1.4         | -             |

---

## Paragraph Spacing

- **Standard**: 20px
- **Compact**: 16px
- **Relaxed**: 24px
- **Spacious**: 32px

---

## CSS Classes Reference

### Headings
```tsx
<h1 className="text-h1">Title</h1>
<h2 className="text-h2">Subtitle</h2>
<h3 className="text-h3">Section</h3>
<h4 className="text-h4">Subsection</h4>
<h5 className="text-h5">Minor Heading</h5>
<h6 className="text-h6">Tiny Heading</h6>
```

### Body Text
```tsx
<p className="text-body">Standard paragraph</p>
<p className="text-body-compact">Tighter leading</p>
<p className="text-body-relaxed">Looser leading</p>
<p className="text-body-small">Smaller text</p>
```

### Special
```tsx
<h1 className="text-display">Hero title</h1>
<h2 className="text-headline">Section header</h2>
<h3 className="text-title">Card title</h3>
<p className="text-subtitle">Description</p>
<span className="text-caption">Label</span>
<span className="text-overline">Badge</span>
```

---

## Responsive Behavior

Mobile devices (< 768px):
- Display text scales down to 32px
- Body text remains 18px (best practice)
- All headings scale proportionally
- Optimized for touch targets

**Hero Banner Special Scaling:**
- Mobile (< 640px): 36px titles - readable without being overwhelming
- Tablet (640-1024px): 48px titles - balanced for medium screens
- Desktop (1024-1280px): 60px titles - impactful on standard laptops
- Large (> 1280px): 72px titles - maximum impact on large displays

---

## Industry Best Practices Reference

## Article Content Standards

### Markdown Content (.markdown-content)

```css
/* Headings */
h1: 32px, line-height 1.2, font-weight 700
h2: 28px, line-height 1.25, font-weight 700
h3: 24px, line-height 1.3, font-weight 600
h4: 20px, line-height 1.35, font-weight 600
h5: 18px, line-height 1.4, font-weight 600
h6: 16px, line-height 1.4, font-weight 600

/* Body Elements */
p: 18px, line-height 1.6, margin-bottom 20px
ul/ol: 18px, line-height 1.6, margin-bottom 20px
li: margin-bottom 8px
blockquote: italic, 18px, border-left 4px solid brand-primary
```

---

## Usage Guidelines

### DO ✅
- Use `text-body` for all article content
- Use semantic HTML (h1-h6 in order)
- Maintain consistent spacing (20px between paragraphs)
- Use responsive classes for better mobile experience
- Apply `line-clamp` for truncating long text

### DON'T ❌
- Don't use `font-serif` anymore
- Don't use arbitrary font sizes
- Don't mix different font families (except code/mono)
- Don't use line-height below 1.2 for headings
- Don't use line-height below 1.5 for body text

---

## Component Updates Completed

✅ ArticleContent.tsx
✅ ArticleCard.tsx
✅ HeroGrid.tsx
✅ ImageScrollHero.tsx
✅ NewsletterSubscribe.tsx
✅ All page.tsx files
✅ All legal pages (privacy, terms, disclaimer)

---

## Future Content Standards

All new components and pages MUST follow these standards:

1. **Font**: Inter only (no serif)
2. **Body size**: 18px minimum
3. **Heading sizes**: Follow h1-h6 scale
4. **Line height**: 1.2-1.4 (headings), 1.5-1.8 (body)
5. **Paragraph spacing**: 20px standard
6. **Responsive**: Mobile-first approach

---

## Testing Checklist

- [ ] All headings use Inter font
- [ ] Body text is 18px minimum
- [ ] Line heights meet standards
- [ ] Paragraph spacing is 20px
- [ ] Mobile display is optimized
- [ ] Article content is readable
- [ ] Legal pages follow standards

---

## Quick Reference Card

```
INTER FONT FAMILY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

H1:  32px / Bold / Line 1.2
H2:  28px / Bold / Line 1.25
H3:  24px / Semibold / Line 1.3
H4:  20px / Semibold / Line 1.35
H5:  18px / Semibold / Line 1.4
H6:  16px / Semibold / Line 1.4

Body:  18px / Regular / Line 1.6 / Space 20px
Small: 16px / Regular / Line 1.6 / Space 16px

All text uses Inter font family.
```

---

## Industry Best Practices Reference

**Hero Banner Standards (Our Implementation vs Industry Leaders):**

| Website | Hero Title Size | Description Size | Our Size |
|---------|----------------|------------------|----------|
| Apple.com | 56-80px | 21-28px | 36-72px title, 16-24px desc |
| Stripe.com | 48-72px | 18-21px | ✅ Competitive |
| Vercel.com | 48-64px | 18px | ✅ Competitive |
| Shopify.com | 48-60px | 18-20px | ✅ Competitive |
| **SmartHome TechHub** | **36-72px** | **16-24px** | **Balanced** |

**Why Our Sizes Work:**
- ✅ Mobile-first: 36px on mobile ensures readability
- ✅ Progressive scaling: Smooth scaling across breakpoints
- ✅ Desktop impact: 72px on large screens matches industry leaders
- ✅ Description clarity: 16-24px ensures supplementary text is readable
- ✅ Visual hierarchy: Clear distinction between title and supporting text

**Accessibility Compliance:**
- WCAG AA: Minimum contrast ratio 4.5:1 ✅
- WCAG AAA: Minimum contrast ratio 7:1 ✅ (where applicable)
- Responsive text: Scales appropriately on all devices ✅
- Line length: Max 75ch for optimal readability ✅

---

*This standard applies to all current and future content on SmartHome TechHub.*
*Last updated: 2026-04-29 with Hero Banner optimization*
