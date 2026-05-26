import { notFound } from 'next/navigation';
import { getLevelById } from '@/lib/levels';
import GameContainer from '@/components/game/GameContainer';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JugarPage({ params }: PageProps) {
  const { id } = await params;
  const level = getLevelById(id);

  if (!level) {
    notFound();
  }

  return <GameContainer level={level} />;
}