import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  hashedPassword?: string;
  provider?: string;
  providerId?: string;
  avatar?: string;
  resumes: mongoose.Types.ObjectId[];
  subscription: {
    type: 'free' | 'premium' | 'enterprise';
    startDate?: Date;
    endDate?: Date;
    features: string[];
  };
  preferences: {
    defaultTemplate: string;
    emailNotifications: boolean;
    shareAnalytics: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  hashedPassword: {
    type: String,
    select: false // Don't include password in queries by default
  },
  provider: {
    type: String,
    enum: ['local', 'google', 'linkedin', 'github'],
    default: 'local'
  },
  providerId: {
    type: String,
    sparse: true // Allow null but ensure uniqueness when present
  },
  avatar: {
    type: String,
    trim: true
  },
  resumes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  }],
  subscription: {
    type: {
      type: String,
      enum: ['free', 'premium', 'enterprise'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    features: [{
      type: String,
      enum: [
        'unlimited_resumes',
        'premium_templates',
        'ats_score',
        'download_pdf',
        'cover_letter',
        'linkedin_import',
        'priority_support'
      ]
    }]
  },
  preferences: {
    defaultTemplate: {
      type: String,
      default: 'modern',
      enum: ['modern', 'classic', 'creative', 'minimal', 'professional']
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    shareAnalytics: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.hashedPassword;
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.hashedPassword;
      return ret;
    }
  }
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ provider: 1, providerId: 1 });
UserSchema.index({ 'subscription.type': 1 });

// Virtual for resume count
UserSchema.virtual('resumeCount', {
  ref: 'Resume',
  localField: '_id',
  foreignField: 'userId',
  count: true
});

// Method to check if user has premium features
UserSchema.methods.hasPremiumFeature = function(feature: string): boolean {
  return this.subscription.features.includes(feature) ||
         this.subscription.type === 'premium' ||
         this.subscription.type === 'enterprise';
};

// Method to check if subscription is active
UserSchema.methods.isSubscriptionActive = function(): boolean {
  if (this.subscription.type === 'free') return true;
  if (!this.subscription.endDate) return false;
  return new Date() <= this.subscription.endDate;
};

// Set default features based on subscription type
UserSchema.pre('save', function(next) {
  if (this.isModified('subscription.type')) {
    switch (this.subscription.type) {
      case 'free':
        this.subscription.features = ['download_pdf'];
        break;
      case 'premium':
        this.subscription.features = [
          'unlimited_resumes',
          'premium_templates',
          'ats_score',
          'download_pdf',
          'cover_letter'
        ];
        break;
      case 'enterprise':
        this.subscription.features = [
          'unlimited_resumes',
          'premium_templates',
          'ats_score',
          'download_pdf',
          'cover_letter',
          'linkedin_import',
          'priority_support'
        ];
        break;
    }
  }
  next();
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
