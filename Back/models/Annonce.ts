import mongoose, { Schema, Document, type ObjectId } from "mongoose";

// Interface TypeScript pour le modèle d'annonce
export interface IAnnonce extends Document {
  author: ObjectId;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  image: string; // Chemin vers l'image
  createdAt: Date;
  updatedAt: Date;
}

// Schéma de l'annonce
const annonceSchema: Schema = new Schema<IAnnonce>(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true, // Ajoute automatiquement `createdAt` et `updatedAt`
  }
);

// Modèle d'annonce
const Annonce = mongoose.model<IAnnonce>("Annonce", annonceSchema);

export default Annonce;
