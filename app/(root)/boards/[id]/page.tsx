import { notFound } from 'next/navigation';

import { auth } from '@/auth';
import { BoardView } from '@/components/mood-board/BoardViewPage';
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

  return <BoardView board={data} user={session?.user} />;
}
