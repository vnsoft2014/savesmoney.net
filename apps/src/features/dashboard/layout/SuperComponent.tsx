'use client';

import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import CommentDataTable from '../comment/CommentDataTable';
import DealTypeDataTable from '../deal-type/DealTypeDataTable';
import DealDataTable from '../deal/DealDataTable';
import OverviewData from '../overview/OverviewData';
import { Settings } from '../settings';
import StoreDataTable from '../store/StoreDataTable';
import SubscriberDataTable from '../subscriber/SubscriberDataTable';
import { UserDealsDataTable, UserStoreDataTable } from '../user-store';
import UserDataTable from '../user/UserDataTable';
import { ExpiredDealsDataTable, PendingDealsDataTable, ValidationDataTable, ValidDealsDataTable } from '../validation';

export default function SuperComponent() {
    const navActive = useSelector((state: RootState) => state.adminNav.ActiveNav);

    switch (navActive) {
        case 'activeOverview':
            return <OverviewData />;
        case 'activeDealTypes':
            return <DealTypeDataTable />;
        case 'activeAllDealsVerification':
            return <ValidationDataTable />;
        case 'activePendingDealsVerification':
            return <PendingDealsDataTable />;
        case 'activeValidDealsVerification':
            return <ValidDealsDataTable />;
        case 'activeExpiredDealsVerification':
            return <ExpiredDealsDataTable />;
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
        case 'activeUserDeals':
            return <UserDealsDataTable />;
        case 'activeUserStores':
            return <UserStoreDataTable />;
        case 'activeDeals':
        default:
            return <DealDataTable />;
    }
}

export const dynamic = 'force-dynamic';
