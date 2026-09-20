/**
 * site.ts — the one file non-developers edit.
 * All static copy, nav, footer columns, meeting info, and document links live here.
 * Live data (events, leaders, settings) comes from Supabase via src/lib/data.
 */
import type { DocumentLink, InfoColumnItem, LinkItem, ScheduleStep } from "@/lib/types";

/** "san francisco ♥" — heart is U+2665 BLACK HEART SUIT + U+FE0E text presentation. Never the emoji. */
export const WORDMARK = "san francisco ♥︎";

export const links = {
  sheet: "https://docs.google.com/spreadsheets/d/1LAdQSl6vVc29QtajIRBSBcpI2jLI2c6SUo8UcYbMerY/edit?gid=2021187044",
  sanghaHub: "https://level-sage-67b.notion.site/Sangha-Hub-1d20457965ca804e8c34f75cc731bda0",
  googleGroup: "https://groups.google.com/g/wake-up-san-francisco/about",
  whatsapp: "https://chat.whatsapp.com/DcB40QkcgZOKmJXRdb3de1",
  guide: "/docs/facilitator-guide-2022.docx",
  charter: "/docs/charter-2020.pdf",
  wkup: "https://wkup.org",
  plumVillage: "https://plumvillage.org",
  fiveTrainings: "https://plumvillage.org/mindfulness/the-5-mindfulness-trainings",
  instagram: "https://instagram.com",
} as const;

export const site = {
  name: "Wake Up San Francisco",
  description:
    "Young adults (18–35) practicing mindfulness together in the Plum Village tradition. Sundays 11am in Precita Park, San Francisco.",
  wordmark: WORDMARK,

  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Events", href: "/events" },
    { label: "Facilitators hub", href: "/facilitators" },
  ] satisfies LinkItem[],

  meeting: {
    summary: "Sundays 11am in Precita Park",
    time: "Every Sunday, 11:00am",
    place: "Precita Park, Bernal Heights",
    directions:
      "Look for the circle of picnic blankets on the grass near the Folsom St side of the park. We practice mindful sitting, walking, and dharma sharing.",
  },

  contact: {
    email: "hello@wakeupsf.org", // placeholder — replace before launch
    phoneDisplay: "(415) 555-0100", // placeholder — replace before launch
    phoneHref: "sms:+14155550100",
    primaryFacilitator: "Charisse",
  },

  home: {
    title: "Sundays 11am in Precita Park",
    lede:
      "Wake Up SF is a community of young adults (18–35) practicing mindfulness together in the Plum Village tradition of Zen Master Thich Nhat Hanh. We sit, walk, share tea and talk about real life. No experience needed — everyone is welcome.",
    hero: { src: "/images/photo-pv-countryside.jpg", alt: "Morning light over a green valley" }, // placeholder photo
    infoColumns: [
      {
        title: "Every Sunday, 11:00am",
        body: "Look for the circle of picnic blankets on the grass near the Folsom St side of the park. We practice mindful sitting, walking, and dharma sharing.",
        link: { label: "Can't find us? Message us →", href: "sms:+14155550100" },
      },
      {
        title: "Who we are",
        body: "A local branch of Wake Up International — young people practicing mindfulness in the Plum Village tradition since 2008.",
        link: { label: "Learn about Wake Up →", href: "/#about" },
      },
    ] satisfies InfoColumnItem[],
    about: {
      subnav: {
        group: "About",
        items: [
          { label: "Who we are", href: "#about" },
          { label: "The Community", href: "#community" },
        ],
      },
      title: "Who we are",
      lede:
        "A local branch of Wake Up International — young people practicing mindfulness in the Plum Village tradition since 2008. Peer-led, no teachers, just friends holding a space.",
      paragraphs: [
        "Wake Up is a worldwide community of young people (18–35) practicing mindfulness in the tradition of Zen Master Thich Nhat Hanh. Wake Up SF is the San Francisco branch: a friendly, no-pressure sangha that meets outdoors every Sunday.",
        "You don't need to be Buddhist, or to have meditated before. We practice the Five Mindfulness Trainings as a way of living kindly with ourselves, each other and the planet. Most weeks about 15–30 people show up — students, nurses, engineers, artists, new arrivals to the city.",
      ],
      figure: {
        src: "/images/hero-weekly-meditation.jpg",
        alt: "People sitting in a circle on the grass",
        caption: "Sitting meditation in the park",
      },
      quote: {
        text: "The most precious gift we can offer anyone is our attention. When mindfulness embraces those we love, they will bloom like flowers.",
        attribution: "Thich Nhat Hanh",
      },
      links: [
        { label: "Read about the practice →", href: links.fiveTrainings, external: true },
        { label: "Find Wake Up worldwide →", href: links.wkup, external: true },
      ] satisfies LinkItem[],
    },
    community: {
      title: "Facilitators & community",
      lede:
        "Wake Up SF is peer-led. Nobody is a teacher; a small group of volunteer facilitators takes turns holding the space each Sunday, and a Caretaking Council keeps the sangha running between them.",
      paragraph:
        "Facilitators sign up about once a month to lead the sit, guide walking meditation and open dharma sharing. Anyone who has come to a few Sundays and taken a facilitator training (or checked in with someone who has facilitated three times) can join the rotation.",
      councilLabel: "Caretaking Council",
      getInvolvedTitle: "Get involved",
      getInvolved:
        "Come a few Sundays, then say hi to a facilitator. Ways to help: welcoming newcomers, bringing tea and cushions, guiding walking meditation, organizing a social or a retreat carpool. Everything we plan happens in the WhatsApp group.",
      links: [
        { label: "Join the WhatsApp group →", href: links.whatsapp, external: true },
        { label: "Facilitator hub (password) →", href: "/facilitators" },
      ] satisfies LinkItem[],
    },
    eventsTitle: "Upcoming events",
    eventsLink: { label: "All events →", href: "/events" },
  },

  events: {
    title: "Events",
    lede:
      "Weekly sits, days of mindfulness, retreats and socials. Everything is free or by donation unless noted. Members can add their own events — a facilitator approves each one before it appears.",
    links: [
      { label: "Submit an event →", href: "mailto:hello@wakeupsf.org?subject=Event%20submission" },
      { label: "Past events →", href: "/events?past=1" },
    ] satisfies LinkItem[],
    subnav: { group: "Events", items: [{ label: "All", href: "/events" }, { label: "Retreat", href: "/events?type=retreat" }] },
    comingUpTitle: "Coming up",
    comingUpLede:
      "Most weeks it's just the Sunday sit. A few times a year we travel together to Deer Park Monastery, host a potluck, or join the Wake Up West Coast retreat. Everything is listed here, with the RSVP on Luma or Partiful.",
    figure: {
      src: "/images/hero-weekly-meditation.jpg",
      alt: "The sangha sitting together outdoors",
      caption: "Sunday sit in Precita Park — every week, rain or shine",
    },
    pastLink: { label: "See past events →", href: "/events?past=1" },
    rsvpLabel: "RSVP →",
  },

  facilitators: {
    title: "Facilitator hub",
    lede:
      "Everything you need to hold a Sunday: the sign-up sheet, the facilitator guide, and the documents that shape how Wake Up SF runs. For facilitators only — the password is shared in the WhatsApp group.",
    hero: { src: "/images/photo-pv-talk.jpg", alt: "A dharma talk with a large seated crowd" }, // placeholder photo
    links: [
      { label: "Open the sign-up sheet →", href: links.sheet, external: true },
      { label: "Read the facilitator guide →", href: links.guide, external: true },
    ] satisfies LinkItem[],
    infoColumns: [
      {
        title: "Who's facilitating",
        body: "The schedule lives in the shared Google Sheet. Sign up there — it's the source of truth for who's leading each Sunday. Facilitate about once a month, and email the sangha the Friday or Saturday before.",
        link: { label: "Open the schedule →", href: links.sheet, external: true },
      },
      {
        title: "New to facilitating?",
        body: "Come to at least three sangha meetings, attend a facilitator training or check in 1:1 with someone who has facilitated three times, and read the guide. Then add your name to the sheet.",
        link: { label: "Read the facilitator guide →", href: links.guide, external: true },
      },
    ] satisfies InfoColumnItem[],
    subnav: {
      group: "Facilitators",
      items: [
        { label: "Schedule", href: "#schedule" },
        { label: "Leading", href: "#leading" },
      ],
    },
    glanceTitle: "A Sunday at a glance",
    glanceLede:
      "The illustrative schedule from the facilitator guide. Aim for the three jewels — Buddha (practice), Dharma (teaching), Sangha (sharing) — and end by 1pm.",
    schedule: [
      { duration: "5–10 min", title: "Check-in", description: "Names, pronouns, internal weather." },
      { duration: "5 min", title: "Welcome & intro", description: "What Wake Up is, the agenda for today." },
      { duration: "20–30 min", title: "Sitting & walking meditation", description: "Three bells to begin, two to end; walking free-form or around the circle." },
      { duration: "10–30 min", title: "Practicing with the Dharma", description: "A reading, guided meditation, or an activity; break time here too." },
      { duration: "25–45 min", title: "Dharma sharing", description: "Explain the guidelines; split into groups of 6–8 if more than 12." },
      { duration: "4 min", title: "Closing & announcements", description: "Close the circle, share upcoming events." },
    ] satisfies ScheduleStep[],
    containerTitle: "Creating a container",
    container:
      "We're peer facilitators, not teachers. Share the instructions, remind people everything is optional, invite the bell with care, and model slow breathing. Offer a way out at the start of the sit — eyes open, stand up, get water — so the practice stays trauma-informed.",
    documentsLabel: "Documents & links",
    documents: [
      { kind: "Google Sheet", title: "Facilitation schedule", description: "Sign up to lead or co-facilitate a Sunday, and see who's on for the coming weeks.", href: links.sheet },
      { kind: "Word", title: "Facilitator Guide (Dec 2022)", description: "Approach, the Sunday schedule, holding space, dharma sharing guidelines.", href: links.guide },
      { kind: "PDF", title: "Charter (2020)", description: "Mission, roles (Caretaking Council, Board), elections and operating rhythm.", href: links.charter },
      { kind: "Notion", title: "Sangha Hub", description: "Account access details and links to key tools and platforms.", href: links.sanghaHub },
      { kind: "Google Group", title: "Wake Up SF mailing list", description: "Where the Friday/Saturday reminder goes.", href: links.googleGroup },
      { kind: "WhatsApp", title: "Facilitators chat", description: "Day-of coordination, swapping Sundays, and where this page's password is shared.", href: links.whatsapp },
    ] satisfies DocumentLink[],
    support: {
      title: "If something concerning comes up",
      text: "Don't answer what you don't know. If someone shares that they may hurt themselves or others, bring it to the Caretaking Council immediately, without naming the member. Mindfulness isn't a replacement for professional care. 988 Suicide & Crisis Lifeline: call or text 988.",
      link: { label: "Contact the CTC →", href: "mailto:hello@wakeupsf.org" },
    },
    gate: {
      title: "Facilitator hub",
      lede:
        "Everything you need to hold a Sunday: the sign-up sheet, the facilitator guide, and the documents that shape how Wake Up SF runs. For facilitators only — the password is shared in the WhatsApp group.",
      passwordLabel: "Password",
      submit: "Enter",
      help: { label: "Not a facilitator yet? Here's how to start →", href: "/#community" },
      error: "That password didn't match. Check the WhatsApp group for the current one.",
    },
  },

  footer: {
    description:
      "Young practitioners in the Plum Village tradition, meeting every Sunday at 11am in Precita Park. A local branch of Wake Up International.",
    columns: [
      {
        label: "About",
        links: [
          { label: "Who we are", href: "/#about" },
          { label: "Wake Up International", href: links.wkup, external: true },
          { label: "Plum Village", href: links.plumVillage, external: true },
        ],
      },
      {
        label: "Connect",
        links: [
          { label: "hello@wakeupsf.org", href: "mailto:hello@wakeupsf.org" },
          { label: "Text (415) 555-0100", href: "sms:+14155550100" },
        ],
      },
    ] satisfies { label: string; links: LinkItem[] }[],
    bottomLinks: [
      { label: "Privacy", href: "/privacy" },
      { label: "Code of conduct", href: "/code-of-conduct" },
      { label: "wkup.org", href: links.wkup, external: true },
    ] satisfies LinkItem[],
    copyright: `© ${new Date().getFullYear()} Wake Up San Francisco`,
  },
};

export type Site = typeof site;
