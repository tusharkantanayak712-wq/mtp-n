import type { SkinItem } from "./types";
import { luckyboxSkins } from "./exquisite/luckybox";
import { annualstarSkins } from "./exquisite/annualstar";
import { collectorSkins } from "./exquisite/collector";
import { cloudsSkins } from "./exquisite/clouds";

export const exquisiteSkins: SkinItem[] = [
  ...luckyboxSkins,
  ...annualstarSkins,
  ...collectorSkins,
  ...cloudsSkins,
];
