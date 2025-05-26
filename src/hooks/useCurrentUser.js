import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((response) => response.json());

export const useCurrentUser = () => {
  const { data, error, mutate, isLoading } = useSWR('/api/users/me', fetcher);

  return {
    user: data?.data, 
    isLoading,
    isError: error,
    mutate,
  };
};
