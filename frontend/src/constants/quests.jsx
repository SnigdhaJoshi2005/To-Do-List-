import { GiSpotedFlower } from "react-icons/gi";
import { TbSeedlingFilled, TbPlant2 } from "react-icons/tb";

export const DAILY_CAPS = { seedling: 3, sprout: 4, bloom: 3 };
export const WEEKLY_CAPS = { sprout: 6, bloom: 9 };
export const DIFF_LABEL = {
  seedling: <><TbSeedlingFilled className="inline text-[#80C779]" /> Seedling</>,
  sprout: <><TbPlant2 className="inline text-[#EE90F9]" /> Sprout</>,
  bloom: <><GiSpotedFlower className="inline text-[#FA8FD1]" /> Bloom</>,
};
