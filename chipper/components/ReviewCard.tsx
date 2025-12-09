import { Review } from '@/lib/types';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-base-200 rounded-xl p-4 space-y-3">
      {/* User Avatar */}
      <div className="flex items-center gap-3">
        <div className="avatar placeholder">
          <div className="w-10 bg-base-300 text-neutral rounded-full">
            <span className="text-sm">{review.user.name.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-base-content">{review.user.name}</h4>
          <div className="flex items-center gap-1">
            <div className="flex text-warning">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`}
                />
              ))}
            </div>
            <span className="text-sm text-base-content/60 ml-2">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Review Content */}
      <p className="text-base-content/80 leading-relaxed">{review.comment}</p>

      {/* Helpful Actions */}
      <div className="flex items-center gap-4 text-sm text-base-content/50">
        <button className="flex items-center gap-1 hover:text-base-content transition-colors">
          <span>Helpful</span>
          <span className="text-xs">({review.helpfulCount || 0})</span>
        </button>
        <button className="flex items-center gap-1 hover:text-base-content transition-colors">
          <span>Report</span>
        </button>
      </div>
    </div>
  );
}