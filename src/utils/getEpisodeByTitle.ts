export const getEpisodeByTitle = (title: string): number => {
  const episode = title.match(/E(\d+)/)?.[1];
  return +(episode ?? -1);
};
