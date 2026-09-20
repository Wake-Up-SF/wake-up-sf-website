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
  pvApp: "https://plumvillage.app",
  deerPark: "https://deerparkmonastery.org",
  pvOnlineMonastery: "https://plumvillage.org/community/online-monastery",
  pvLibrary: "https://plumvillage.org/library",
  wakeUpInternational: "https://wkup.org/sanghas",
} as const;

export const site = {
  name: "Wake Up San Francisco",
  description:
    "Young adults (18–35) practicing mindfulness together in the Plum Village tradition. Sundays 11am in Precita Park, San Francisco.",
  wordmark: WORDMARK,

  nav: [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: "Sangha Hub", href: "/sangha" },
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
      rosterLabel: "Facilitators",
      links: [
        { label: "Sangha Hub (password) →", href: "/sangha" },
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
      { kind: "Notion", title: "Accounts & tools (Notion)", description: "Account access details and links to key tools and platforms.", href: links.sanghaHub },
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
      hint: "Enter the shared facilitator password.",
    },
  },

  sangha: {
    title: "Sangha Hub",
    lede:
      "The members' side of Wake Up SF: series we're running together, the book shelf we lend from, writing by people in the sangha, and the resources we keep recommending each other. Ask any facilitator for the password.",
    hero: { src: "/images/photo-interbeing.jpg", alt: "Hands holding a small plant" },
    links: [
      { label: "What we're running →", href: "/sangha/series" },
      { label: "Borrow a book →", href: "/sangha/library" },
    ] satisfies LinkItem[],
    infoColumns: [
      {
        title: "For members, not the public",
        body: "Everything here is shared inside the sangha: contact details, book lending, half-finished writing. Please don't repost it. The password is the same for everyone and changes once a year.",
        link: { label: "Questions? Email us →", href: "mailto:hello@wakeupsf.org" },
      },
      {
        title: "Add something",
        body: "Offering a book, running a series, or writing somewhere? Send it to the sangha email and a facilitator will add it here. Anything with a date also goes on the public events page.",
        link: { label: "Send us your thing →", href: "mailto:hello@wakeupsf.org?subject=Sangha%20Hub" },
      },
    ] satisfies InfoColumnItem[],
    subnav: {
      group: "Sangha Hub",
      items: [
        { label: "Overview", href: "/sangha" },
        { label: "Series", href: "/sangha/series" },
        { label: "Library", href: "/sangha/library" },
        { label: "Writing", href: "/sangha/writing" },
        { label: "Resources", href: "/sangha/resources" },
      ],
    },
    overview: {
      title: "What's going on",
      lede:
        "The Sunday sit is the constant. Everything on this page is the extra that members are carrying between Sundays — a book club, a shelf of books doing the rounds, and whatever people are writing.",
      seriesLabel: "Running and coming up",
      seriesRowAction: "See the dates →",
      seriesLink: { label: "All series →", href: "/sangha/series" },
      libraryLabel: "Recently on the shelf",
      libraryLink: { label: "The whole shelf →", href: "/sangha/library" },
      writingLabel: "Latest from the sangha",
      writingLink: { label: "All the writing →", href: "/sangha/writing" },
      resources: {
        title: "Things we keep recommending",
        text: "The app, the talks, the monasteries within driving distance, and the two books that come up in dharma sharing most weeks.",
        link: { label: "Resources & recommendations →", href: "/sangha/resources" },
      },
    },
    series: {
      title: "Event series",
      lede:
        "A series is a run of events that belong together — six Tuesdays with a book, a morning a month on each of the trainings. Drop into as many as you like; nothing assumes you came last time.",
      links: [
        { label: "Propose a series →", href: "mailto:hello@wakeupsf.org?subject=Series%20idea" },
        { label: "One-off events →", href: "/events" },
      ] satisfies LinkItem[],
      empty: "No series running right now. The Sunday sit carries on as ever.",
      seriesLinkLabel: "RSVP for the series →",
      rsvpLabel: "RSVP →",
    },
    library: {
      title: "Sangha library",
      lede:
        "Books members are happy to lend, and books members are hoping to borrow. Nothing is tracked automatically — message whoever has it, and tell a facilitator when it moves so the shelf stays honest.",
      links: [
        { label: "Offer a book →", href: "mailto:hello@wakeupsf.org?subject=Library%3A%20offering%20a%20book" },
        { label: "Ask for a book →", href: "mailto:hello@wakeupsf.org?subject=Library%3A%20looking%20for%20a%20book" },
      ] satisfies LinkItem[],
      empty: "The shelf is empty. Offer the book you just finished.",
      askLabel: "Ask",
      waitlistLabel: "Ask to be next",
      offerLabel: "Offer yours",
    },
    writing: {
      title: "Member writing",
      lede:
        "Posts by people in the sangha, reshared with their permission. Mostly Substack, sometimes a blog nobody else reads. A facilitator adds each one by hand — nothing is pulled in automatically.",
      links: [
        { label: "Share what you wrote →", href: "mailto:hello@wakeupsf.org?subject=Member%20writing" },
      ] satisfies LinkItem[],
      empty: "Nothing here yet. Be the first to send something in.",
      readLabel: "Read",
    },
    resources: {
      title: "Resources & recommendations",
      lede:
        "What we point people to when they ask what to read, where to practise when they're away, and what to do with a difficult week. Suggest an addition and it goes on the list.",
      links: [
        { label: "Suggest a resource →", href: "mailto:hello@wakeupsf.org?subject=Resource%20suggestion" },
      ] satisfies LinkItem[],
      openLabel: "Open",
      groups: [
        {
          label: "Start here",
          items: [
            { kind: "App", title: "Plum Village app", description: "Guided meditations, bells and short talks, free and with no account.", href: links.pvApp },
            { kind: "Practice", title: "The Five Mindfulness Trainings", description: "The ethical ground of the tradition, and what we recite together a few times a year.", href: links.fiveTrainings },
            { kind: "Community", title: "Wake Up sanghas worldwide", description: "Find a sangha when you travel, or when you move away from us.", href: links.wakeUpInternational },
          ] satisfies DocumentLink[],
        },
        {
          label: "Reading & listening",
          items: [
            { kind: "Library", title: "Plum Village dharma talks", description: "The full archive of talks by Thich Nhat Hanh and the monastics.", href: links.pvLibrary },
            { kind: "Online", title: "The online monastery", description: "Live sits, days of mindfulness and retreats you can join from a laptop.", href: links.pvOnlineMonastery },
          ] satisfies DocumentLink[],
        },
        {
          label: "Places to practise",
          items: [
            { kind: "Monastery", title: "Deer Park Monastery", description: "Escondido, about eight hours south. We carpool down once or twice a year.", href: links.deerPark },
            { kind: "Tradition", title: "Plum Village", description: "The root community in south-west France, and the source of most of what we do.", href: links.plumVillage },
          ] satisfies DocumentLink[],
        },
      ],
    },
    gate: {
      title: "Sangha Hub",
      lede:
        "The members' side of Wake Up SF: series, the book shelf, member writing and the resources we keep recommending. Ask any facilitator for the password — it's shared at the Sunday sit.",
      passwordLabel: "Password",
      submit: "Enter",
      help: { label: "New here? Come to a Sunday sit →", href: "/#community" },
      error: "That password didn't match. Ask a facilitator at the Sunday sit for the current one.",
      hint: "Enter the shared member password.",
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
