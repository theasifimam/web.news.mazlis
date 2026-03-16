import Image from 'next/image';
import Link from 'next/link';
import { Clock, Eye } from 'lucide-react';
import { getImageUrl } from '@/lib/config';

interface ArticleCardProps {
    article: {
        id: string;
        slug: string;
        title: string;
        author: string;
        date: string;
        imageUrl: string;
        views?: number;
        readTime?: string;
    };
    variant?: 'horizontal' | 'vertical';
}

export default function ArticleCard({ article, variant = 'horizontal' }: ArticleCardProps) {
    if (variant === 'vertical') {
        return (
            <Link href={`/articles/${article.slug}-${article.id}`} className="flex flex-col gap-4 group">
                <div className="relative aspect-[4/3] w-full rounded-[1.5rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <Image
                        src={getImageUrl(article.imageUrl)}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold font-outfit leading-tight line-clamp-2 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-400">
                        {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>By {article.author}</span>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/articles/${article.slug}-${article.id}`} className="flex gap-4 items-center group py-4">
            <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <Image
                    src={getImageUrl(article.imageUrl)}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
                <h3 className="text-base font-bold font-outfit leading-snug line-clamp-2 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-400">
                    {article.title}
                </h3>
                <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.1em]">
                    <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{article.date}</span>
                    </div>
                    {article.views && (
                        <div className="flex items-center gap-1">
                            <Eye size={12} />
                            <span>{article.views.toLocaleString()} views</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
