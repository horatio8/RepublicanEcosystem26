/**
 * Event scraper — fetches events from conservative organization websites.
 * Runs as a Vercel cron job via /api/jobs/scrape-events.
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
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const response = await fetch(target.url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
      redirect: 'follow',
    })
    clearTimeout(timeout)

    if (!response.ok) {
      console.warn(`${target.name}: HTTP ${response.status}`)
      return events
    }

    const html = await response.text()

    // Strategy 1: Extract JSON-LD events
    const jsonLdMatches = html.matchAll(
      /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    )
    for (const match of jsonLdMatches) {
      try {
        const raw = match[1].trim()
        if (!raw) continue
        const data = JSON.parse(raw)
        const items = Array.isArray(data) ? data : [data]
        for (const item of items) {
          if (item['@type'] === 'Event') {
            events.push(parseJsonLdEvent(item, target))
          }
          // Handle @graph arrays (common in WordPress sites)
          if (item['@graph']) {
            for (const g of item['@graph']) {
              if (g['@type'] === 'Event') {
                events.push(parseJsonLdEvent(g, target))
              }
            }
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

    // Strategy 2: Extract from common event HTML structures
    if (events.length === 0) {
      const patterns = [
        // Event titles in heading tags with event-related classes
        /<(?:h[1-4]|a)[^>]*class="[^"]*(?:event[_-]?title|entry[_-]?title|card[_-]?title)[^"]*"[^>]*>([^<]{6,200})</gi,
        // data attributes
        /<[^>]*data-event-(?:title|name)="([^"]{6,200})"/gi,
        // Anchor tags with event-related hrefs containing title text
        /<a[^>]*href="[^"]*event[^"]*"[^>]*>([^<]{6,200})<\/a>/gi,
      ]
      for (const pattern of patterns) {
        for (const m of html.matchAll(pattern)) {
          const name = m[1].trim().replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"')
          if (name && name.length > 5 && name.length < 200 && !name.includes('{') && !name.includes('<')) {
            // Avoid duplicates
            if (!events.some((e) => e.name === name)) {
              events.push({
                name,
                organizer: target.name,
                source_url: target.url,
              })
            }
          }
        }
      }
    }

    // Strategy 3: Look for iCal/ICS links that indicate events
    if (events.length === 0) {
      const icalMatches = html.matchAll(/href="([^"]*\.ics[^"]*)"/gi)
      for (const m of icalMatches) {
        // The filename often contains the event name
        const url = m[1]
        const parts = url.split('/').pop().replace('.ics', '').replace(/[-_]/g, ' ')
        if (parts.length > 5) {
          events.push({
            name: parts,
            organizer: target.name,
            source_url: target.url,
            registration_url: url.startsWith('http') ? url : target.url,
          })
        }
      }
    }

    console.log(`${target.name}: found ${events.length} events`)
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn(`${target.name}: request timed out`)
    } else {
      console.error(`Scrape failed for ${target.name}: ${error.message}`)
    }
  }
  return events
}

function parseJsonLdEvent(data, target) {
  const location = data.location || {}
  let address = {}
  let locationName = ''

  if (typeof location === 'string') {
    locationName = location
  } else if (typeof location === 'object') {
    locationName = location.name || ''
    if (location.address) {
      address = typeof location.address === 'string'
        ? { streetAddress: location.address }
        : location.address
    }
  }

  return {
    name: (data.name || '').trim(),
    description: (data.description || '').replace(/<[^>]+>/g, '').slice(0, 1000),
    organizer: target.name,
    start_date: data.startDate || null,
    end_date: data.endDate || null,
    location: locationName,
    city: typeof address === 'object' ? address.addressLocality || '' : '',
    state: typeof address === 'object' ? address.addressRegion || '' : '',
    registration_url: data.url || '',
    source_url: target.url,
  }
}

/**
 * Run all scrapers and return discovered events.
 */
export async function scrapeAllEvents() {
  const allEvents = []
  // Run scrapers in parallel batches of 3 to avoid rate limits
  for (let i = 0; i < SCRAPE_TARGETS.length; i += 3) {
    const batch = SCRAPE_TARGETS.slice(i, i + 3)
    const results = await Promise.allSettled(batch.map(scrapeTarget))
    for (const result of results) {
      if (result.status === 'fulfilled') {
        allEvents.push(...result.value)
      } else {
        console.error('Batch item failed:', result.reason?.message)
      }
    }
    // Small delay between batches
    if (i + 3 < SCRAPE_TARGETS.length) {
      await new Promise((r) => setTimeout(r, 1000))
    }
  }
  console.log(`Total events scraped: ${allEvents.length}`)
  return allEvents
}

export { SCRAPE_TARGETS }
