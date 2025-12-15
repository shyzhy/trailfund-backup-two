const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Request = require('../models/Request');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

// --- USERS ---

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;

    try {
        // Find user by username OR email
        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }]
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // In a real app, compare hashed password. Here we compare plain text as per seed.
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Return user info (excluding password)
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({ message: 'Login successful', user: userResponse });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Signup
router.post('/signup', async (req, res) => {
    const { username, password, email, name, age, college } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        const newUser = new User({
            username,
            password, // In a real app, hash this!
            email,
            name,
            age,
            college
        });

        const savedUser = await newUser.save();

        // Return user info (excluding password)
        const userResponse = savedUser.toObject();
        delete userResponse.password;

        res.status(201).json({ message: 'User created successfully', user: userResponse });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Profile Photo
router.post('/users/:id/photo', async (req, res) => {
    try {
        const { profile_picture } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { profile_picture },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile photo updated', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update User Profile
router.put('/users/:id', async (req, res) => {
    const { name, username, bio, age, college, department, year_level, profile_picture } = req.body;

    try {
        // Check if username already exists (if changed)
        if (username) {
            const existingUser = await User.findOne({ username, _id: { $ne: req.params.id } });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already taken' });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                name,
                username,
                bio,
                age,
                college,
                department,
                year_level,
                profile_picture
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user info sans password
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.json({ message: 'Profile updated successfully', user: userResponse });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get requests by user
router.get('/users/:id/requests', async (req, res) => {
    try {
        const requests = await Request.find({ user_id: req.params.id }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- CAMPAIGNS ---

// Get all campaigns
router.get('/campaigns', async (req, res) => {
    try {
        const campaigns = await Campaign.find().sort({ createdAt: -1 });
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single campaign
router.get('/campaigns/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
        res.json(campaign);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a campaign
router.post('/campaigns', async (req, res) => {
    const campaign = new Campaign(req.body);
    try {
        const newCampaign = await campaign.save();
        res.status(201).json(newCampaign);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// --- REQUESTS ---

// Get all requests
router.get('/requests', async (req, res) => {
    try {
        const requests = await Request.find().populate('user_id', 'name username').sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single request
router.get('/requests/:id', async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate('user_id', 'name username profile_picture')
            .populate('fulfillments.user_id', 'name username profile_picture');
        if (!request) return res.status(404).json({ message: 'Request not found' });
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a request
router.post('/requests', async (req, res) => {
    const request = new Request(req.body);
    try {
        const newRequest = await request.save();
        res.status(201).json(newRequest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Register interest/fulfillment for a request
router.post('/requests/:id/fulfill', async (req, res) => {
    const { user_id } = req.body;
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        // Check if already interested
        if (request.fulfillments.some(f => f.user_id.toString() === user_id)) {
            return res.status(400).json({ message: 'You have already contacted this request.' });
        }

        // Create Notification for Request Owner
        if (request.user_id.toString() !== user_id) {
            const notification = new Notification({
                recipient_id: request.user_id,
                sender_id: user_id,
                type: 'request_fulfillment',
                message: `has contacted you regarding your request: ${request.title}`,
                related_id: request._id
            });
            await notification.save();
        }

        request.fulfillments.push({ user_id });
        await request.save();
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- POSTS ---

// Get all posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().populate('user_id', 'name username profile_picture').sort({ date_posted: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a post
router.post('/posts', async (req, res) => {
    const post = new Post(req.body);
    try {
        const newPost = await post.save();
        // Populate user details for immediate display
        await newPost.populate('user_id', 'name username profile_picture');
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Toggle Like
router.post('/posts/:id/like', async (req, res) => {
    const { user_id } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const index = post.likes.indexOf(user_id);
        if (index === -1) {
            post.likes.push(user_id); // Like
        } else {
            post.likes.splice(index, 1); // Unlike
        }
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get posts by user
router.get('/users/:id/posts', async (req, res) => {
    try {
        const posts = await Post.find({ user_id: req.params.id }).sort({ date_posted: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single post
router.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user_id', 'name username profile_picture');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get comments for a post
router.get('/posts/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ post_id: req.params.id }).populate('user_id', 'name username profile_picture').sort({ date_posted: 1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a comment
router.post('/posts/:id/comments', async (req, res) => {
    const { user_id, content, parent_comment_id } = req.body;

    if (!user_id || !content) {
        return res.status(400).json({ message: 'User ID and content are required' });
    }

    try {
        const comment = new Comment({
            user_id,
            post_id: req.params.id,
            content,
            parent_comment_id
        });

        const newComment = await comment.save();

        // Update post comment count
        await Post.findByIdAndUpdate(req.params.id, { $inc: { comments: 1 } });

        await newComment.populate('user_id', 'name username profile_picture');
        res.status(201).json(newComment);
    } catch (err) {
        console.error('Error saving comment:', err);
        res.status(400).json({ message: err.message });
    }
});

// Delete a campaign
router.delete('/campaigns/:id', async (req, res) => {
    try {
        await Campaign.findByIdAndDelete(req.params.id);
        res.json({ message: 'Campaign deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a request
router.delete('/requests/:id', async (req, res) => {
    try {
        await Request.findByIdAndDelete(req.params.id);
        res.json({ message: 'Request deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a campaign
router.put('/campaigns/:id', async (req, res) => {
    try {
        const updatedCampaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCampaign);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a request
router.put('/requests/:id', async (req, res) => {
    try {
        const updatedRequest = await Request.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Approve a campaign
router.post('/campaigns/:id/approve', async (req, res) => {
    const { user_id } = req.body; // Faculty ID
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

        const faculty = await User.findById(user_id);
        if (!faculty || faculty.role !== 'faculty') {
            return res.status(403).json({ message: 'Only faculty can approve campaigns' });
        }

        campaign.status = 'approved';
        campaign.approved_by = user_id;
        campaign.date_approved = Date.now();
        await campaign.save();

        // Create Notification for Campaign Owner
        const notification = new Notification({
            recipient_id: campaign.user_id,
            sender_id: user_id,
            type: 'campaign_approved',
            message: `has approved your campaign: ${campaign.name}`,
            related_id: campaign._id
        });
        await notification.save();

        res.json(campaign);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- NOTIFICATIONS ---

// Get notifications for a user
router.get('/notifications/:userId', async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient_id: req.params.userId })
            .populate('sender_id', 'name username profile_picture')
            .sort({ date: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mark notification as read
router.put('/notifications/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { is_read: true }, { new: true });
        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
