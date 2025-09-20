/**
 * Hidden server-rendered page to ensure Vercel detects at least one
 * serverless page when deploying the App Router site. Vercel's legacy
 * detection expects a non-API entry in the pages manifest; without it the
 * build fails with "No serverless pages were built" even though App Router
 * route handlers exist. The page always responds with 404 so it stays
 * inaccessible to end users.
 */
import type { GetServerSideProps, NextPage } from 'next';

const VercelServerProbePage: NextPage = () => null;

export const getServerSideProps: GetServerSideProps = async () => {
  return { notFound: true };
};

export default VercelServerProbePage;
