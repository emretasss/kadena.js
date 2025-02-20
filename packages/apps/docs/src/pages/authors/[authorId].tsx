import { BlogListWrapper } from '@/components/BlogList/BlogListWrapper';
import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '@/components/Layout/components/articleStyles.css';
import { TitleHeader } from '@/components/Layout/components/TitleHeader/TitleHeader';
import authors from '@/data/authors.json';
import { getAuthorInfo, getInitBlogPosts } from '@/hooks/useGetBlogs/utils';
import type { IAuthorInfo, IMenuData, IPageProps } from '@/Layout';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import { getData } from '@/utils/staticGeneration/getData.mjs';
import classNames from 'classnames';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { FC } from 'react';
import React from 'react';

interface IProps extends IPageProps {
  posts: IMenuData[];
  authorInfo?: IAuthorInfo;
}

const Home: FC<IProps> = ({ posts, authorInfo }) => {
  if (!authorInfo) return null;

  return (
    <>
      <TitleHeader
        title={authorInfo.name}
        subTitle={authorInfo.description}
        avatar={authorInfo.avatar}
      />
      <div
        className={classNames(contentClass, contentClassVariants.home)}
        id="maincontent"
      >
        <article className={articleClass}>
          <BlogListWrapper authorId={authorInfo.id} initPosts={posts} />
        </article>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: authors.map((author: IAuthorInfo) => ({
      params: { authorId: author.id },
    })),
    fallback: false, // false or "blocking"
  };
};

export const getStaticProps: GetStaticProps<{}, { authorId: string }> = async (
  ctx,
) => {
  const authorId = ctx.params?.authorId;
  const authorInfo = getAuthorInfo(authorId);

  const posts = getInitBlogPosts(getData() as IMenuData[], 0, 10, { authorId });

  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      posts,
      authorInfo,
      frontmatter: {
        title: authorInfo?.name ?? '',
        menu: authorInfo?.name ?? '',
        label: authorInfo?.name ?? '',
        order: 0,
        description: 'who is writing our blogchain posts?',
        layout: 'home',
      },
    },
  };
};

export default Home;
