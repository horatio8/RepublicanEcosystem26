/**
 * NDIS Provider dataset for Australia
 * Includes registered providers across all states/territories
 * with service types, funding, and location data.
 */

export const NDIS_STATS = {
  totalParticipants: 646449,
  totalAnnualFunding: 35_800_000_000, // $35.8 billion (2024-25)
  totalProviders: 18742,
  averagePlanBudget: 55400,
  stateBreakdown: {
    NSW: { participants: 207000, funding: 11_500_000_000, providers: 5980 },
    VIC: { participants: 161000, funding: 8_900_000_000, providers: 4650 },
    QLD: { participants: 131000, funding: 7_300_000_000, providers: 3820 },
    SA: { participants: 55000, funding: 3_100_000_000, providers: 1580 },
    WA: { participants: 52000, funding: 2_900_000_000, providers: 1420 },
    TAS: { participants: 18000, funding: 980_000_000, providers: 520 },
    ACT: { participants: 13000, funding: 720_000_000, providers: 430 },
    NT: { participants: 9449, funding: 400_000_000, providers: 342 },
  },
};

export const SERVICE_CATEGORIES = [
  'Assistive Technology',
  'Behaviour Support',
  'Community Nursing',
  'Coordination of Supports',
  'Daily Life & Living',
  'Early Childhood Intervention',
  'Employment Support',
  'Group & Centre Activities',
  'Home Modifications',
  'Household Tasks',
  'Interpreting & Translation',
  'Personal Activities (High)',
  'Personal Activities (Low)',
  'Plan Management',
  'Specialist Disability Accommodation',
  'Support Coordination',
  'Therapeutic Supports',
  'Transport',
  'Vehicle Modifications',
];

const CATEGORY_COLORS = {
  'Assistive Technology': '#4F46E5',
  'Behaviour Support': '#7C3AED',
  'Community Nursing': '#EC4899',
  'Coordination of Supports': '#F59E0B',
  'Daily Life & Living': '#10B981',
  'Early Childhood Intervention': '#06B6D4',
  'Employment Support': '#8B5CF6',
  'Group & Centre Activities': '#F97316',
  'Home Modifications': '#6366F1',
  'Household Tasks': '#14B8A6',
  'Interpreting & Translation': '#A855F7',
  'Personal Activities (High)': '#EF4444',
  'Personal Activities (Low)': '#F43F5E',
  'Plan Management': '#3B82F6',
  'Specialist Disability Accommodation': '#0EA5E9',
  'Support Coordination': '#22C55E',
  'Therapeutic Supports': '#D946EF',
  'Transport': '#64748B',
  'Vehicle Modifications': '#78716C',
};

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || '#6B7280';
}

// Comprehensive provider dataset across Australia
export const NDIS_PROVIDERS = [
  // === NEW SOUTH WALES ===
  { id: 1, name: 'Ability Options', lat: -33.8688, lng: 151.2093, postcode: '2000', state: 'NSW', city: 'Sydney', categories: ['Daily Life & Living', 'Employment Support', 'Support Coordination'], funding: 42_000_000, participants: 3200, rating: 4.3, phone: '1800 801 601', website: 'abilityoptions.org.au' },
  { id: 2, name: 'Achieve Australia', lat: -33.7738, lng: 151.1126, postcode: '2114', state: 'NSW', city: 'Ryde', categories: ['Daily Life & Living', 'Group & Centre Activities', 'Specialist Disability Accommodation'], funding: 38_000_000, participants: 2800, rating: 4.1, phone: '02 9809 4466', website: 'achieveaustralia.org.au' },
  { id: 3, name: 'Aruma (formerly House with No Steps)', lat: -33.7568, lng: 151.2153, postcode: '2065', state: 'NSW', city: 'Crows Nest', categories: ['Daily Life & Living', 'Employment Support', 'Specialist Disability Accommodation'], funding: 85_000_000, participants: 5400, rating: 4.2, phone: '1300 538 746', website: 'aruma.com.au' },
  { id: 4, name: 'Cerebral Palsy Alliance', lat: -33.8005, lng: 151.2863, postcode: '2029', state: 'NSW', city: 'Rose Bay', categories: ['Therapeutic Supports', 'Early Childhood Intervention', 'Assistive Technology'], funding: 62_000_000, participants: 4100, rating: 4.5, phone: '1300 888 378', website: 'cerebralpalsy.org.au' },
  { id: 5, name: 'Northcott', lat: -33.8890, lng: 151.1957, postcode: '2016', state: 'NSW', city: 'Redfern', categories: ['Daily Life & Living', 'Therapeutic Supports', 'Employment Support'], funding: 95_000_000, participants: 6200, rating: 4.4, phone: '1800 818 286', website: 'northcott.com.au' },
  { id: 6, name: 'Sylvanvale', lat: -33.9608, lng: 150.9336, postcode: '2170', state: 'NSW', city: 'Liverpool', categories: ['Daily Life & Living', 'Support Coordination', 'Community Nursing'], funding: 28_000_000, participants: 1900, rating: 4.0, phone: '02 9829 1299', website: 'sylvanvale.com.au' },
  { id: 7, name: 'Afford (Australian Foundation for Disability)', lat: -33.8932, lng: 151.1774, postcode: '2020', state: 'NSW', city: 'Mascot', categories: ['Employment Support', 'Daily Life & Living', 'Support Coordination'], funding: 35_000_000, participants: 2400, rating: 4.1, phone: '02 9334 2400', website: 'afford.com.au' },
  { id: 8, name: 'LiveBetter', lat: -33.2814, lng: 149.1004, postcode: '2800', state: 'NSW', city: 'Orange', categories: ['Daily Life & Living', 'Support Coordination', 'Household Tasks'], funding: 48_000_000, participants: 3500, rating: 4.0, phone: '1800 580 580', website: 'livebetter.org.au' },
  { id: 9, name: 'Sunnyfield', lat: -33.7969, lng: 151.1873, postcode: '2113', state: 'NSW', city: 'North Ryde', categories: ['Daily Life & Living', 'Employment Support', 'Specialist Disability Accommodation'], funding: 55_000_000, participants: 3800, rating: 4.3, phone: '1300 588 688', website: 'sunnyfield.org.au' },
  { id: 10, name: 'First Peoples Disability Network', lat: -33.8688, lng: 151.2093, postcode: '2000', state: 'NSW', city: 'Sydney', categories: ['Support Coordination', 'Behaviour Support', 'Coordination of Supports'], funding: 12_000_000, participants: 850, rating: 4.6, phone: '02 9267 4195', website: 'fpdn.org.au' },
  { id: 11, name: 'NDIS Plan Management Partners', lat: -33.8523, lng: 151.2108, postcode: '2010', state: 'NSW', city: 'Surry Hills', categories: ['Plan Management'], funding: 22_000_000, participants: 5500, rating: 4.2, phone: '1300 765 243', website: 'ndisplanmanagement.com.au' },
  { id: 12, name: 'Castle Personnel Services', lat: -32.9267, lng: 151.7789, postcode: '2300', state: 'NSW', city: 'Newcastle', categories: ['Employment Support', 'Daily Life & Living'], funding: 18_000_000, participants: 1200, rating: 4.0, phone: '02 4960 7888', website: 'castlepersonnel.com.au' },
  { id: 13, name: 'Hunter Disability Services', lat: -32.9167, lng: 151.7500, postcode: '2290', state: 'NSW', city: 'Charlestown', categories: ['Daily Life & Living', 'Support Coordination', 'Transport'], funding: 14_000_000, participants: 900, rating: 4.1, phone: '02 4946 0400', website: 'hunterdisability.org.au' },
  { id: 14, name: 'Illawarra Disability Services', lat: -34.4278, lng: 150.8931, postcode: '2500', state: 'NSW', city: 'Wollongong', categories: ['Daily Life & Living', 'Group & Centre Activities', 'Household Tasks'], funding: 16_000_000, participants: 1100, rating: 4.2, phone: '02 4227 1079', website: 'ids.org.au' },
  { id: 15, name: 'My Plan Manager', lat: -33.8750, lng: 151.2070, postcode: '2000', state: 'NSW', city: 'Sydney', categories: ['Plan Management'], funding: 45_000_000, participants: 12000, rating: 4.4, phone: '1800 951 599', website: 'myplanmanager.com.au' },

  // === VICTORIA ===
  { id: 16, name: 'Yooralla', lat: -37.8136, lng: 144.9631, postcode: '3000', state: 'VIC', city: 'Melbourne', categories: ['Daily Life & Living', 'Employment Support', 'Therapeutic Supports'], funding: 72_000_000, participants: 5100, rating: 4.2, phone: '1300 966 725', website: 'yooralla.com.au' },
  { id: 17, name: 'Scope Australia', lat: -37.8136, lng: 144.9631, postcode: '3000', state: 'VIC', city: 'Melbourne', categories: ['Daily Life & Living', 'Therapeutic Supports', 'Early Childhood Intervention'], funding: 88_000_000, participants: 6500, rating: 4.3, phone: '1300 472 673', website: 'scopeaust.org.au' },
  { id: 18, name: 'genU (Karingal St Laurence)', lat: -38.1499, lng: 144.3600, postcode: '3220', state: 'VIC', city: 'Geelong', categories: ['Daily Life & Living', 'Employment Support', 'Specialist Disability Accommodation'], funding: 65_000_000, participants: 4800, rating: 4.1, phone: '1300 558 254', website: 'genu.org.au' },
  { id: 19, name: 'Melba Support Services', lat: -37.7510, lng: 145.0020, postcode: '3083', state: 'VIC', city: 'Bundoora', categories: ['Daily Life & Living', 'Behaviour Support', 'Support Coordination'], funding: 42_000_000, participants: 3000, rating: 4.0, phone: '03 9038 5100', website: 'melba.com.au' },
  { id: 20, name: 'EACH', lat: -37.8536, lng: 145.2281, postcode: '3135', state: 'VIC', city: 'Ringwood East', categories: ['Support Coordination', 'Therapeutic Supports', 'Community Nursing'], funding: 55_000_000, participants: 4200, rating: 4.3, phone: '1300 003 224', website: 'each.com.au' },
  { id: 21, name: 'Wallara', lat: -38.0432, lng: 145.3167, postcode: '3805', state: 'VIC', city: 'Narre Warren', categories: ['Daily Life & Living', 'Employment Support', 'Group & Centre Activities'], funding: 25_000_000, participants: 1800, rating: 4.0, phone: '03 8786 4600', website: 'wallara.com.au' },
  { id: 22, name: 'LaunchMe NDIS', lat: -37.8400, lng: 144.9463, postcode: '3006', state: 'VIC', city: 'Southbank', categories: ['Plan Management', 'Support Coordination'], funding: 18_000_000, participants: 4200, rating: 4.5, phone: '1300 052 862', website: 'launchme.com.au' },
  { id: 23, name: 'Interchange Outer East', lat: -37.8536, lng: 145.2281, postcode: '3135', state: 'VIC', city: 'Ringwood', categories: ['Daily Life & Living', 'Group & Centre Activities', 'Transport'], funding: 12_000_000, participants: 850, rating: 4.4, phone: '03 9874 3593', website: 'ioe.org.au' },
  { id: 24, name: 'Villa Maria Catholic Homes', lat: -37.8700, lng: 145.0380, postcode: '3144', state: 'VIC', city: 'Malvern', categories: ['Specialist Disability Accommodation', 'Daily Life & Living', 'Community Nursing'], funding: 38_000_000, participants: 2400, rating: 4.1, phone: '03 9926 6200', website: 'vmch.com.au' },
  { id: 25, name: 'Mambourin', lat: -37.8769, lng: 144.6576, postcode: '3024', state: 'VIC', city: 'Wyndham Vale', categories: ['Employment Support', 'Daily Life & Living', 'Group & Centre Activities'], funding: 22_000_000, participants: 1600, rating: 4.2, phone: '03 9731 9200', website: 'mambourin.org' },
  { id: 26, name: 'Bendigo Community Health Services', lat: -36.7570, lng: 144.2794, postcode: '3550', state: 'VIC', city: 'Bendigo', categories: ['Community Nursing', 'Therapeutic Supports', 'Support Coordination'], funding: 15_000_000, participants: 1100, rating: 4.0, phone: '03 5434 4300', website: 'bchs.com.au' },

  // === QUEENSLAND ===
  { id: 27, name: 'Endeavour Foundation', lat: -27.4698, lng: 153.0251, postcode: '4000', state: 'QLD', city: 'Brisbane', categories: ['Daily Life & Living', 'Employment Support', 'Specialist Disability Accommodation'], funding: 110_000_000, participants: 7500, rating: 4.2, phone: '07 3908 7100', website: 'endeavour.com.au' },
  { id: 28, name: 'Multicap', lat: -27.4675, lng: 153.0284, postcode: '4000', state: 'QLD', city: 'Brisbane', categories: ['Daily Life & Living', 'Specialist Disability Accommodation', 'Employment Support'], funding: 68_000_000, participants: 4200, rating: 4.1, phone: '07 3354 4444', website: 'multicap.org.au' },
  { id: 29, name: 'Montrose Therapy & Respite Services', lat: -27.5600, lng: 152.9451, postcode: '4108', state: 'QLD', city: 'Corinda', categories: ['Therapeutic Supports', 'Early Childhood Intervention', 'Behaviour Support'], funding: 32_000_000, participants: 2200, rating: 4.4, phone: '07 3727 6000', website: 'montrose.org.au' },
  { id: 30, name: 'CPL (Choice, Passion, Life)', lat: -27.4668, lng: 153.0233, postcode: '4006', state: 'QLD', city: 'Fortitude Valley', categories: ['Daily Life & Living', 'Employment Support', 'Assistive Technology'], funding: 75_000_000, participants: 5000, rating: 4.3, phone: '1800 275 753', website: 'cpl.org.au' },
  { id: 31, name: 'Carers Queensland', lat: -27.4516, lng: 153.0264, postcode: '4006', state: 'QLD', city: 'Fortitude Valley', categories: ['Coordination of Supports', 'Support Coordination', 'Plan Management'], funding: 28_000_000, participants: 3800, rating: 4.2, phone: '1800 242 636', website: 'carersqld.com.au' },
  { id: 32, name: 'Breakthru', lat: -27.4305, lng: 153.0250, postcode: '4007', state: 'QLD', city: 'Hamilton', categories: ['Employment Support', 'Daily Life & Living', 'Support Coordination'], funding: 35_000_000, participants: 2600, rating: 4.0, phone: '1800 767 202', website: 'breakthru.org.au' },
  { id: 33, name: 'Synapse (Brain Injury Australia)', lat: -27.4775, lng: 153.0266, postcode: '4000', state: 'QLD', city: 'Brisbane', categories: ['Behaviour Support', 'Therapeutic Supports', 'Support Coordination'], funding: 18_000_000, participants: 1200, rating: 4.3, phone: '1800 673 074', website: 'synapse.org.au' },
  { id: 34, name: 'Cairns Disability Services', lat: -16.9186, lng: 145.7781, postcode: '4870', state: 'QLD', city: 'Cairns', categories: ['Daily Life & Living', 'Support Coordination', 'Transport'], funding: 14_000_000, participants: 900, rating: 4.1, phone: '07 4031 7377', website: 'cairnsdisability.org.au' },
  { id: 35, name: 'Gold Coast NDIS Hub', lat: -28.0167, lng: 153.4000, postcode: '4217', state: 'QLD', city: 'Gold Coast', categories: ['Plan Management', 'Support Coordination', 'Daily Life & Living'], funding: 20_000_000, participants: 1500, rating: 4.0, phone: '07 5527 4888', website: 'gcndis.com.au' },
  { id: 36, name: 'Townsville Disability Support', lat: -19.2590, lng: 146.8169, postcode: '4810', state: 'QLD', city: 'Townsville', categories: ['Daily Life & Living', 'Household Tasks', 'Community Nursing'], funding: 11_000_000, participants: 750, rating: 4.0, phone: '07 4771 5900', website: 'tdisability.org.au' },

  // === SOUTH AUSTRALIA ===
  { id: 37, name: 'Novita', lat: -34.9285, lng: 138.6007, postcode: '5000', state: 'SA', city: 'Adelaide', categories: ['Therapeutic Supports', 'Early Childhood Intervention', 'Assistive Technology'], funding: 65_000_000, participants: 4800, rating: 4.5, phone: '1300 668 482', website: 'novita.org.au' },
  { id: 38, name: 'Community Bridging Services (CBS)', lat: -34.9285, lng: 138.6007, postcode: '5000', state: 'SA', city: 'Adelaide', categories: ['Daily Life & Living', 'Employment Support', 'Support Coordination'], funding: 22_000_000, participants: 1600, rating: 4.1, phone: '08 8352 4390', website: 'cbsinc.org.au' },
  { id: 39, name: 'Orana', lat: -34.8829, lng: 138.6260, postcode: '5031', state: 'SA', city: 'Mile End', categories: ['Daily Life & Living', 'Employment Support', 'Specialist Disability Accommodation'], funding: 35_000_000, participants: 2200, rating: 4.0, phone: '08 8166 7200', website: 'orana.org.au' },
  { id: 40, name: 'Bedford Group', lat: -34.9085, lng: 138.5685, postcode: '5024', state: 'SA', city: 'Fulham', categories: ['Employment Support', 'Daily Life & Living', 'Group & Centre Activities'], funding: 40_000_000, participants: 2800, rating: 4.2, phone: '08 8275 0211', website: 'bedfordgroup.com.au' },
  { id: 41, name: 'Cara', lat: -34.8600, lng: 138.6440, postcode: '5082', state: 'SA', city: 'Prospect', categories: ['Daily Life & Living', 'Specialist Disability Accommodation', 'Community Nursing'], funding: 28_000_000, participants: 1800, rating: 4.1, phone: '08 8347 4588', website: 'cara.org.au' },
  { id: 42, name: 'Minda Incorporated', lat: -35.0099, lng: 138.5384, postcode: '5043', state: 'SA', city: 'Brighton', categories: ['Specialist Disability Accommodation', 'Daily Life & Living', 'Employment Support'], funding: 50_000_000, participants: 3200, rating: 4.3, phone: '08 8422 6000', website: 'minda.com.au' },

  // === WESTERN AUSTRALIA ===
  { id: 43, name: 'Rocky Bay', lat: -32.0569, lng: 115.7439, postcode: '6153', state: 'WA', city: 'Mosman Park', categories: ['Daily Life & Living', 'Therapeutic Supports', 'Assistive Technology'], funding: 52_000_000, participants: 3600, rating: 4.3, phone: '08 6319 0400', website: 'rockybay.org.au' },
  { id: 44, name: 'Activ Foundation', lat: -31.9505, lng: 115.8605, postcode: '6000', state: 'WA', city: 'Perth', categories: ['Employment Support', 'Daily Life & Living', 'Specialist Disability Accommodation'], funding: 60_000_000, participants: 4000, rating: 4.1, phone: '08 9387 0555', website: 'activ.asn.au' },
  { id: 45, name: 'Nulsen Disability Services', lat: -31.9505, lng: 115.8605, postcode: '6000', state: 'WA', city: 'Perth', categories: ['Daily Life & Living', 'Specialist Disability Accommodation', 'Community Nursing'], funding: 45_000_000, participants: 2800, rating: 4.2, phone: '08 9325 8387', website: 'nulsen.com.au' },
  { id: 46, name: 'Identitywa', lat: -31.9505, lng: 115.8605, postcode: '6000', state: 'WA', city: 'Perth', categories: ['Daily Life & Living', 'Support Coordination', 'Behaviour Support'], funding: 28_000_000, participants: 1800, rating: 4.0, phone: '08 9474 3303', website: 'identitywa.com.au' },
  { id: 47, name: 'Edge Employment Solutions', lat: -31.9505, lng: 115.8605, postcode: '6000', state: 'WA', city: 'Perth', categories: ['Employment Support'], funding: 15_000_000, participants: 1200, rating: 4.2, phone: '08 6250 0700', website: 'edgeemployment.com.au' },
  { id: 48, name: 'Therapy Focus', lat: -32.0569, lng: 115.7439, postcode: '6153', state: 'WA', city: 'Mosman Park', categories: ['Therapeutic Supports', 'Early Childhood Intervention', 'Behaviour Support'], funding: 38_000_000, participants: 3200, rating: 4.5, phone: '1300 135 373', website: 'therapyfocus.org.au' },

  // === TASMANIA ===
  { id: 49, name: 'Mosaic Support Services', lat: -42.8821, lng: 147.3272, postcode: '7000', state: 'TAS', city: 'Hobart', categories: ['Daily Life & Living', 'Support Coordination', 'Employment Support'], funding: 22_000_000, participants: 1400, rating: 4.1, phone: '03 6224 9222', website: 'mosaictas.com.au' },
  { id: 50, name: 'Li-Ve Tasmania', lat: -41.4332, lng: 147.1441, postcode: '7250', state: 'TAS', city: 'Launceston', categories: ['Daily Life & Living', 'Specialist Disability Accommodation', 'Employment Support'], funding: 18_000_000, participants: 1100, rating: 4.0, phone: '03 6335 1900', website: 'livetas.com.au' },
  { id: 51, name: 'Optia', lat: -41.4332, lng: 147.1441, postcode: '7250', state: 'TAS', city: 'Launceston', categories: ['Daily Life & Living', 'Group & Centre Activities', 'Household Tasks'], funding: 14_000_000, participants: 800, rating: 4.2, phone: '03 6344 5222', website: 'optia.com.au' },
  { id: 52, name: 'Oak Tasmania', lat: -42.8821, lng: 147.3272, postcode: '7000', state: 'TAS', city: 'Hobart', categories: ['Early Childhood Intervention', 'Therapeutic Supports'], funding: 10_000_000, participants: 600, rating: 4.3, phone: '03 6242 0270', website: 'oaktas.com.au' },

  // === ACT ===
  { id: 53, name: 'Communities@Work', lat: -35.2809, lng: 149.1300, postcode: '2600', state: 'ACT', city: 'Canberra', categories: ['Daily Life & Living', 'Group & Centre Activities', 'Early Childhood Intervention'], funding: 28_000_000, participants: 1800, rating: 4.2, phone: '02 6293 6500', website: 'commsatwork.org' },
  { id: 54, name: 'Hartley Lifecare', lat: -35.2809, lng: 149.1300, postcode: '2600', state: 'ACT', city: 'Canberra', categories: ['Specialist Disability Accommodation', 'Daily Life & Living', 'Community Nursing'], funding: 18_000_000, participants: 1000, rating: 4.1, phone: '02 6282 4411', website: 'hartley.com.au' },
  { id: 55, name: 'Koomarri', lat: -35.3075, lng: 149.1244, postcode: '2604', state: 'ACT', city: 'Kingston', categories: ['Employment Support', 'Daily Life & Living', 'Group & Centre Activities'], funding: 15_000_000, participants: 900, rating: 4.0, phone: '02 6295 8100', website: 'koomarri.com.au' },
  { id: 56, name: 'National Disability Services ACT', lat: -35.2809, lng: 149.1300, postcode: '2600', state: 'ACT', city: 'Canberra', categories: ['Coordination of Supports', 'Support Coordination'], funding: 8_000_000, participants: 500, rating: 4.4, phone: '02 6283 3200', website: 'nds.org.au' },

  // === NORTHERN TERRITORY ===
  { id: 57, name: 'Somerville Community Services', lat: -12.4634, lng: 130.8456, postcode: '0800', state: 'NT', city: 'Darwin', categories: ['Daily Life & Living', 'Support Coordination', 'Behaviour Support'], funding: 22_000_000, participants: 1200, rating: 4.1, phone: '08 8920 4100', website: 'somerville.org.au' },
  { id: 58, name: 'Carpentaria Disability Services', lat: -12.4634, lng: 130.8456, postcode: '0800', state: 'NT', city: 'Darwin', categories: ['Daily Life & Living', 'Employment Support', 'Specialist Disability Accommodation'], funding: 15_000_000, participants: 800, rating: 4.0, phone: '08 8920 9400', website: 'carpentaria.org.au' },
  { id: 59, name: 'NAAJA (North Australian Aboriginal Justice Agency)', lat: -12.4634, lng: 130.8456, postcode: '0800', state: 'NT', city: 'Darwin', categories: ['Support Coordination', 'Coordination of Supports'], funding: 6_000_000, participants: 400, rating: 4.2, phone: '08 8982 5100', website: 'naaja.org.au' },
  { id: 60, name: 'Alice Springs NDIS Provider Hub', lat: -23.6980, lng: 133.8807, postcode: '0870', state: 'NT', city: 'Alice Springs', categories: ['Daily Life & Living', 'Transport', 'Community Nursing'], funding: 8_000_000, participants: 450, rating: 3.9, phone: '08 8950 5000', website: 'asndis.org.au' },

  // === MORE NSW - Regional ===
  { id: 61, name: 'Possability', lat: -34.7500, lng: 149.7167, postcode: '2621', state: 'NSW', city: 'Queanbeyan', categories: ['Daily Life & Living', 'Employment Support', 'Support Coordination'], funding: 20_000_000, participants: 1400, rating: 4.1, phone: '02 6299 2244', website: 'possability.com.au' },
  { id: 62, name: 'Kurrajong Waratah', lat: -35.1082, lng: 147.3698, postcode: '2650', state: 'NSW', city: 'Wagga Wagga', categories: ['Employment Support', 'Daily Life & Living', 'Group & Centre Activities'], funding: 25_000_000, participants: 1700, rating: 4.2, phone: '02 6932 6000', website: 'kurrajongwaratah.org.au' },
  { id: 63, name: 'House With No Steps (Blue Mountains)', lat: -33.7180, lng: 150.3104, postcode: '2780', state: 'NSW', city: 'Katoomba', categories: ['Daily Life & Living', 'Specialist Disability Accommodation'], funding: 10_000_000, participants: 650, rating: 4.0, phone: '02 4782 4244', website: 'aruma.com.au' },
  { id: 64, name: 'Coffs Coast NDIS Providers', lat: -30.2963, lng: 153.1138, postcode: '2450', state: 'NSW', city: 'Coffs Harbour', categories: ['Daily Life & Living', 'Therapeutic Supports', 'Transport'], funding: 12_000_000, participants: 800, rating: 4.0, phone: '02 6651 2244', website: 'coffsndis.com.au' },
  { id: 65, name: 'Tamworth Disability Services', lat: -31.0927, lng: 150.9320, postcode: '2340', state: 'NSW', city: 'Tamworth', categories: ['Daily Life & Living', 'Support Coordination', 'Household Tasks'], funding: 9_000_000, participants: 580, rating: 4.1, phone: '02 6766 5522', website: 'tamworthdisability.org.au' },

  // === MORE VIC - Regional ===
  { id: 66, name: 'Ballarat Disability Services', lat: -37.5622, lng: 143.8503, postcode: '3350', state: 'VIC', city: 'Ballarat', categories: ['Daily Life & Living', 'Employment Support', 'Group & Centre Activities'], funding: 14_000_000, participants: 900, rating: 4.0, phone: '03 5331 1234', website: 'ballaratds.org.au' },
  { id: 67, name: 'Gateway Health', lat: -36.3577, lng: 146.3222, postcode: '3690', state: 'VIC', city: 'Wodonga', categories: ['Community Nursing', 'Therapeutic Supports', 'Support Coordination'], funding: 11_000_000, participants: 700, rating: 4.1, phone: '02 6022 8888', website: 'gatewayhealth.org.au' },
  { id: 68, name: 'Gippsland Disability Advocacy', lat: -38.1720, lng: 146.0560, postcode: '3825', state: 'VIC', city: 'Warragul', categories: ['Support Coordination', 'Coordination of Supports', 'Daily Life & Living'], funding: 8_000_000, participants: 550, rating: 4.2, phone: '03 5633 2280', website: 'gippsdisability.org.au' },
  { id: 69, name: 'Shepparton Access', lat: -36.3833, lng: 145.4000, postcode: '3630', state: 'VIC', city: 'Shepparton', categories: ['Daily Life & Living', 'Transport', 'Employment Support'], funding: 10_000_000, participants: 620, rating: 4.0, phone: '03 5831 2000', website: 'sheppartonaccess.org.au' },

  // === MORE QLD - Regional ===
  { id: 70, name: 'Sunshine Coast NDIS Connect', lat: -26.6500, lng: 153.0667, postcode: '4558', state: 'QLD', city: 'Maroochydore', categories: ['Support Coordination', 'Plan Management', 'Daily Life & Living'], funding: 15_000_000, participants: 1100, rating: 4.1, phone: '07 5443 5566', website: 'scndisconnect.com.au' },
  { id: 71, name: 'Toowoomba Disability Support', lat: -27.5598, lng: 151.9507, postcode: '4350', state: 'QLD', city: 'Toowoomba', categories: ['Daily Life & Living', 'Employment Support', 'Household Tasks'], funding: 12_000_000, participants: 800, rating: 4.0, phone: '07 4632 1500', website: 'toowoombads.org.au' },
  { id: 72, name: 'Mackay NDIS Services', lat: -21.1411, lng: 149.1861, postcode: '4740', state: 'QLD', city: 'Mackay', categories: ['Daily Life & Living', 'Community Nursing', 'Support Coordination'], funding: 9_000_000, participants: 550, rating: 4.0, phone: '07 4951 3388', website: 'mackayndis.org.au' },
  { id: 73, name: 'Rockhampton Access Services', lat: -23.3790, lng: 150.5100, postcode: '4700', state: 'QLD', city: 'Rockhampton', categories: ['Daily Life & Living', 'Transport', 'Employment Support'], funding: 8_000_000, participants: 500, rating: 3.9, phone: '07 4927 2277', website: 'rockyaccess.org.au' },

  // === National providers with multiple locations ===
  { id: 74, name: 'Ability First Australia (National)', lat: -35.2809, lng: 149.1300, postcode: '2600', state: 'ACT', city: 'Canberra', categories: ['Coordination of Supports', 'Support Coordination'], funding: 5_000_000, participants: 350, rating: 4.4, phone: '02 6283 3200', website: 'abilityfirst.org.au' },
  { id: 75, name: 'Life Without Barriers', lat: -32.9267, lng: 151.7789, postcode: '2300', state: 'NSW', city: 'Newcastle', categories: ['Daily Life & Living', 'Specialist Disability Accommodation', 'Support Coordination'], funding: 120_000_000, participants: 8500, rating: 4.2, phone: '02 4033 4500', website: 'lwb.org.au' },
  { id: 76, name: 'Uniting', lat: -33.8688, lng: 151.2093, postcode: '2000', state: 'NSW', city: 'Sydney', categories: ['Daily Life & Living', 'Early Childhood Intervention', 'Therapeutic Supports'], funding: 95_000_000, participants: 6800, rating: 4.3, phone: '1800 864 846', website: 'uniting.org' },
  { id: 77, name: 'The Benevolent Society', lat: -33.8852, lng: 151.2145, postcode: '2015', state: 'NSW', city: 'Paddington', categories: ['Early Childhood Intervention', 'Support Coordination', 'Therapeutic Supports'], funding: 45_000_000, participants: 3200, rating: 4.4, phone: '02 8262 3400', website: 'benevolent.org.au' },
  { id: 78, name: 'Disability Services Australia', lat: -33.8688, lng: 151.2093, postcode: '2000', state: 'NSW', city: 'Sydney', categories: ['Daily Life & Living', 'Employment Support', 'Home Modifications'], funding: 30_000_000, participants: 2100, rating: 4.0, phone: '02 9270 6000', website: 'dsa.org.au' },
  { id: 79, name: 'AccessAbility Day Programs', lat: -37.8136, lng: 144.9631, postcode: '3000', state: 'VIC', city: 'Melbourne', categories: ['Group & Centre Activities', 'Daily Life & Living'], funding: 8_000_000, participants: 500, rating: 4.1, phone: '03 9654 8877', website: 'accessability.org.au' },
  { id: 80, name: 'NDIS Quality & Safeguards Commission', lat: -33.8688, lng: 151.2093, postcode: '2000', state: 'NSW', city: 'Sydney', categories: ['Coordination of Supports'], funding: 0, participants: 0, rating: 0, phone: '1800 035 544', website: 'ndiscommission.gov.au' },
];

/**
 * Search providers near a given postcode
 * Returns providers sorted by distance
 */
export function searchProvidersByPostcode(postcode, providers, postcodeData, radiusKm = 50) {
  const origin = postcodeData.find(p => p.postcode === postcode);
  if (!origin) return { origin: null, providers: [] };

  const results = providers
    .map(provider => {
      const dist = haversineDistance(origin.lat, origin.lng, provider.lat, provider.lng);
      return { ...provider, distance: dist };
    })
    .filter(p => p.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);

  return { origin, providers: results };
}

/**
 * Haversine formula to calculate distance between two lat/lng points
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}
