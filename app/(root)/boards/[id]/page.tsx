import { notFound } from 'next/navigation';

import { auth } from '@/auth';
import { ViewBoard } from '@/components/mood-board/BoardView';
import { getMoodBoard } from '@/lib/actions/moodboard.action';

export default async function BoardPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const { success, data } = await getMoodBoard({ boardId: params.id });

  if (!success || !data) {
    notFound();
  }

  return <ViewBoard board={data} user={session?.user} />;
}
