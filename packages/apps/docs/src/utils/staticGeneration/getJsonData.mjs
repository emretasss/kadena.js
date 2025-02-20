import authorData from '../../data/authors.json' assert { type: 'json' };

export const getAuthorData = () => {
  return authorData;
};

const PostsPerTag = (tag, data) => {
  if (!data) return { count: 0, links: [] };

  const links = data.filter((post) => post.tags?.includes(tag));

  return {
    count: links.length,
    links: links.slice(0, 3),
  };
};

export const getTagsData = async () => {
  const STARTBRANCH = '/blogchain';
  const { menuData: data } = await import('./../../_generated/menu.mjs');

  const startBranch = data.find((item) => item.root === STARTBRANCH);

  const posts = startBranch?.children.flatMap((item) => {
    return item.children;
  });

  return [...new Set(posts?.map((post) => post.tags ?? []).flat() ?? [])]
    .sort()
    .map((tag) => {
      return {
        tag,
        ...PostsPerTag(tag, posts),
      };
    });
};
