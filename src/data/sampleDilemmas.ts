import { DecisionInput } from '../types';

export const SAMPLE_DILEMMAS: (Omit<DecisionInput, 'id' | 'createdAt'> & { sampleTag: string })[] = [
  {
    sampleTag: 'Pricing: Freemium vs $20/mo',
    title: 'Freemium (Free with Paid Add-ons) vs Flat $20/Month Premium Plan',
    category: 'Business',
    context: 'Launching a new productivity & software tool. Wondering whether to launch with a free tier and monetized add-ons/limits to drive rapid adoption and virality, or charge a flat $20/month subscription (with a 14-day trial) to attract high-intent users and generate immediate predictable cash flow without supporting free-tier drain.',
    options: [
      {
        id: 'opt-freemium',
        name: 'Freemium (Free Core + Paid Pro Upgrades)',
        notes: 'Low barrier to entry, faster viral adoption, large user feedback pool; but lower conversion (~3%), higher server and customer support overhead.',
      },
      {
        id: 'opt-flat20',
        name: 'Flat $20/Month Premium (with 14-Day Free Trial)',
        notes: 'Immediate MRR, qualified serious buyers, lower support ticket burden, sustainable margins; but higher initial sales friction and slower word-of-mouth.',
      },
    ],
    userCriteria: [
      'Cash Flow & Immediate MRR',
      'User Acquisition & Virality',
      'Customer Support Overhead',
      'Conversion Rate & LTV',
      'Product Feedback Velocity',
    ],
  },
  {
    sampleTag: 'Career & Tech',
    title: 'Accept Series B AI Startup Offer vs Stay Senior Engineer at Big Tech',
    category: 'Career',
    context: 'Current job at Big Tech pays $230k total comp with great 35hr work-life balance and stability. Startup offers $175k base + 0.65% equity, leads an AI infra team, fast growth, but 55hr weeks and 18-month runway.',
    options: [
      {
        id: 'opt-1',
        name: 'Take the Startup Offer (Lead AI Infra)',
        notes: '$175k base + 0.65% equity, higher ownership, rapid skill accumulation, higher risk',
      },
      {
        id: 'opt-2',
        name: 'Stay at Big Tech (Senior Software Eng)',
        notes: '$230k comp, predictable hours, robust 401k match, slower promotion cadence',
      },
    ],
    userCriteria: ['Career Acceleration', 'Financial Upside', 'Work-Life Balance', 'Job Security', 'Learning Velocity'],
  },
  {
    sampleTag: 'Housing & Finance',
    title: 'Buy First Home ($650k at 6.4%) vs Rent & Invest Down Payment in Index Funds',
    category: 'Financial',
    context: 'Have $130k saved for down payment. Renting a nice 2-bed apartment costs $2,600/mo. Mortgage, HOA, property tax and insurance would be $4,400/mo. Plan to stay in this city for at least 5 years.',
    options: [
      {
        id: 'opt-1',
        name: 'Buy the $650k Townhouse',
        notes: 'Build equity, stable monthly housing cost, personal pride of ownership, higher monthly outflow',
      },
      {
        id: 'opt-2',
        name: 'Continue Renting & Invest Savings in S&P 500',
        notes: 'Maximum liquidity, zero maintenance headaches, flexibility to relocate, no property tax risk',
      },
    ],
    userCriteria: ['Net Worth in 7 Years', 'Monthly Cash Flow', 'Lifestyle Freedom', 'Maintenance Hassle', 'Geographic Mobility'],
  },
  {
    sampleTag: 'Lifestyle & Relocation',
    title: 'Relocate to Austin (Lower Tax & More Space) vs Stay in Brooklyn NYC',
    category: 'Relocation',
    context: 'Both partners work remotely. Brooklyn has vibrant arts, walkable neighborhoods, and existing close friend network, but high rent and high state tax. Austin offers a 3,000 sq ft home with a yard, no state income tax, sunny climate, but requires car culture and hot summers.',
    options: [
      {
        id: 'opt-1',
        name: 'Move to Austin, Texas',
        notes: 'Larger home with private yard, no state tax, lower cost of living, new outdoor lifestyle',
      },
      {
        id: 'opt-2',
        name: 'Stay in Brooklyn, New York',
        notes: 'World-class culture, walkable transit, tight-knit local friend group, higher expenses',
      },
    ],
    userCriteria: ['Quality of Daily Life', 'Social Community & Friends', 'Living Space', 'Financial Savings', 'Walkability & Culture'],
  },
  {
    sampleTag: 'Entrepreneurship',
    title: 'Bootstrap SaaS to $1M ARR vs Raise $1.5M Seed Round from VC',
    category: 'Business',
    context: 'B2B SaaS tool has $18k MRR growing 12% MoM. Profitable with 2 co-founders. Two reputable VC firms offered a $1.5M seed round at an $8M post-money valuation to hire engineers and scale sales.',
    options: [
      {
        id: 'opt-1',
        name: 'Bootstrap & Grow Organically',
        notes: '100% founder ownership, complete creative control, sustainable pace, slower customer acquisition',
      },
      {
        id: 'opt-2',
        name: 'Raise $1.5M Seed Venture Capital',
        notes: 'Aggressive marketing blitz, hire top talent, board oversight, high pressure to reach $100M valuation',
      },
    ],
    userCriteria: ['Founder Equity & Control', 'Speed to Market Dominance', 'Mental Wellbeing', 'Downside Failure Risk', 'Enterprise Network Access'],
  },
];
