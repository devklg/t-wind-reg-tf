const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  // Sequential ID
  enrollmentId: {
    type: String,
    unique: true,
    required: true
  },

  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  zipCode: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },

  // Sponsor/Enroller Information
  sponsorName: {
    type: String,
    required: true,
    trim: true
  },
  sponsorId: {
    type: String,
    trim: true,
    ref: 'Enrollment' // Reference to the enroller's enrollment
  },

  // Package Information
  package: {
    type: String,
    required: true,
    enum: ['Entry Pack', 'Elite Pack', 'Pro Pack']
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Bank Transfer']
  },

  // Status and Timestamps
  status: {
    type: String,
    enum: ['Pending', 'Active', 'Suspended', 'Terminated'],
    default: 'Pending'
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  fastStartBonus: {
    type: Number,
    default: 0
  },
  salesVolume: {
    type: Number,
    default: 0
  },
  teamVolume: {
    type: Number,
    default: 0
  },
  personalVolume: {
    type: Number,
    default: 0
  },

  // Role and Authentication
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    select: false // Don't include password in queries by default
  }
}, {
  timestamps: true
});

// Pre-save hook to generate sequential ID
enrollmentSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      // Get the latest enrollment to determine the next number
      const latestEnrollment = await this.constructor.findOne({}, {}, { sort: { 'enrollmentId': -1 } });
      let nextNumber = 1000;
      
      if (latestEnrollment) {
        // Extract the number from the latest enrollmentId (PL-XXXX)
        const lastNumber = parseInt(latestEnrollment.enrollmentId.split('-')[1]);
        nextNumber = lastNumber + 1;
      }
      
      // Generate the new enrollmentId
      this.enrollmentId = `PL-${nextNumber}`;
      
      // Set the enrollment date to the current timestamp
      this.enrollmentDate = new Date();

      // If there's a sponsor name, try to find their enrollment ID
      if (this.sponsorName) {
        // Split the sponsor name into first and last name
        const nameParts = this.sponsorName.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');

        // Try to find the sponsor by first and last name
        const sponsor = await this.constructor.findOne({
          firstName: { $regex: new RegExp(`^${firstName}$`, 'i') },
          lastName: { $regex: new RegExp(`^${lastName}$`, 'i') }
        });

        if (sponsor) {
          this.sponsorId = sponsor.enrollmentId;
          console.log(`Found sponsor: ${sponsor.enrollmentId} for ${this.sponsorName}`);
        } else {
          console.log(`No sponsor found for: ${this.sponsorName}`);
        }
      }
    } catch (error) {
      console.error('Error in pre-save hook:', error);
      next(error);
      return;
    }
  }
  next();
});

// Pre-save hook to set fast start bonus and personal volume based on package
enrollmentSchema.pre('save', function(next) {
  if (this.isNew) {
    switch (this.package) {
      case 'Entry Pack':
        this.fastStartBonus = 50;
        this.personalVolume = 100;
        break;
      case 'Elite Pack':
        this.fastStartBonus = 100;
        this.personalVolume = 200;
        break;
      case 'Pro Pack':
        this.fastStartBonus = 200;
        this.personalVolume = 400;
        break;
    }
  }
  next();
});

// Method to update team volume and recalculate total sales volume
enrollmentSchema.methods.updateTeamVolume = async function(newTeamVolume) {
  this.teamVolume = newTeamVolume;
  this.salesVolume = this.personalVolume + this.teamVolume;
  await this.save();
};

// Virtual for full name
enrollmentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment; 