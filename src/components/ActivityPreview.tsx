import React from "react";
import type { DayActivity } from "../utils/activityUtils";
import { formatActivityDate } from "../utils/activityUtils";

interface ActivityPreviewProps {
  day: DayActivity;
  position: { x: number; y: number };
  isMobile: boolean;
  onClose: () => void;
}

const ActivityPreview: React.FC<ActivityPreviewProps> = ({
  day,
  position,
  isMobile,
  onClose,
}) => {
  const { posts, date } = day;

  if (isMobile) {
    // Mobile modal (bottom sheet)
    return (
      <>
        {/* Backdrop */}
        <div className="preview-backdrop" onClick={onClose} />

        {/* Modal */}
        <div className="preview-modal">
          <div className="preview-modal-header">
            <h3 className="preview-modal-date">{formatActivityDate(date)}</h3>
            <button className="preview-modal-close" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className="preview-modal-content">
            {posts.map((post, index) => (
              <a
                key={`${post.slug}-${index}`}
                href={`/${post.type === "blog" ? "blog" : post.type === "learn" ? "learn" : "projects"}/${post.slug}`}
                className="preview-post-item"
              >
                {post.image && (
                  <div className="preview-post-image-container">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="preview-post-image"
                    />
                  </div>
                )}
                <div className="preview-post-content">
                  <h4 className="preview-post-title">{post.title}</h4>
                  {post.description && (
                    <p className="preview-post-description">{post.description}</p>
                  )}
                  <span className="preview-post-type">{post.type}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Desktop floating preview (follows cursor)
  const offsetX = 20;
  const offsetY = 20;

  // Adjust position to avoid going off-screen
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const previewWidth = 350;
  const previewHeight = 200;

  let left = position.x + offsetX;
  let top = position.y + offsetY;

  // If preview goes off right edge, position to left of cursor
  if (left + previewWidth > viewportWidth) {
    left = position.x - previewWidth - offsetX;
  }

  // If preview goes off bottom edge, position above cursor
  if (top + previewHeight > viewportHeight) {
    top = position.y - previewHeight - offsetY;
  }

  return (
    <div
      className="preview-card"
      style={{
        left: `${left}px`,
        top: `${top}px`,
      }}
    >
      <div className="preview-card-header">
        <span className="preview-card-date">{formatActivityDate(date)}</span>
        {posts.length > 1 && (
          <span className="preview-card-count">{posts.length} posts</span>
        )}
      </div>

      <div className="preview-card-posts">
        {posts.map((post, index) => (
          <a
            key={`${post.slug}-${index}`}
            href={`/${post.type === "blog" ? "blog" : post.type === "learn" ? "learn" : "projects"}/${post.slug}`}
            className="preview-card-post"
          >
            {post.image && (
              <div className="preview-card-image-container">
                <img
                  src={post.image}
                  alt={post.title}
                  className="preview-card-image"
                />
              </div>
            )}
            <div className="preview-card-post-content">
              <h4 className="preview-card-title">{post.title}</h4>
              {post.description && (
                <p className="preview-card-description">{post.description}</p>
              )}
              <span className="preview-card-type">{post.type}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ActivityPreview;
