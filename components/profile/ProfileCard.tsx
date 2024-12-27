import { Plus, Settings } from 'lucide-react';
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

interface ProfileCardProps {
  username: string;
  collectionNum: number;
  stats: { [key: string]: number };
}

const ProfileCard = ({ username, collectionNum, stats }: ProfileCardProps) => {
  return (
    <Card className="px-6">
      <CardContent className="py-6">
        <div className="flex flex-col items-center md:flex-row md:items-center md:gap-4 lg:gap-6">
          {/* Profile Image */}
          <div className="group relative">
            <div className="size-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
              <Avatar className="size-full">
                <AvatarImage src="/images/default-avatar.png" />
                <AvatarFallback>
                  {(username as string)?.slice(0, 2).toUpperCase() ?? ''}
                </AvatarFallback>
              </Avatar>
            </div>
            {/* Level */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-purple-600 px-3 py-1 text-xs font-medium text-white">
              {Math.floor(collectionNum / 5)}
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-4 flex-1 text-center md:mt-0 md:text-left">
            <CardHeader>
              <CardTitle className="holographic-text text-3xl font-semibold">
                {username}
              </CardTitle>
              <CardDescription className="mt-1">
                Fragrance Enthusiast | Collection Curator
              </CardDescription>
            </CardHeader>

            {/* Stats */}
            <div className="flex justify-center gap-6 md:justify-start">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                    {value.toLocaleString()}
                  </div>
                  <div className="text-sm capitalize text-purple-800 dark:text-purple-500">
                    {key}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-4 md:mt-0">
            <Button variant="premium" className="gap-2">
              <Plus className="size-4" />
              Follow
            </Button>
            <Button variant="outline" size="icon">
              <Link href={ROUTES.PROFILE_SETTINGS}>
                <Settings className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
