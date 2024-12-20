import { notFound } from 'next/navigation';

import { auth } from '@/auth';
import { ViewBoard } from '@/components/mood-board/BoardView';
import { api } from '@/lib/api';

export default async function BoardPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const { success, data } = await api.moodboards.getById(params.id);

  if (!success || !data) {
    notFound();
  }

  return <ViewBoard board={data} user={session?.user} />;
}
