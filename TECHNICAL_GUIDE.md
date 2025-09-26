# Open Graph + Frankfurt Implementation - Technical Guide

## 🏗️ Architecture Overview

### Component Structure
```
components/
└── OpenGraph.tsx              # Centralized OG metadata system
    ├── generateOpenGraphMetadata()     # Base OG function
    ├── generateServiceOpenGraph()      # Services-specific OG
    ├── generateProjectOpenGraph()      # Projects-specific OG
    ├── generateStreamingOpenGraph()    # Streaming-specific OG
    └── generateBlogOpenGraph()         # Blog-specific OG
```

### Route Implementation
```
app/
├── layout.tsx                 # Root metadata + Twitter Cards
├── robots.ts                  # Auto-generated robots.txt
├── sitemap.ts                 # Dynamic sitemap with DB content
└── [content]/[slug]/page.tsx  # Dynamic OG per content type
```

## 🛠️ Implementation Details

### 1. Open Graph Metadata Generation

**File**: `components/OpenGraph.tsx`

```typescript
export function generateOpenGraphMetadata(params: OpenGraphParams): Metadata {
  return {
    metadataBase: new URL('https://duartec.es'),
    title: params.title,
    description: params.description,
    openGraph: {
      title: params.title,
      description: params.description,
      url: params.url,
      siteName: 'Duartec',
      images: [{
        url: params.ogImage || '/og-default.webp',
        width: 1200,
        height: 630,
        alt: params.title
      }],
      locale: 'es_ES',
      type: params.type || 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: params.title,
      description: params.description,
      images: [params.ogImage || '/og-default.webp']
    }
  }
}
```

### 2. Dynamic Sitemap Generation

**File**: `app/sitemap.ts`

```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://duartec.es'
  
  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    // ... more static pages
  ]
  
  // Dynamic content from database
  try {
    const [services, projects, streams] = await Promise.all([
      getServices(),
      getProjects(), 
      getStreams()
    ])
    
    const dynamicPages = [
      ...services.map(service => ({
        url: `${baseUrl}/servicios/${service.slug}`,
        lastModified: new Date(service.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8
      })),
      // ... projects and streams
    ]
    
    return [...staticPages, ...dynamicPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages // Fallback to static pages only
  }
}
```

### 3. Corporate OG Image Generation

**File**: `scripts/generate-og-image.mjs`

```javascript
import sharp from 'sharp';

const svgTemplate = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <!-- Logo and text content -->
</svg>
`;

await sharp(Buffer.from(svgTemplate))
  .webp({ quality: 80 })
  .toFile('public/og-default.webp');
```

## ⚡ Performance Configuration

### Vercel Region Setup

**File**: `vercel.json`
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "regions": ["fra1"]
}
```

**Dashboard Configuration**:
- Project Settings → Functions → Function Regions
- Select: "Frankfurt, Germany (West) - eu-central-1 - fra1"
- Save changes

### Database Co-location
- **Neon PostgreSQL**: eu-central-1 (Frankfurt)
- **Vercel Functions**: fra1 (Frankfurt)  
- **Result**: <1ms DB latency

## 📊 Monitoring & Analytics

### Built-in Analytics
```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### Performance Metrics
- **Target Latency**: <100ms from Spain
- **Core Web Vitals**: Monitored via Speed Insights
- **Edge Network**: Automatic routing based on user location

## 🧪 Testing & Validation

### Open Graph Testing
```bash
# Facebook Debugger
curl -X POST "https://graph.facebook.com/v18.0/" \
  -F "id=https://duartec.es" \
  -F "scrape=true" \
  -F "access_token=YOUR_TOKEN"

# Twitter Cards
curl -X POST "https://cards-dev.twitter.com/validator" \
  -d "url=https://duartec.es"
```

### Performance Testing
```bash
# Latency test
curl -w "%{time_total}\n" -o /dev/null -s https://duartec.es

# Regional routing verification  
dig duartec.es
nslookup duartec.es 8.8.8.8
```

### SEO Validation
```bash
# Sitemap accessibility
curl -s https://duartec.es/sitemap.xml | head -20

# Robots.txt validation
curl -s https://duartec.es/robots.txt

# OG image verification
curl -I https://duartec.es/og-default.webp
```

## 🚀 Deployment Pipeline

### Build Process
```bash
# Pre-build validation
node scripts/prebuild.mjs       # Text encoding + MDX validation

# Build with optimizations
pnpm run build:next            # Next.js build with static generation

# Post-build sitemap  
node scripts/postbuild.mjs     # next-sitemap generation
```

### Vercel Deployment
```bash
# Production deployment with region
vercel --prod --regions fra1

# Verify deployment
vercel logs <deployment-url>
```

## 📋 Maintenance Tasks

### Regular Updates
- [ ] **OG Image**: Update corporate branding as needed
- [ ] **Sitemap**: Automatic via database content
- [ ] **Performance**: Monitor via Vercel Analytics dashboard
- [ ] **SEO**: Review meta descriptions quarterly

### Monitoring Checklist  
- [ ] **Latency**: <100ms from Spain (check monthly)
- [ ] **Social Sharing**: Test Facebook/Twitter quarterly  
- [ ] **Search Console**: Monitor sitemap indexing
- [ ] **Core Web Vitals**: Maintain green scores

## 🔧 Troubleshooting

### Common Issues

**Open Graph not updating in social media**
```bash
# Force refresh Facebook cache
curl -X POST "https://developers.facebook.com/tools/debug/clear_cache/?id=https://duartec.es"

# Clear Twitter card cache
# Use: https://cards-dev.twitter.com/validator
```

**High latency despite Frankfurt configuration**
```bash
# Check actual region in build logs
vercel logs <deployment-url> | grep "Running build"
# Should show: "Frankfurt, Germany (West) – fra1"

# Verify DNS routing
dig duartec.es +trace
```

**Sitemap not updating**
```bash
# Check database connection
node -e "console.log(process.env.DATABASE_URL)"

# Test sitemap generation locally
pnpm run postbuild
```

---

*Technical documentation - Updated: September 26, 2025*