import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IPosition extends Document {
  name: string;
  description?: string;
}

const PositionSchema: Schema = new Schema<IPosition>(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Position =
  models.Position || model<IPosition>("Position", PositionSchema);
