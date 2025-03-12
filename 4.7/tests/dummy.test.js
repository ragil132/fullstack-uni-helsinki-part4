const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]

    test('of empty list is zero', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 0)
    })

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 10)
    })
})

describe('favorite blog', () => {
    const blogs = [
        {

            title: 'test',
            author: 'test2',

            likes: 5,

        },
        {

            title: 'Test',
            author: 'Anonym',

            likes: 10,

        },
        {

            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',

            likes: 12,

        }
    ];

    test('get favorite blog', () => {
        const result = listHelper.favoriteBlog(blogs);
        const expected = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
        };
        assert.deepStrictEqual(result, expected);
    });

})

describe('most blogs', () => {
    const blogs = [
        {
            _id: '1',
            title: 'test Blog 1',
            author: 'Robert C. Martin',
            likes: 9,
            __v: 0
        },
        {
            _id: '2',
            title: 'test Blog 2',
            author: 'Robert C. Martin',
            likes: 5,
            __v: 0
        },
        {
            _id: '3',
            title: 'test Blog 3',
            author: 'test',
            likes: 14,
            __v: 0
        },
        {
            _id: '4',
            title: 'test Blog 4',
            author: 'Robert C. Martin',
            likes: 2,
            __v: 0
        }
    ];

    test('author with the most blogs', () => {
        const result = listHelper.mostBlogs(blogs);
        const expected = {
            author: "Robert C. Martin",
            blogs: 3
        };
        assert.deepStrictEqual(result, expected);
    });

});

describe('find most likes', () => {
    const blogs = [
        {
            _id: '1',
            title: 'test Blog 1',
            author: 'Robert C. Martin',
            likes: 6,
            __v: 0
        },
        {
            _id: '2',
            title: 'test Blog 2',
            author: 'Edsger W. Dijkstra',
            likes: 1,
            __v: 0
        },
        {
            _id: '3',
            title: 'test Blog 3',
            author: 'Edsger W. Dijkstra',
            likes: 16,
            __v: 0
        },
        {
            _id: '4',
            title: 'test Blog 4',
            author: 'Robert C. Martin',
            likes: 9,
            __v: 0
        }
    ];

    test('finds the author with the most likes', () => {
        const result = listHelper.mostLikes(blogs);
        const expected = {
            author: "Edsger W. Dijkstra",
            likes: 17
        };
        assert.deepStrictEqual(result, expected);
    });

});
