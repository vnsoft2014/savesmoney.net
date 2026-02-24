import mongoose from 'mongoose';

const StoreSchema = new mongoose.Schema({
    thumbnail: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
});

const Store = mongoose.models.Stores || mongoose.model('Stores', StoreSchema);

export default Store;
