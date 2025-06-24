let discussions = [];

export const getAllDiscussions = (req, res) => {
    res.json(discussions);
};

export const createDiscussion = (req, res) => {
    const { title, content, author } = req.body;
    const newDiscussion = {
        id: discussions.length + 1,
        title,
        content,
        author,
        comments: [],
        created_at: new Date()
    };
    discussions.push(newDiscussion);
    res.status(201).json(newDiscussion);
};

export const getDiscussionById = (req, res) => {
    const { id } = req.params;
    const discussion = discussions.find(d => d.id == id);
    if (!discussion) {
        return res.status(404).json({ error: "Discussion not found" });
    }
    res.json(discussion);
};

export const addCommentToDiscussion = (req, res) => {
    const { id } = req.params;
    const { comment, commenter } = req.body;
    const discussion = discussions.find(d => d.id == id);
    if (!discussion) {
        return res.status(404).json({ error: "Discussion not found" });
    }
    discussion.comments.push({
        comment,
        commenter,
        posted_at: new Date()
    });
    res.status(201).json({ message: "Comment added successfully" });
};
