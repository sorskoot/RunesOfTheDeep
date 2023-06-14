export interface Item {
    id: number;
    name: string;
    rarity: "common"|"rare"|"epic"|"legendary";
    position?: {x:number, y:number};
}