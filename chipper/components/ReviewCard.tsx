import { Review } from '@/lib/types';
import { Flag, Star, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [helpful, setHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);

  const handleHelpful = () => {
    if (!helpful) {
      setHelpful(true);
      setHelpfulCount(helpfulCount + 1);
    } else {
      setHelpful(false);
      setHelpfulCount(helpfulCount - 1);
    }
  };

  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const userInitial = review.user.name.charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8 hover:shadow-md transition-shadow duration-300">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">{userInitial}</span>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900 text-sm lg:text-base">{review.user.name}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{formattedDate}</p>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 ml-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
            />
          ))}
        </div>
      </div>

      {/* Review Comment */}
      <div className="mb-6">
        <p className="text-slate-700 leading-relaxed text-sm lg:text-base">{review.comment}</p>
      </div>

      {/* Actions Footer */}
      <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
        <button
          onClick={handleHelpful}
          className={`flex items-center gap-2 text-xs lg:text-sm font-medium transition-all duration-200 ${
            helpful
              ? 'text-blue-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${helpful ? 'fill-current' : ''}`} />
          <span>Helpful</span>
          {helpfulCount > 0 && <span className="text-slate-400">({helpfulCount})</span>}
        </button>

        <button className="flex items-center gap-2 text-xs lg:text-sm font-medium text-slate-500 hover:text-red-600 transition-colors duration-200">
          <Flag className="w-4 h-4" />
          <span>Report</span>
        </button>
      </div>
    </div>
  );
}