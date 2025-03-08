export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "EasyParty",
  description:
    "EasyParty est votre application tout-en-un pour réserver facilement et rapidement la salle de fête idéale pour votre prochain événement. Oubliez les appels téléphoniques interminables et les recherches fastidieuses. Avec EasyParty, vous pouvez trouver la salle parfaite en quelques clics seulement.",
  mainNav: [
    // {
    //   title: "Home",
    //   href: "/",
    // },
    {
      title: "Salles de fêtes",
      href: "/rooms",
    },
    {
      title: "Services",
      href: "/services",
    },
    {
      title: "Réservation",
      href: "/reservation",
    },
    {
      title: "Paeiment",
      href: "/payment",
    },
    {
      title: "Client",
      href: "/client",
    },
    {
      title: "Remboursement",
      href: "/remboursement",
    },
  ],
  links: {
    twitter: "https://twitter.com/MbulaAdonai",
    github: "https://github.com/adonaiKasawa/easyparty_frontend",
    docs: "https://ui.shadcn.com",
  },
}