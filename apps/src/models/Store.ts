import mongoose from 'mongoose';

const StoreSchema = new mongoose.Schema({
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

StoreSchema.pre('save', async function () {
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

const Store = mongoose.models.Stores || mongoose.model('Stores', StoreSchema);

export default Store;
