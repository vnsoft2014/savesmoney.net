import mongoose from 'mongoose';

const DealTypeSchema = new mongoose.Schema({
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

const DealType = mongoose.models.DealTypes || mongoose.model('DealTypes', DealTypeSchema);

export default DealType;
