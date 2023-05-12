using UnityEngine;

public enum DoorDirection
{
    North,
    East,
    South,
    West
}
public class TileDescriptor : MonoBehaviour
{
    public string WonderlandName;
    public bool IsDoor;
    public DoorDirection DoorDirection;
}
