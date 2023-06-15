import { Position2D } from "../../types/position.js";

export interface Item {
    id: number;
    name: string;
    rarity: "common"|"rare"|"epic"|"legendary";
    position: Position2D;
}