using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public enum RoomType
{
    Entrance,
    TheShattering,
    Regular,
    Treasure

}
public class RoomDescriptor : MonoBehaviour
{
   public RoomType RoomType;
}
