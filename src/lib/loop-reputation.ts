import {
  RiShieldCheckLine,
  RiRecycleLine,
  RiVipCrownLine,
  type RemixiconComponentType,
} from "@remixicon/react";

export interface TrustBadge {
  id: string;
  label: string;
  description: string;
  Icon: RemixiconComponentType;
  className: string;
}

export const MAKER_SCORE = { rating: 4.9, exchanges: 27 };

export function trustBadges(pieces: number): TrustBadge[] {
  const badges: TrustBadge[] = [
    {
      id: "verified",
      label: "Hardware Verificado",
      description: "Componentes validados en un Nodo físico.",
      Icon: RiShieldCheckLine,
      className: "bg-primary/10 text-primary",
    },
    {
      id: "founder",
      label: "Miembro Fundador",
      description: "Parte de la primera camada de la red.",
      Icon: RiVipCrownLine,
      className: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    },
  ];
  if (pieces >= 10) {
    badges.splice(1, 0, {
      id: "recycler",
      label: "Reciclador Activo",
      description: "Más de 10 piezas reinsertadas en la comunidad.",
      Icon: RiRecycleLine,
      className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    });
  }
  return badges;
}

export interface Review {
  id: string;
  author: string;
  initials: string;
  rating: number;
  comment: string;
  when: string;
}

export const SEED_REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Martín Guaymás",
    initials: "MG",
    rating: 5,
    comment: "Entregó la placa testeada y con los pines soldados. Súper puntual.",
    when: "hace 3 d",
  },
  {
    id: "r2",
    author: "FabLab Castañares",
    initials: "FC",
    rating: 5,
    comment: "Coordinamos por el Nodo y todo perfecto. Los NEMA 17 andaban impecables.",
    when: "hace 1 sem",
  },
  {
    id: "r3",
    author: "Lucía Cardozo",
    initials: "LC",
    rating: 4,
    comment: "Buen trato y descripción honesta del estado del componente.",
    when: "hace 2 sem",
  },
  {
    id: "r4",
    author: "Club de Robótica",
    initials: "CR",
    rating: 5,
    comment: "Nos salvó el proyecto de la feria, aportó servos que ya nadie usaba.",
    when: "hace 3 sem",
  },
];
