import { create } from "zustand";

/* ---------------- TYPES ---------------- */

export type SkinCategory =
  | "all"
  | "legend"
  | "grand"
  | "exquisite"
  | "deluxe"
  | "exceptional"
  | "common";


export type HeroImageShape = "square" | "rect";

export type MainHeroImage = {
  src: string;
  shape: HeroImageShape;
};

export type TagImages = {
  diamond?: string;
  coa?: string;
  core?: string;
};

type Store = {
  /* -------- GRID -------- */
  selectedSkins: string[];
  columns: number;

  /* -------- BASE -------- */
  profileImage: string | null;

  /* -------- LEFT -------- */
  collectionImage: string | null;
  weeklyImage: string | null;

  /* -------- RIGHT -------- */
  doubleDiamondImage: string | null;
  fullSetImages: string[]; // max 2
  mainHeroImages: MainHeroImage[];

  /* -------- OVERLAYS -------- */
  tagImages: TagImages;
  miscImages: string[];

  /* -------- FILTER -------- */
  activeCategory: SkinCategory;
  selectedHero: string;
  searchQuery: string;

  /* -------- ACTIONS -------- */
  setColumns: (n: number) => void;
  toggleSkin: (id: string) => void;

  setProfileImage: (img: string | null) => void;

  setCollectionImage: (img: string | null) => void;
  setWeeklyImage: (img: string | null) => void;

  setDoubleDiamondImage: (img: string | null) => void;

  addFullSetImage: (img: string) => void;
  removeFullSetImage: (index: number) => void;

  addMainHeroImage: (img: string, shape: HeroImageShape) => void;
  removeMainHeroImage: (index: number) => void;

  setTagImage: (key: keyof TagImages, img: string | null) => void;

  addMiscImage: (img: string) => void;
  removeMiscImage: (index: number) => void;

  setCategory: (cat: SkinCategory) => void;
  setSelectedHero: (hero: string) => void;
  setSearchQuery: (query: string) => void;
  reorderSkins: (skinIds: string[]) => void;
  batchSelect: (ids: string[], select: boolean) => void;
};

/* ---------------- STORE ---------------- */

export const useStore = create<Store>((set) => ({
  /* -------- STATE -------- */

  selectedSkins: [],
  columns: 5,

  profileImage: null,

  collectionImage: null,
  weeklyImage: null,

  doubleDiamondImage: null,
  fullSetImages: [],
  mainHeroImages: [],

  tagImages: {},
  miscImages: [],

  activeCategory: "all",
  selectedHero: "all",
  searchQuery: "",

  /* -------- ACTIONS -------- */

  toggleSkin: (id) =>
    set((s) => ({
      selectedSkins: s.selectedSkins.includes(id)
        ? s.selectedSkins.filter((x) => x !== id)
        : [...s.selectedSkins, id],
    })),

  setColumns: (columns) => set({ columns }),

  setProfileImage: (profileImage) => set({ profileImage }),

  setCollectionImage: (collectionImage) =>
    set({ collectionImage }),

  setWeeklyImage: (weeklyImage) =>
    set({ weeklyImage }),

  setDoubleDiamondImage: (doubleDiamondImage) =>
    set({ doubleDiamondImage }),

  addFullSetImage: (img) =>
    set((s) =>
      s.fullSetImages.length < 2
        ? { fullSetImages: [...s.fullSetImages, img] }
        : s
    ),

  removeFullSetImage: (index) =>
    set((s) => ({
      fullSetImages: s.fullSetImages.filter(
        (_, i) => i !== index
      ),
    })),

  addMainHeroImage: (src, shape) =>
    set((s) => ({
      mainHeroImages: [
        ...s.mainHeroImages,
        { src, shape },
      ],
    })),

  removeMainHeroImage: (index) =>
    set((s) => ({
      mainHeroImages: s.mainHeroImages.filter(
        (_, i) => i !== index
      ),
    })),

  setTagImage: (key, img) =>
    set((s) => ({
      tagImages: {
        ...s.tagImages,
        [key]: img || undefined,
      },
    })),

  addMiscImage: (img) =>
    set((s) =>
      s.miscImages.length < 5
        ? { miscImages: [...s.miscImages, img] }
        : s
    ),

  removeMiscImage: (index) =>
    set((s) => ({
      miscImages: s.miscImages.filter(
        (_, i) => i !== index
      ),
    })),

  setCategory: (activeCategory) => set({ activeCategory, selectedHero: "all" }), // reset hero on category change
  setSelectedHero: (selectedHero) => set({ selectedHero }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  reorderSkins: (selectedSkins) => set({ selectedSkins }),
  batchSelect: (ids, select) =>
    set((s) => ({
      selectedSkins: select
        ? Array.from(new Set([...s.selectedSkins, ...ids]))
        : s.selectedSkins.filter((id) => !ids.includes(id)),
    })),
}));
