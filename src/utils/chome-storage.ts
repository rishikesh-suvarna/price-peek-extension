export const saveFavoriteStocks = (key: string, stocks: string[]) => {
  chrome.storage.local.set({ [key]: stocks }, () => {
    console.info('Favorite stocks saved under key:', key, stocks);
  });
};

export const getFavoriteStocks = (key: string) => {
  if (chrome && chrome.storage) {
    chrome.storage.local.get(key, (result) => {
      const favoriteStocks = result.favoriteStocks || [];
      return favoriteStocks;
    });
  }
};