import mongoose, { type Document, Schema } from "mongoose"

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId
  plan: "free" | "pro" | "premium"
  status: "pending"|"active" | "inactive" | "trial" | "past_due" | "canceled"
  startDate: Date
  endDate?: Date
  trialEndDate?: Date
  billingCycle: "none"|"monthly" | "annual"
  price: number
  currency: string
  paymentMethod: {
    type: string
    last4?: string
    expiryMonth?: number
    expiryYear?: number
    brand?: string
  }
  billingAddress?: {
    line1: string
    line2?: string
    city: string
    state?: string
    postalCode: string
    country: string
  }
  invoices: {
    invoiceId: string
    amount: number
    currency: string
    status: "pending"|"paid" | "unpaid" | "refunded"
    date: Date
    pdfUrl?: string
  }[]
  cancelReason?: string
  autoRenew: boolean
  createdAt: Date
  updatedAt: Date
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },
    plan: {
      type: String,
      enum: ["free", "pro", "premium"],
      required: [true, "Subscription plan is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "trial", "past_due", "canceled","pending"],
      required: [true, "Subscription status is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    trialEndDate: {
      type: Date,
    },
    billingCycle: {
      type: String,
      enum: ["none","monthly", "annual"],
      required: [true, "Billing cycle is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      default: "USD",
    },
    paymentMethod: {
      type: {
        type: String,
        required: [true, "Payment method type is required"],
      },
      last4: String,
      expiryMonth: Number,
      expiryYear: Number,
      brand: String,
    },
    billingAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    invoices: [
      {
        invoiceId: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        currency: {
          type: String,
          required: true,
          default: "USD",
        },
        status: {
          type: String,
          enum: ["paid", "unpaid", "refunded","pending"],
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
        pdfUrl: String,
      },
    ],
    cancelReason: {
      type: String,
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for faster queries
// SubscriptionSchema.index({ userId: 1 })
// SubscriptionSchema.index({ status: 1 })
// SubscriptionSchema.index({ plan: 1 })
// SubscriptionSchema.index({ endDate: 1 })

export default mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", SubscriptionSchema)
