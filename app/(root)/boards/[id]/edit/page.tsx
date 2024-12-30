import { notFound, redirect } from 'next/navigation';

import { auth } from '@/auth';
import EditBoardPageClient from '@/components/mood-board/EditBoardPageClient';
import { ROUTES } from '@/constants/routes';
import { getMoodBoard } from '@/lib/actions/moodboard.action';

export default async function EditBoardPage({ params }: RouteParams) {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session?.user?.id) {
    return redirect('/sign-in');
  }

  const { data: moodboard, success } = await getMoodBoard({ boardId: id });
  if (!success || !moodboard) return notFound();

  if (moodboard.author !== session.user.id) {
    return redirect(ROUTES.BOARDS_VIEW(moodboard._id));
  }

  return <EditBoardPageClient initialBoard={moodboard} session={session} />;
}
