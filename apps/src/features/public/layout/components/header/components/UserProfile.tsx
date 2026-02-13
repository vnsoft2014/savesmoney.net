import { Avatar, AvatarFallback, AvatarImage } from '@/shared/shadecn/ui/avatar';
import { User } from '@/types';
import { getInitials } from '@/utils/utils';
import { Mail } from 'lucide-react';
import { memo } from 'react';

interface Props {
    user: User | null;
}

const UserProfile = ({ user }: Props) => {
    if (!user) return null;

    return (
        <div className="relative px-6 py-8 bg-linear-to-br from-indigo-600 to-blue-700 text-white  overflow-hidden">
            <div className="relative flex items-center space-x-4">
                <Avatar className="h-14 w-14 border-2 border-white/20 shadow-xl">
                    <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                    <AvatarFallback className="bg-white text-indigo-600 font-bold">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="mb-2 font-semibold truncate">{user.name}</div>
                    <div className="text-sm text-blue-100 truncate flex items-center mt-1">
                        <Mail className="w-3 h-3 mr-1" /> {user.email}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(UserProfile);
