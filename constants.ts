export const APP_VERSION = "2.4";
export const RESTAURANT_DATA = {
  "name": "MARAL RESTAURANTE",
  "address": "Tucumán 2201, C1051 ACA, Ciudad Autónoma de Buenos Aires",
  "phone": "011 4520-9850",
  "rating": 4.2,
  "reviewsCount": 318,
  "priceRange": "Excelente relación precio-calidad",
  "hours": "Lunes a Viernes: 08:00 a.m. a 11:00 p.m. | Sábados y Domingos: Cerrado",
  "locationCode": "9JX2+5G",
  "googleMapsEmbed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.187834479549!2d-58.39764522425988!3d-34.60157927295701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccac1a6f87577%3A0xc64e123616238b93!2sTucum%C3%A1n%202201%2C%20C1051%20ACA%2C%20Cdad.%20Aut%C3%B3noma%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1715421234567!5m2!1ses!2sar",
  "googleMapsUrl": "https://www.google.com/maps/dir/?api=1&destination=Tucumán+2201+CABA"
};
export const INITIAL_CONTENT = {
  "heroTitle": "MARAL RESTAURANTE",
  "heroSubtitle": "Sabor que trasciende, momentos que perduran en el corazón de Buenos Aires.",
  "aboutTitle": "Calidad que define nuestra historia",
  "aboutDesc1": "En Maral Restaurante, nos dedicamos a elevar la tradición culinaria porteña. Ubicados estratégicamente en el corazón de la ciudad, ofrecemos un refugio de sabor para aquellos que buscan una experiencia cuidada en cada detalle.",
  "aboutDesc2": "Nuestra filosofía se basa en la selección rigurosa de ingredientes frescos y la pasión por el servicio. Ya sea para un desayuno tranquilo o una cena sofisticada, Maral es el punto de encuentro donde la calidad y la hospitalidad se unen."
};
export interface MenuItem { name: string; price: string; desc: string; image?: string; side?: { name: string; price: string; }; }
export interface MenuCategory { id: string; name: string; items: MenuItem[]; extras?: MenuItem[]; }
export const INITIAL_MENU: MenuCategory[] = [
  {
    "id": "entradas",
    "name": "Entradas",
    "items": [
      {
        "name": "Empanadas Salteñas",
        "price": "$1200",
        "desc": "Carne cortada a cuchillo, fritas o al horno."
      },
      {
        "name": "Rabas a la Romana",
        "price": "$8500",
        "desc": "Anillos de calamar tiernos con limón y perejil."
      },
      {
        "name": "Entrars",
        "price": "$1122",
        "desc": "Descripción...",
        "image": ""
      }
    ]
  },
  {
    "id": "bebidas",
    "name": "Bebidas",
    "items": []
  },
  {
    "id": "minutas",
    "name": "Minutas",
    "items": [
      {
        "name": "Milanesa a la Napolitana",
        "price": "$12500",
        "desc": "Milanesa de ternera con salsa de tomate, jamón y mozzarella. (No incluye guarnición)",
        "image": "https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&q=80&w=400"
      }
    ],
    "extras": [
      {
        "name": "Papas Fritas",
        "price": "$3500",
        "desc": "Bastones clásicos, doble cocción."
      },
      {
        "name": "Puré de Papa o Calabaza",
        "price": "$3000",
        "desc": "Cremoso con manteca y nuez moscada."
      }
    ]
  },
  {
    "id": "pastas",
    "name": "Pastas",
    "items": [
      {
        "name": "Ravioles de verdura",
        "price": "$8500",
        "desc": "Pastas frescas elaboradas artesanalmente. (Elegir salsa abajo)",
        "image": "https://i.postimg.cc/FkdK21Jx/ravioles.jpg"
      }
    ],
    "extras": [
      {
        "name": "Filetto",
        "price": "$1500",
        "desc": "Pomodoro italiano y albahaca fresca."
      },
      {
        "name": "Bolognesa",
        "price": "$2500",
        "desc": "Carne seleccionada y cocción lenta."
      }
    ]
  }
];
export const REVIEWS = [
  {
    "author": "Carolina M.",
    "text": "La milanesa napolitana es gigante y súper tierna.",
    "rating": 5
  },
  {
    "author": "Jorge G.",
    "text": "El mejor bife de chorizo de la zona.",
    "rating": 4
  }
];