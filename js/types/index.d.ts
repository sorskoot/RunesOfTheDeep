import { Material } from "@wonderlandengine/api";

type RoomType = 'entrance' | 'exit' | 'treasure' | 'normal';

type DirectionSymbol = 'N' | 'E' | 'S' | 'W';

interface FlatMaterial extends Material{
    color: number[];
}