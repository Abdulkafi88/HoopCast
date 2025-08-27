export const gameDetailsFrom = (game, userId, docId) => ({
  season: game.season,
  uid: game.uid,
  userId,
  docId,
});

export const transformGames = (arr) =>
  arr.map(({ game, userId, docId }) => ({
    name: game.name,
    competitions: game.competitions,
    links: game.links,
    status: game.status,
    shortName: game.shortName,
    userId,
    date: game.date,
    id: game.id,
    season: game.season,
    uid: game.uid,
    docId,
  }));