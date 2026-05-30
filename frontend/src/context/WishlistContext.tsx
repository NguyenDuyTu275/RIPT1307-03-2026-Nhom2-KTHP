import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistContextType {
  wishlist: number[];
  addWish: (id: number | string) => void;
  removeWish: (id: number | string) => void;
  toggleWish: (id: number | string) => void;
  clearAll: () => void;
  isInWishlist: (id: number | string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem('wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addWish = (id: number | string) => {
    const numericId = Number(id);
    if (!isNaN(numericId)) {
      setWishlist((prev) => Array.from(new Set([...prev, numericId])));
    }
  };

  const removeWish = (id: number | string) => {
    const numericId = Number(id);
    setWishlist((prev) => prev.filter((w) => w !== numericId));
  };

  const toggleWish = (id: number | string) => {
    if (isInWishlist(id)) {
      removeWish(id);
    } else {
      addWish(id);
    }
  };

  const clearAll = () => {
    setWishlist([]);
  };

  const isInWishlist = (id: number | string) => {
    return wishlist.includes(Number(id));
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addWish, removeWish, toggleWish, clearAll, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
