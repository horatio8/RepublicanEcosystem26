/**
 * Event scraper — fetches events from conservative organization websites.
 * Runs as a Vercel cron job.
 */

const SCRAPE_TARGETS = [
  { name: 'Heritage Foundation', url: 'https://www.heritage.org/events' },
  { name: 'American Enterprise Institute', url: 'https://www.aei.org/events/' },
  { name: 'Cato Institute', url: 'https://www.cato.org/events' },
  { name: 'Manhattan Institute', url: 'https://www.manhattan-institute.org/events' },
  { name: 'Federalist Society', url: 'https://fedsoc.org/events' },
  { name: 'Americans for Prosperity', url: 'https://americansforprosperity.org/events/' },
  { name: 'Turning Point USA', url: 'https://www.tpusa.com/events' },
  { name: 'CPAC', url: 'https://cpac.conservative.org/events/' },
  { name: 'Club for Growth', url: 'https://www.clubforgrowth.org/events/' },
  { name: 'Faith & Freedom Coalition', url: 'https://www.ffcoalition.com/events/' },
  { name: 'Young Americas Foundation', url: 'https://www.yaf.org/events/' },
  { name: 'NRA', url: 'https://www.nra.org/events' },
  { name: 'Family Research Council', url: 'https://www.frc.org/events' },
  { name: 'America First Policy Institute', url: 'https://americafirstpolicy.com/events' },
]

/**
 * Scrape a single target for events using JSON-LD structured data
 * and common HTML patterns.
 */
async function scrapeTarget(target) {
  const events = []
  try {
    const response = await fetch(target.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EcosystemBot/1.0)' },
      signal: AbortSignal.timeout(15000),
    })
    if (!response.ok) return events

    const html = await response.text()

    // Extract JSON-LD events
    const jsonLdMatches = html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
    )
    for (const match of jsonLdMatches) {
      try {
        const data = JSON.parse(match[1])
        const items = Array.isArray(data) ? data : [data]
        for (const item of items) {
          if (item['@type'] === 'Event') {
            events.push(parseJsonLdEvent(item, target))
          }
          if (item['@type'] === 'ItemList') {
            for (const el of item.itemListElement || []) {
              const i = el.item || el
              if (i['@type'] === 'Event') {
                events.push(parseJsonLdEvent(i, target))
              }
            }
          }
        }
      } catch {
        // Invalid JSON-LD, skip
      }
    }

    // If no JSON-LD, try to extract from meta tags and common patterns
    if (events.length === 0) {
      // Look for event titles in headings within event-like containers
      const eventPatterns = [
        // Pattern: <h2 class="event-title">...</h2> or similar
        /<(?:h[2-4]|a)[^>]*class="[^"]*(?:event|title)[^"]*"[^>]*>([^<]+)</gi,
        // Pattern: data attributes
        /<[^>]*data-event-title="([^"]+)"/gi,
      ]
      for (const pattern of eventPatterns) {
        for (const m of html.matchAll(pattern)) {
          const name = m[1].trim()
          if (name && name.length > 5 && name.length < 200) {
            events.push({
              name,
              organizer: target.name,
              source_url: target.url,
            })
          }
        }
      }
    }
  } catch (error) {
    console.error(`Scrape failed for ${target.name}: ${error.message}`)
  }
  return events
}

function parseJsonLdEvent(data, target) {
  const location = data.location || {}
  const address = (typeof location === 'object' && location.address) || {}

  return {
    name: data.name || '',
    description: (data.description || '').slice(0, 1000),
    organizer: target.name,
    start_date: data.startDate || null,
    end_date: data.endDate || null,
    location: typeof location === 'string' ? location : location.name || '',
    city: typeof address === 'object' ? address.addressLocality || '' : '',
    state: typeof address === 'object' ? address.addressRegion || '' : '',
    address: typeof address === 'object' ? address.streetAddress || '' : '',
    registration_url: data.url || '',
    source_url: target.url,
  }
}

/**
 * Run all scrapers and return discovered events.
 */
export async function scrapeAllEvents() {
  const allEvents = []
  // Run scrapers in parallel batches of 4 to avoid rate limits
  for (let i = 0; i < SCRAPE_TARGETS.length; i += 4) {
    const batch = SCRAPE_TARGETS.slice(i, i + 4)
    const results = await Promise.allSettled(batch.map(scrapeTarget))
    for (const result of results) {
      if (result.status === 'fulfilled') {
        allEvents.push(...result.value)
      }
    }
  }
  return allEvents
}

export { SCRAPE_TARGETS }
