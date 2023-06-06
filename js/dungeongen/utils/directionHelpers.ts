import { DirectionSymbol } from "../../types/index.js";

/**
 * Inverts a direction
 * @param {DirectionSymbol} direction Direction to invert
 * @returns {DirectionSymbol} Inverted Direction
 */
export function getInvertedDirection(direction:DirectionSymbol):DirectionSymbol{
    switch(direction){
        case "N": return "S";
        case "S": return "N";
        case "E": return "W";
        case "W": return "E";
    }
}
