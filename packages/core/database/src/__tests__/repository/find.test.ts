import { mockDatabase } from '../index';
import Database from '@nocobase/database';
import { Collection } from '../../collection';

describe('find with associations', () => {
  let db: Database;
  beforeEach(async () => {
    db = mockDatabase();

    await db.clean({ drop: true });
  });

  afterEach(async () => {
    await db.close();
  });

  it('should filter by association array field', async () => {
    const User = db.collection({
      name: 'users',
      fields: [
        {
          type: 'string',
          name: 'name',
        },
        {
          type: 'hasMany',
          name: 'posts',
        },
      ],
    });

    const Post = db.collection({
      name: 'posts',
      fields: [
        {
          type: 'array',
          name: 'tags',
        },
        {
          type: 'string',
          name: 'title',
        },
      ],
    });

    await db.sync();

    await User.repository.create({
      values: [
        {
          name: 'u1',
          posts: [
            {
              tags: ['t1'],
              title: 'u1p1',
            },
          ],
        },
      ],
    });

    const posts = await Post.repository.find({
      filter: {
        tags: {
          $match: ['t1'],
        },
      },
    });

    expect(posts.length).toEqual(1);

    const filter = {
      $and: [
        {
          posts: {
            tags: {
              $match: ['t1'],
            },
          },
        },
      ],
    };

    const results = await User.repository.find({
      filter,
    });

    expect(results[0].get('name')).toEqual('u1');
  });

  it('should filter with append', async () => {
    const Post = db.collection({
      name: 'posts',
      fields: [
        { name: 'title', type: 'string' },
        {
          name: 'user',
          type: 'belongsTo',
        },
        {
          name: 'category',
          type: 'belongsTo',
        },
      ],
    });

    const Category = db.collection({
      name: 'categories',
      fields: [
        {
          name: 'name',
          type: 'string',
        },
      ],
    });

    const User = db.collection({
      name: 'users',
      fields: [
        { name: 'name', type: 'string' },
        { type: 'belongsTo', name: 'organization' },
        {
          type: 'belongsTo',
          name: 'department',
        },
      ],
    });

    const Org = db.collection({
      name: 'organizations',
      fields: [{ name: 'name', type: 'string' }],
    });

    const Dept = db.collection({
      name: 'departments',
      fields: [{ name: 'name', type: 'string' }],
    });

    await db.sync();

    await Post.repository.create({
      values: [
        {
          title: 'p1',
          category: { name: 'c1' },
          user: {
            name: 'u1',
            organization: {
              name: 'o1',
            },
            department: {
              name: 'd1',
            },
          },
        },
        {
          title: 'p2',
          category: { name: 'c2' },
          user: {
            name: 'u2',
            organization: {
              name: 'o2',
            },
            department: {
              name: 'd2',
            },
          },
        },
      ],
    });

    const filterResult = await Post.repository.find({
      appends: ['user.department'],
      filter: {
        'user.name': 'u1',
      },
    });

    expect(filterResult[0].user.department).toBeDefined();
  });

  it('should filter by association field', async () => {
    const User = db.collection({
      name: 'users',
      tree: 'adjacency-list',
      fields: [
        { type: 'string', name: 'name' },
        { type: 'hasMany', name: 'posts', target: 'posts', foreignKey: 'user_id' },
        {
          type: 'belongsTo',
          name: 'parent',
          foreignKey: 'parent_id',
          treeParent: true,
        },
        {
          type: 'hasMany',
          name: 'children',
          foreignKey: 'parent_id',
          treeChildren: true,
        },
      ],
    });

    const Post = db.collection({
      name: 'posts',
      fields: [
        { type: 'string', name: 'title' },
        { type: 'belongsTo', name: 'user', target: 'users', foreignKey: 'user_id' },
      ],
    });

    await db.sync();

    expect(User.options.tree).toBeTruthy();

    await User.repository.create({
      values: [
        {
          name: 'u1',
          posts: [
            {
              title: 'u1p1',
            },
          ],
          children: [
            {
              name: 'u2',
              posts: [
                {
                  title: '标题2',
                },
              ],
            },
          ],
        },
      ],
    });

    const filter = {
      $and: [
        {
          children: {
            posts: {
              title: {
                $eq: '标题2',
              },
            },
          },
        },
      ],
    };

    const [findResult, count] = await User.repository.findAndCount({
      filter,
      offset: 0,
      limit: 20,
    });

    expect(findResult[0].get('name')).toEqual('u1');
  });
});

describe('repository find', () => {
  let db: Database;
  let User: Collection;
  let Post: Collection;
  let Comment: Collection;
  let Tag: Collection;
  let Profile: Collection;

  let A1: Collection;
  let A2: Collection;

  afterEach(async () => {
    await db.close();
  });

  beforeEach(async () => {
    db = mockDatabase();

    User = db.collection<{ id: number; name: string }, { name: string }>({
      name: 'users',
      fields: [
        { type: 'string', name: 'name' },
        { type: 'integer', name: 'age' },
        { type: 'hasMany', name: 'posts' },
        { type: 'hasOne', name: 'profile' },
        { type: 'belongsToMany', name: 'a1' },
        { type: 'belongsToMany', name: 'a2' },
      ],
    });

    A1 = db.collection({
      name: 'a1',
      fields: [{ type: 'string', name: 'name' }],
    });

    A2 = db.collection({
      name: 'a2',
      fields: [{ type: 'string', name: 'name' }],
    });

    Profile = db.collection({
      name: 'profiles',
      fields: [
        { type: 'integer', name: 'salary' },
        { type: 'belongsTo', name: 'user' },
        { type: 'string', name: 'description' },
      ],
    });

    Post = db.collection({
      name: 'posts',
      fields: [
        { type: 'string', name: 'title' },
        {
          type: 'belongsTo',
          name: 'user',
        },
        {
          type: 'hasMany',
          name: 'comments',
        },
        {
          type: 'belongsToMany',
          name: 'abc1',
          target: 'tags',
        },
      ],
    });

    Comment = db.collection({
      name: 'comments',
      fields: [
        { type: 'string', name: 'content' },
        { type: 'belongsTo', name: 'posts' },
      ],
    });

    Tag = db.collection({
      name: 'tags',
      fields: [
        {
          type: 'string',
          name: 'name',
        },
      ],
    });

    await db.sync();
    const repository = User.repository;

    await repository.createMany({
      records: [
        {
          name: 'u1',
          age: 10,
          posts: [{ title: 'u1t1', comments: [{ content: 'u1t1c1' }], abc1: [{ name: 't1' }] }],
          a1: [{ name: 'u1a11' }, { name: 'u1a12' }],
          a2: [{ name: 'u1a21' }, { name: 'u1a22' }],
          profile: { salary: 1000 },
        },
        {
          name: 'u2',
          age: 20,
          posts: [{ title: 'u2t1', comments: [{ content: 'u2t1c1' }] }],
          a1: [{ name: 'u2a11' }, { name: 'u2a12' }],
          a2: [{ name: 'u2a21' }, { name: 'u2a22' }],
          profile: { salary: 2000 },
        },
        {
          name: 'u3',
          age: 30,
          posts: [{ title: 'u3t1', comments: [{ content: 'u3t1c1' }] }],
          profile: { salary: 3000 },
        },
      ],
    });
  });

  it('should only output filed in fields args', async () => {
    const resp = await User.model.findOne({
      attributes: [],
      include: [
        {
          association: 'profile',
          attributes: ['salary'],
        },
      ],
    });

    const users = await User.repository.find({
      fields: ['profile', 'profile.salary', 'profile.id'],
    });

    const firstUser = users[0].toJSON();
    expect(Object.keys(firstUser)).toEqual(['profile']);
  });

  it('append with associations', async () => {
    const users = await User.repository.findAndCount({
      appends: ['posts', 'posts.comments'],
    });

    const user = users[0][0];
    // @ts-ignore
    expect(user.get('posts')[0].get('comments')).toBeDefined();
  });

  describe('findOne', () => {
    test('find one with attribute', async () => {
      const user = await User.repository.findOne({
        filter: {
          name: 'u2',
        },
      });
      expect(user['name']).toEqual('u2');
    });

    test('find one with relation', async () => {
      const user = await User.repository.findOne({
        filter: {
          'posts.title': 'u2t1',
        },
      });
      expect(user['name']).toEqual('u2');
    });

    test('find one with fields', async () => {
      const user = await User.repository.findOne({
        filter: {
          name: 'u2',
        },
        fields: ['id'],
        appends: ['posts'],
        except: ['posts.id'],
      });

      const data = user.toJSON();
      expect(Object.keys(data)).toEqual(['id', 'posts']);
      expect(Object.keys(data['posts'])).not.toContain('id');
    });
  });

  describe('find', () => {
    test('find with logic or', async () => {
      const users = await User.repository.findAndCount({
        filter: {
          $or: [{ 'posts.title': 'u1t1' }, { 'posts.title': 'u2t1' }],
        },
      });

      expect(users[1]).toEqual(2);
    });

    test('find with empty or', async () => {
      const usersCount = await User.repository.count({
        filter: {
          $or: [],
        },
      });

      expect(usersCount).toEqual(await User.repository.count());
    });

    test('find with fields', async () => {
      let user = await User.repository.findOne({
        fields: ['name'],
      });

      expect(user['name']).toBeDefined();
      expect(user['age']).toBeUndefined();
      expect(user['posts']).toBeUndefined();

      user = await User.repository.findOne({
        fields: ['name', 'posts'],
      });

      expect(user['posts']).toBeDefined();
    });

    describe('find with appends', () => {
      test('toJSON', async () => {
        const user = await User.repository.findOne({
          filter: {
            name: 'u1',
          },
          appends: ['a1', 'a2'],
        });

        const data = user.toJSON();

        expect(user['a1']).toBeDefined();
        expect(user['a2']).toBeDefined();
        expect(data['a1'][0].createdAt).toBeDefined();
        expect(data['a2'][0].createdAt).toBeDefined();
      });

      test('filter attribute', async () => {
        const user = await User.repository.findOne({
          filter: {
            name: 'u1',
          },
          appends: ['posts'],
        });

        expect(user['posts']).toBeDefined();
      });

      test('filter association attribute', async () => {
        const user2 = await User.repository.findOne({
          filter: {
            'posts.title': 'u1t1',
          },
          appends: ['posts'],
        });
        expect(user2['posts']).toBeDefined();
      });

      test('without appends', async () => {
        const user3 = await User.repository.findOne({
          filter: {
            'posts.title': 'u1t1',
          },
        });

        expect(user3['posts']).toBeUndefined();
      });
    });

    describe('find all', () => {
      test('without params', async () => {
        expect((await User.repository.find()).length).toEqual(3);
      });
      test('with limit', async () => {
        expect(
          (
            await User.repository.find({
              limit: 1,
            })
          ).length,
        ).toEqual(1);
      });
    });

    describe('find and count', () => {
      test('without params', async () => {
        expect((await User.repository.findAndCount())[1]).toEqual(3);
      });
    });

    test('find with filter', async () => {
      const results = await User.repository.find({
        filter: {
          name: 'u1',
        },
      });

      expect(results.length).toEqual(1);
    });

    test('find with association', async () => {
      const results = await User.repository.find({
        filter: {
          'posts.title': 'u1t1',
        },
      });

      expect(results.length).toEqual(1);
    });

    test('find with association with $and', async () => {
      const results = await Post.repository.find({
        filter: {
          'abc1.name': 't1',
        },
      });

      expect(results.length).toEqual(1);
    });
  });
});
