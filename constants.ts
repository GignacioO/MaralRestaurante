
export const RESTAURANT_DATA = {
  name: "MARAL RESTAURANTE",
  address: "Tucumán 2201, C1051 ACA, Ciudad Autónoma de Buenos Aires",
  phone: "011 4520-9850",
  rating: 4.2,
  reviewsCount: 318,
  priceRange: "Excelente relación precio-calidad",
  hours: "Lunes a Viernes: 08:00 a.m. a 11:00 p.m. | Sábados y Domingos: Cerrado",
  locationCode: "9JX2+5G",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.187834479549!2d-58.39764522425988!3d-34.60157927295701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccac1a6f87577%3A0xc64e123616238b93!2sTucum%C3%A1n%202201%2C%20C1051%20ACA%2C%20Cdad.%20Aut%C3%B3noma%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1715421234567!5m2!1ses!2sar",
  googleMapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Tucumán+2201+CABA"
};

export interface MenuItem {
  name: string;
  price: string;
  desc: string;
  image?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export const INITIAL_MENU: MenuCategory[] = [
  {
    id: 'entradas',
    name: 'Entradas',
    items: [
      { name: 'Empanadas Salteñas', price: 'Consultar', desc: 'Carne cortada a cuchillo, fritas o al horno.', image: '' },
      { name: 'Rabas a la Romana', price: 'Consultar', desc: 'Anillos de calamar tiernos con limón y perejil.', image: '' },
      { name: 'Tortilla de Papas', price: 'Consultar', desc: 'Clásica tortilla española, opción babé disponible.', image: '' },
      { name: 'Provoleta Maral', price: 'Consultar', desc: 'Queso provolone fundido con orégano y aceite de oliva.', image: '' }
    ]
  },
  {
    id: 'minutas',
    name: 'Minutas',
    items: [
      { 
        name: 'Milanesa a la Napolitana', 
        price: 'Consultar', 
        desc: 'Milanesa de ternera con salsa de tomate, jamón, mozzarella y un toque de orégano.',
        image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&q=80&w=400'
      },
      { name: 'Suprema a la Suiza', price: 'Consultar', desc: 'Pechuga de pollo con salsa blanca y gratén de queso.', image: '' },
      { name: 'Revuelto Gramajo', price: 'Consultar', desc: 'Papas pay, huevo, jamón cocido y arvejas.', image: '' }
    ]
  },
  {
    id: 'parrilla',
    name: 'De nuestra Parrilla',
    items: [
      { 
        name: 'Bife de Chorizo Maral', 
        price: 'Consultar', 
        desc: 'Corte premium de 400g a la parrilla con guarnición.',
        image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&q=80&w=400'
      },
      { name: 'Vacío del Fino', price: 'Consultar', desc: 'Corte tierno cocción lenta a la brasa.', image: '' },
      { name: 'Asado de Tira', price: 'Consultar', desc: 'Costillar seleccionado de exportación.', image: '' },
      { name: 'Parrillada Completa (2 pers)', price: 'Consultar', desc: 'Chorizo, morcilla, chinchulín, riñón, asado y vacío.', image: '' }
    ]
  },
  {
    id: 'pastas',
    name: 'Pastas Caseras',
    items: [
      { 
        name: 'Ravioles de Verdura', 
        price: 'Consultar', 
        desc: 'Con masa de huevo y espinaca fresca. Caseros.',
        image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80&w=400'
      },
      { name: 'Ñoquis de Papa', price: 'Consultar', desc: 'Hechos a mano todos los días.', image: '' },
      { name: 'Sorrentinos Maral', price: 'Consultar', desc: 'Rellenos de jamón, mozzarella y ricota.', image: '' }
    ]
  },
  {
    id: 'postres',
    name: 'Postres',
    items: [
      { name: 'Flan Casero', price: 'Consultar', desc: 'Con dulce de leche y/o crema.', image: '' },
      { name: 'Queso y Dulce', price: 'Consultar', desc: 'Postre vigilante: Queso fresco con dulce de batata o membrillo.', image: '' },
      { name: 'Mousse de Chocolate', price: 'Consultar', desc: 'Artesanal con virutas de chocolate amargo.', image: '' }
    ]
  }
];

export const REVIEWS = [
  { author: "Carolina M.", text: "La milanesa napolitana es gigante y súper tierna. Un lugar auténtico con excelente atención.", rating: 5 },
  { author: "Jorge G.", text: "El mejor bife de chorizo de la zona. Precios justos y ambiente familiar.", rating: 4 }
];
