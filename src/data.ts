export interface BusinessData {
  name: string;
  shortName: string;
  domain: string;
  address: string;
  phone: string;
  phoneClean: string;
  whatsappBase: string;
  mapsUrl: string;
  socials: {
    instagram: string;
    facebook: string;
    x: string;
  };
  experienceYears: string;
  clientsTypes: string[];
  primaryCommunes: string[];
}

export const BUSINESS: BusinessData = {
  name: "Doctor Clean",
  shortName: "Dr. Clean",
  domain: "drclean.cl",
  address: "Av. Manquehue Sur 520, of. 305, Las Condes, Región Metropolitana",
  phone: "+56 9 4543 1315",
  phoneClean: "+56945431315",
  whatsappBase: "https://wa.me/56945431315",
  mapsUrl: "https://goo.gl/maps/bN9iUufUZHTHqqUB7",
  socials: {
    instagram: "https://www.instagram.com/drclean.cl/",
    facebook: "https://www.facebook.com/drclean.cl/",
    x: "https://twitter.com/doctor_clean_cl",
  },
  experienceYears: "+15 años de experiencia",
  clientsTypes: ["Casas", "Departamentos", "Oficinas", "Empresas", "Locales comerciales", "Hoteles"],
  primaryCommunes: ["Las Condes", "Providencia", "Vitacura", "La Reina", "Ñuñoa", "Lo Barnechea"],
};

export interface ServiceChapter {
  id: string;
  number: string;
  name: string;
  shortTag: string;
  description: string;
  monoDetails: string;
  buttonText: string;
  image: string;
  imageAlt: string;
  whatsappMsg: string;
  dataCta: string;
}

export const SERVICES: ServiceChapter[] = [
  {
    id: "alfombras",
    number: "01",
    name: "Alfombras",
    shortTag: "Muro a muro y decorativas",
    description:
      "Muro a muro y decorativas. Aspirado industrial de alta potencia, espuma de microburbujas, desmanchado, sanitización y desodorización enzimática. Movemos muebles de hasta 30 kg sin costo y los devolvemos a su lugar.",
    monoDetails: "SECADO 8–24 H · DESDE $3.500/M² + IVA",
    buttonText: "Cotizar alfombras",
    image: "/media/alfombra-hero.webp",
    imageAlt: "Alfombra limpia y sanitizada a domicilio por Doctor Clean",
    whatsappMsg: "Hola, necesito el servicio de Lavado de Alfombras",
    dataCta: "servicio-alfombras",
  },
  {
    id: "tapiz",
    number: "02",
    name: "Tapiz y sillones",
    shortTag: "Tela y cuero",
    description:
      "Sofás, sillones, futones, sitiales, sillas y tapiz de auto. Tela y cuero. Vapor, desmanchado y desodorización contra olores de mascotas.",
    monoDetails: "SERVICIO 1–2 H · SECADO 24–72 H",
    buttonText: "Cotizar sillones",
    image: "/media/sillon-impecable.webp",
    imageAlt: "Sillón impecable tras lavado profesional a domicilio",
    whatsappMsg: "Hola, necesito el servicio de Limpieza de Sillones a Domicilio",
    dataCta: "servicio-tapiz",
  },
  {
    id: "colchones",
    number: "03",
    name: "Colchones",
    shortTag: "Hipoalergénico",
    description:
      "Aspirado profundo, tratamiento de manchas y vapor contra ácaros, bacterias y alérgenos, con productos hipoalergénicos.",
    monoDetails: "ASPIRADO PROFUNDO · VAPOR ANTI-ÁCAROS",
    buttonText: "Cotizar colchones",
    image: "/media/limpieza-colchon.webp",
    imageAlt: "Limpieza profunda de colchón a vapor a domicilio",
    whatsappMsg: "Hola, necesito el servicio de Limpieza de Colchones a Domicilio",
    dataCta: "servicio-colchones",
  },
  {
    id: "decapado",
    number: "04",
    name: "Decapado de piso",
    shortTag: "Flotante, vinílico y cerámico",
    description:
      "Eliminamos capas de cera y suciedad que opacan tu piso flotante, vinílico o cerámico.",
    monoDetails: "MÍNIMO 15 M² · LISTO EN 1–2 H",
    buttonText: "Envíanos una foto",
    image: "/media/limpieza-piso-flotante.webp",
    imageAlt: "Piso flotante restaurado con decapado mecanizado",
    whatsappMsg: "Hola, necesito el servicio de Decapado de pisos. Les envío fotos del piso.",
    dataCta: "servicio-decapado",
  },
];

export interface MethodStep {
  number: string;
  title: string;
  description: string;
}

export const METHOD_STEPS: MethodStep[] = [
  {
    number: "01",
    title: "Encapsula la suciedad",
    description: "La espuma penetra la fibra y atrapa las partículas de polvo y grasa.",
  },
  {
    number: "02",
    title: "Mínima humedad",
    description: "Sin riesgo de moho ni daño al suelo o base del piso.",
  },
  {
    number: "03",
    title: "Secado en horas, no en días",
    description: "Retorno al uso en tiempos definidos y controlados.",
  },
  {
    number: "04",
    title: "Seguro para toda fibra",
    description: "Compatible incluso con lana y tapices delicados sin decolorar.",
  },
];

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}

export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    number: "01",
    title: "Cotiza por WhatsApp",
    description: "Con una foto o tus medidas aproximadas te respondemos de inmediato.",
  },
  {
    number: "02",
    title: "Agendamos tu visita",
    description: "Fijamos día y franja horaria para asistir a tu domicilio en el sector oriente.",
  },
  {
    number: "03",
    title: "Inspección y limpieza",
    description: "Revisamos material, tipo de pelo y manchas antes de elegir el método exacto.",
  },
  {
    number: "04",
    title: "Revisión final contigo",
    description: "Si algo no queda bien, lo corregimos en el momento o volvemos sin costo.",
  },
];

export interface Testimonial {
  quote: string;
  author: string;
  commune: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Me encantó el servicio, muy organizados, buena presentación del personal, dejaron todo muy limpio, quitaron toda la mancha de la alfombra, impeque el trabajo.",
    author: "JHON R.",
    commune: "PROVIDENCIA",
  },
  {
    quote:
      "Un excelente servicio, muy puntuales y atentos conmigo. Mi alfombra se secó rápidamente y el decapado quedó perfecto.",
    author: "CONSTANZA P.",
    commune: "LA REINA",
  },
];

export interface GalleryItem {
  id: string;
  image: string;
  tag: string;
  alt: string;
}

export const REAL_RESULTS_GALLERY: GalleryItem[] = [
  {
    id: "g-sillon",
    image: "/media/sillon-antes-despues.webp",
    tag: "LAVADO DE SILLÓN — ANTES Y DESPUÉS",
    alt: "Sillón de tela antes y después de la limpieza a domicilio por Doctor Clean",
  },
  {
    id: "g-piso-1",
    image: "/media/decapado-1.webp",
    tag: "REGISTRO 01 — DECAPADO DE PISO FLOTANTE",
    alt: "Registro de decapado mecanizado en piso flotante, retiro de cera",
  },
  {
    id: "g-piso-2",
    image: "/media/decapado-2.webp",
    tag: "REGISTRO 02 — DECAPADO DE PISO FLOTANTE",
    alt: "Aplicación y decapado en piso flotante living",
  },
  {
    id: "g-piso-3",
    image: "/media/decapado-3.webp",
    tag: "REGISTRO 03 — DECAPADO DE PISO FLOTANTE",
    alt: "Resultado de recuperación de brillo original sin cera opaca",
  },
  {
    id: "g-piso-4",
    image: "/media/decapado-4.webp",
    tag: "REGISTRO 04 — DECAPADO DE PISO FLOTANTE",
    alt: "Detalle de limpieza mecanizada profunda en junturas",
  },
  {
    id: "g-piso-5",
    image: "/media/decapado-5.webp",
    tag: "REGISTRO 05 — DECAPADO DE PISO FLOTANTE",
    alt: "Piso libre de manchas y residuos acumulados",
  },
  {
    id: "g-piso-6",
    image: "/media/decapado-6.webp",
    tag: "REGISTRO 06 — DECAPADO DE PISO FLOTANTE",
    alt: "Terminación uniforme en piso flotante residencial",
  },
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "¿Cómo se hace el lavado de alfombras a domicilio?",
    answer:
      "Aspiramos con equipo industrial de alta potencia, luego aplicamos espuma de microburbujas con maquinaria suiza que encapsula la suciedad con hasta un 80% menos de agua que la inyección-extracción. Incluye desmanchado, sanitización contra virus, bacterias y ácaros, y desodorización enzimática con productos biodegradables certificados (ISO 9001 e ISO 14001). Movemos muebles de hasta 30 kg sin costo.",
  },
  {
    id: "faq-2",
    question: "¿Mueven los muebles?",
    answer:
      "Movemos muebles de hasta 30 kg sin costo extra y los regresamos a su posición exacta al finalizar. Muebles frágiles, vitrinas, bibliotecas o racks pesados deben ser despejados previamente por el cliente.",
  },
  {
    id: "faq-3",
    question: "¿Cuánto tardan en secarse?",
    answer:
      "Los tiempos dependen de cada servicio: alfombras tardan de 8 a 24 horas aprox. en verano; sillones tienen un secado natural de 24 a 72 horas; y pisos decapados quedan listos para uso normal en 1 a 2 horas (se pueden pisar con calcetines casi de inmediato).",
  },
  {
    id: "faq-4",
    question: "¿Cómo cotizo?",
    answer:
      "Para alfombra muro a muro nos indicas los m² aproximados o la cantidad de habitaciones. Para decorativas, las medidas aproximadas de cada alfombra. Para sillones, colchones o decapado de pisos, te cotizamos directamente por WhatsApp con fotos o videos.",
  },
  {
    id: "faq-5",
    question: "¿Sacan el 100% de las manchas?",
    answer:
      "Eliminamos manchas por completo en hasta un 90% de los casos. En manchas muy difíciles o fijadas químicamente en el tejido, se atenúan sin arriesgar la fibra.",
  },
  {
    id: "faq-6",
    question: "¿Qué productos usan?",
    answer:
      "Productos biodegradables certificados bajo normas internacionales ISO 9001 (gestión de calidad) e ISO 14001 (medio ambiente). Son hipoalergénicos y seguros para tu familia y mascotas.",
  },
  {
    id: "faq-7",
    question: "¿Qué garantía tienen?",
    answer:
      "Garantía de satisfacción: al terminar realizamos una inspección presencial junto a ti. Si algo no queda conforme, lo corregimos en el momento o volvemos sin costo alguno.",
  },
  {
    id: "faq-8",
    question: "¿Cada cuánto conviene decapar el piso?",
    answer:
      "Se recomienda cada 2 a 3 años para remover capas acumuladas de cera, abrillantador y suciedad impregnada en piso flotante, vinílico o cerámico.",
  },
];

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/56945431315?text=${encodeURIComponent(message)}`;
}
