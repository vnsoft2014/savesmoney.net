import mongoose from 'mongoose';

const DealTypeSchema = new mongoose.Schema({
    thumbnail: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
});

DealTypeSchema.pre('save', async function () {
    if (!this.isModified('slug')) return;

    const baseSlug = this.slug;

    let slug = this.slug;
    let count = 1;

    const Model = this.constructor as mongoose.Model<any>;

    while (await Model.findOne({ slug })) {
        slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
});

const DealType = mongoose.models.DealTypes || mongoose.model('DealTypes', DealTypeSchema);

export default DealType;
