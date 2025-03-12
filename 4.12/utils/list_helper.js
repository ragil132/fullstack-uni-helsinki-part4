const dummy = (blogs) => {
    if (Array.isArray(blogs)) {
        return 1
    }
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {

    return blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0]);

}

const mostBlogs = (blogs) => {
    const authorCounts = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + 1;
        return acc;
    }, {});

    const topAuthor = Object.keys(authorCounts).reduce((max, author) => {
        return authorCounts[author] > max.blogs ? { author, blogs: authorCounts[author] } : max;
    }, { author: '', blogs: 0 });

    return topAuthor;
}

const mostLikes = (blogs) => {
    const authorLikes = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
        return acc;
    }, {});

    const topAuthor = Object.keys(authorLikes).reduce((max, author) => {
        return authorLikes[author] > max.likes ? { author, likes: authorLikes[author] } : max;
    }, { author: '', likes: 0 });

    return topAuthor;
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}