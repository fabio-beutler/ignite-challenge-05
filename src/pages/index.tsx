import { GetStaticProps } from 'next';

import { FiCalendar, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import NextLink from 'next/link';
import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { formatDate } from '../utils/formatDate';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({
  postsPagination: data,
}: HomeProps): JSX.Element {
  const [postsPagination, setPostsPagination] = useState(data);

  async function loadMorePosts(): Promise<void> {
    fetch(postsPagination.next_page)
      .then(response => response.json())
      .then(response => {
        setPostsPagination({
          next_page: response.next_page,
          results: [...postsPagination.results, ...response.results],
        });
      });
  }
  return (
    <main className={`${styles.main} ${commonStyles.container}`}>
      <img src="/images/Logo.svg" alt="Logo" />
      <section className={styles.posts}>
        {postsPagination.results.map(post => (
          <div key={post.uid} className={styles.post}>
            <NextLink href={`/post/${post.uid}`}>
              <a>
                <h1>{post.data.title}</h1>
              </a>
            </NextLink>
            <p>{post.data.subtitle}</p>
            <div className={styles.postInfo}>
              <span>
                <FiCalendar />
                {formatDate(post.first_publication_date)}
              </span>
              <span>
                <FiUser />
                {post.data.author}
              </span>
            </div>
          </div>
        ))}
      </section>
      {postsPagination.next_page && (
        <button
          type="button"
          className={commonStyles.link}
          onClick={loadMorePosts}
        >
          Carregar mais posts
        </button>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 1,
    }
  );

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results,
  };

  return {
    props: { postsPagination },
  };
};
