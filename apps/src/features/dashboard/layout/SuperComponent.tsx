'use client';

import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import CommentDataTable from '../comment/CommentDataTable';
import DealTypeDataTable from '../deal-type/DealTypeDataTable';
import OverviewData from '../overview/OverviewData';
import Settings from '../settings/Settings';
import StoreDataTable from '../store/StoreDataTable';
import SubscriberDataTable from '../subscriber/SubscriberDataTable';
import UserDataTable from '../user/UserDataTable';
import ValidationDataTable from '../validation/ValidationDataTable';

export default function SuperComponent() {
    const navActive = useSelector((state: RootState) => state.adminNav.ActiveNav);

    switch (navActive) {
        case 'activeOverview':
            return <OverviewData />;
        case 'activeDealTypes':
            return <DealTypeDataTable />;
        case 'activeDealVerification':
            return <ValidationDataTable />;
        case 'activeStores':
            return <StoreDataTable />;
        case 'activeComments':
            return <CommentDataTable />;
        case 'activeSubscribers':
            return <SubscriberDataTable />;
        case 'activeUsers':
            return <UserDataTable />;
        case 'activeSettings':
            return <Settings />;
    }
}

export const dynamic = 'force-dynamic';
