import { useEffect, useState } from "react";
import { Loader, ThumbsUp } from "lucide-react"; // nice lightweight like icon
import axios from "axios";

const VideoPlayerModal = ({ video, onClose }) => {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  console.log(video, "videos details");
  const [commentsloader, setcommentsLoader] = useState(false);
  const fetchallcomments = async () => {
    try {
      setcommentsLoader(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}user/comments/${video._id}`
      );
      console.log(response, " response");

      setComments(response?.data?.data);
      setcommentsLoader(false);
    } catch (error) {
      setcommentsLoader(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchallcomments();
  }, [video._id]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleLike = () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([{ text: newComment, id: Date.now() }, ...comments]);
    setNewComment("");
  };

  const addnewComment = () => {
    try {
      const body = {
        comment: newComment,
      };
      const response = axios.post(
        `${import.meta.env.VITE_BASE_URL}user/comment/${video._id}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("youtubetoken")}`,
          },
        }
      );

      if (response) {
        fetchallcomments();
        setNewComment("");
      }
    } catch (error) {}
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center overflow-y-auto ">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          ✖
        </button>

        {/* Video */}
        <div className="w-full pt-[200px]">
          <video
            src={video.videoUrl}
            controls
            autoPlay
            className="w-full h-auto max-h-[70vh] rounded-lg bg-black"
          />
        </div>

        {/* Video Info */}
        <div className="mt-4 px-1">
          <h2 className="text-xl font-bold text-black">{video.title}</h2>
          <p className="text-gray-600 text-sm mt-1">{video.description}</p>

          {/* <div className="mt-3 flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`px-4 py-2 rounded-md flex items-center gap-2 border transition ${
                liked
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              <ThumbsUp
                size={18}
                className={liked ? "text-white" : "text-gray-700"}
              />
              {likes}
            </button>
          </div> */}
        </div>

        {/* Comments Section */}
        <div className="mt-6 px-1">
          <h3 className="text-lg font-semibold text-black mb-3">
            Comments ({comments.length})
          </h3>

          {/* Add comment */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Add a public comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 px-3 py-2 rounded-md bg-gray-100 text-black text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={addnewComment}
              className="px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800"
            >
              Comment
            </button>
          </div>

          {/* Comment list */}
          {commentsloader ? (
            <div className="flex items-center justify-center py-4">
              <Loader />
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {comments.length > 0 ? (
                comments.map((c) => (
                  <div
                    key={c._id}
                    className="bg-gray-100 p-2 rounded-md text-gray-800 text-sm"
                  >
                    {c.comment}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No comments yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
