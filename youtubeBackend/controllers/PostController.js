import User from "../models/UserModel.js";
import Post from "../models/PostModel.js";

// Add a new post
export const AddPost = async (req, res) => {
  try {
    let { title, description, videoUrl } = req.body;
    console.log(title, description, videoUrl);
    const userId = req.user; // From auth middleware

    // Validate required fields
    if (!title || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: "Title and video URL are required",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create new post
    const newPost = new Post({
      userId,
      title,
      description,
      videoUrl,
    });

    await newPost.save();

    // Populate user info for response
    await newPost.populate("userId", "username profilePicture");

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: {
        post: newPost,
      },
    });
  } catch (error) {
    console.error("Add post error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all posts with pagination
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(200).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id,"id")
    const { title, description, videoUrl } = req.body;
    const user = req.user; // From auth middleware

    if(!user){
      return res.status(400).json({message:"usernot found"})
    }
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
   console.log(user)

    console.log(post.userId, user._id)

  

    // Update fields
    if (title) post.title = title;
    if (description !== undefined) post.description = description;
    if (videoUrl) post.videoUrl = videoUrl;

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: {
        post,
      },
    });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// Get post by ID
export const getPostById = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ message: "usernot found" });
    }

    const post = await Post.find({ userId: user._id });
    console.log(post, "post");
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        post,
      },
    });
  } catch (error) {
    console.error("Get post by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};



// Delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user; // From auth middleware

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Like/Unlike post
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user; // From auth middleware

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user already liked the post
    const hasLiked = post.likes.includes(userId);
    const hasDisliked = post.dislikes.includes(userId);

    if (hasLiked) {
      // Unlike
      post.likeCount = Math.max(0, post.likeCount - 1);
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like
      post.likeCount += 1;
      post.likes.push(userId);

      // Remove from dislikes if previously disliked
      if (hasDisliked) {
        post.dislikeCount = Math.max(0, post.dislikeCount - 1);
        post.dislikes = post.dislikes.filter((id) => id.toString() !== userId);
      }
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: hasLiked ? "Post unliked" : "Post liked",
      data: {
        likeCount: post.likeCount,
        dislikeCount: post.dislikeCount,
        isLiked: !hasLiked,
        isDisliked: hasDisliked && !hasLiked,
      },
    });
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};



// Add comment to post
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user; // From auth middleware

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Add comment
    post.comments.push({
      comment: comment.trim(),
      userId,
    });

    await post.save();

    // Populate user info for the new comment
    await post.populate("comments.userId", "username profilePicture");

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: {
        comment: newComment,
      },
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate("comments.userId", "username profilePicture")
      .select("comments");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: post.comments,
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
