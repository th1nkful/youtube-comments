import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

import NoVideo from '../components/NoVideo';
import Video from '../components/Video';
import getVideoDetails from '../lib/youtube';

import '../styles/Home.module.scss';

export default function Home({ video }: any) {
  return (
    <div className="has-background-light full-height">
      <Head>
        <title>YouTube Comments</title>
        <meta name="description" content="Sometimes you just want to copy and paste a comment" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="navbar is-danger" role="navigation" aria-label="main navigation">
        <div className="container">
          <div className="navbar-brand">
            <Link className="navbar-item" href="/">
              <FontAwesomeIcon icon={faComments} />
              <span className="ml-2">YouTube Comments</span>
            </Link>
          </div>
        </div>
      </nav>
      <main className="section">
        {video ? <Video video={video} /> : <NoVideo />}
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<{ video?: object }> = async ({ query }) => {
  if (!query.url) {
    return { props: {} };
  }

  const queryUrl = query.url as string;
  const video = await getVideoDetails(queryUrl);
  return { props: { video } };
};
