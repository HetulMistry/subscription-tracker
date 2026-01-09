import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Price must be a positive number']
    },
    currency: {
        type: String,
        enum: ['INR', 'USD', 'EUR', 'GBP'],
        default: 'INR'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category: {
        type: String,
        enum: ['basic', 'standard', 'premium', 'enterprise'],
        required: [true, 'Subscription category is required']
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'canceled', 'pending', 'expired'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: [true, 'Subscription start date is required'],
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date cannot be in the future'
        }
    },
    renewalDate: {
        type: Date,
        // TODO: Fix this validation, causing error when renewalDate is not provided
        //! required: [true, 'Subscription renewal date is required'],
        validate: {
            validator: function (value) {
                if (!value) return true;
                return value > this.startDate;
            },
            message: 'Renewal date must be after start date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Associated user is required'],
        index: true
    }
}, {
    timestamps: true
});

subscriptionSchema.pre('save', function () {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + (renewalPeriods[this.frequency]));
    }

    if (this.renewalDate <= new Date()) this.status = 'expired';
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;