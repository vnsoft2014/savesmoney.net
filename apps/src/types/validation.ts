export type ValidationData = {
    _id: string;
    valid: number;
    invalid: number;
    marked: boolean;
    deal: {
        _id: string;
        image: string;
        shortDescription: string;
        expireAt: string | null;
        purchaseLink: string;
        invalid?: boolean;
    };
};
