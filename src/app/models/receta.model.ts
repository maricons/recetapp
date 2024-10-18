export interface Receta {
    autorId: string;
    descripcion: string;
    imagen: string;
    ingredientes: string[];
    instrucciones: string;
    minutos: number;
    titulo: string;
    categoria: string; // Campo para la categoría
  }