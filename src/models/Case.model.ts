import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProperty {
  _id?: Types.ObjectId;
  category: string;
  belongingTo: "ACCUSED" | "COMPLAINANT" | "UNKNOWN";
  nature: string;
  quantity: string;
  location: string; // Rack/Room/Locker ID
  description: string;
  photoUrl?: string;
  qrCode?: string;
  createdAt?: Date;
}

export interface ICustodyLog {
  _id?: Types.ObjectId;
  fromLocation: string;
  fromOfficer: string;
  toLocation: string;
  toOfficer: string;
  purpose: string;
  dateTime: Date;
  remarks?: string;
  createdAt?: Date;
}

export interface IDisposal {
  disposalType: "RETURNED" | "DESTROYED" | "AUCTIONED" | "COURT_CUSTODY";
  courtOrderReference: string;
  dateOfDisposal: Date;
  remarks?: string;
  disposedAt?: Date;
}

export interface ICase extends Document {
  policeStationName: string;
  investigatingOfficerName: string;
  investigatingOfficerId: string;
  crimeNumber: string;
  crimeYear: number;
  dateOfFIR: Date;
  dateOfSeizure: Date;
  actAndLaw: string;
  sectionOfLaw: string;
  properties: IProperty[];
  custodyLogs: ICustodyLog[];
  disposal?: IDisposal;
  status: "PENDING" | "DISPOSED";
  createdBy: Types.ObjectId; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    category: { type: String, required: true },
    belongingTo: {
      type: String,
      enum: ["ACCUSED", "COMPLAINANT", "UNKNOWN"],
      required: true,
    },
    nature: { type: String, required: true },
    quantity: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    photoUrl: { type: String },
    qrCode: { type: String },
  },
  { timestamps: true }
);

const CustodyLogSchema = new Schema<ICustodyLog>(
  {
    fromLocation: { type: String, required: true },
    fromOfficer: { type: String, required: true },
    toLocation: { type: String, required: true },
    toOfficer: { type: String, required: true },
    purpose: { type: String, required: true },
    dateTime: { type: Date, required: true },
    remarks: { type: String },
  },
  { timestamps: true }
);

const DisposalSchema = new Schema<IDisposal>(
  {
    disposalType: {
      type: String,
      enum: ["RETURNED", "DESTROYED", "AUCTIONED", "COURT_CUSTODY"],
      required: true,
    },
    courtOrderReference: { type: String, required: true },
    dateOfDisposal: { type: Date, required: true },
    remarks: { type: String },
  },
  { timestamps: true }
);

const CaseSchema: Schema<ICase> = new Schema(
  {
    policeStationName: { type: String, required: true },
    investigatingOfficerName: { type: String, required: true },
    investigatingOfficerId: { type: String, required: true },
    crimeNumber: { type: String, required: true, unique: true },
    crimeYear: { type: Number, required: true },
    dateOfFIR: { type: Date, required: true },
    dateOfSeizure: { type: Date, required: true },
    actAndLaw: { type: String, required: true },
    sectionOfLaw: { type: String, required: true },
    properties: [PropertySchema],
    custodyLogs: [CustodyLogSchema],
    disposal: DisposalSchema,
    status: {
      type: String,
      enum: ["PENDING", "DISPOSED"],
      default: "PENDING",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Case = mongoose.models.Case || mongoose.model<ICase>("Case", CaseSchema);

export default Case;