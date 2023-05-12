using UnityEngine;
using UnityEditor;
using UnityEngine.SceneManagement;
using System.Linq;
using Newtonsoft.Json.Linq;

public static class Export
{
    [MenuItem(@"Sorskoot/Export")]
    public static void DoExport()
    {
        var room = SceneManager.GetActiveScene().GetRootGameObjects()
            .FirstOrDefault(d => d.CompareTag("Pattern"));

        if (room == null)
        {
            Debug.LogError("No level found");
            return;
        }



        // analyze current room to get the width, height and depth and min and max x,y,z

        // Get all gameobjects with TileDescriptor component
        var tiles = room.GetComponentsInChildren<TileDescriptor>();

        Vector3Int min = new Vector3Int(int.MaxValue, int.MaxValue, int.MaxValue);
        Vector3Int max = new Vector3Int(int.MinValue, int.MinValue, int.MinValue);

        foreach (var tile in tiles)
        {
            min = Vector3Int.Min(min, Vector3Int.FloorToInt(tile.transform.position));
            max = Vector3Int.Max(max, Vector3Int.CeilToInt(tile.transform.position));
        }

        var roomData = new RoomData
        {
            // calculate the width, height and depth
            width = max.x - min.x + 1,
            height = max.y - min.y + 1,
            depth = max.z - min.z + 1
        };



        var exportedLevel = new Room()
        {
            Width = roomData.width,
            Depth = roomData.depth,
            Height = roomData.height,
            Pattern = new Tile[roomData.width, roomData.height, roomData.depth]
        };

        // Loop through all tiles
        foreach (var tile in tiles)
        {
            var tilepos = tile.transform.position;
            // make the tilepos relative to the min
            var tileOffset = tilepos - min;
            Debug.Log(tileOffset);

            // add tile to the pattern
            exportedLevel.Pattern[(int)(tilepos.x+ tileOffset.x), (int)(tilepos.y + tileOffset.y), (int)(tilepos.z + tileOffset.z)] = new Tile()
            {
                Data = tile.WonderlandName
            };

        }



        //for (int i = 0; i < level.transform.childCount; i++)
        //{
        //    string[,] exportLevel = new string[levelData.width, levelData.height];

        //    for (int q = 0; q < levelData.width; q++)
        //    {
        //        for (int w = 0; w < levelData.height; w++)
        //        {
        //            exportLevel[q, w] = "0";
        //        }
        //    }

        //    var layer = level.transform.GetChild(i);
        //    for (int j = 0; j < layer.transform.childCount; j++)
        //    {
        //        string name;
        //        var sprite = layer.GetChild(j);
        //        if (sprite.CompareTag("MainCamera"))
        //        {
        //            name = "S";
        //        }
        //        else
        //        {
        //            var renderer = sprite.GetComponent<SpriteRenderer>();

        //            name = renderer.sprite.name;
        //        }

        //        var row = (int)Math.Round(sprite.transform.position.x);
        //        var col = -(int)Math.Round(sprite.transform.position.y);
        //        exportLevel[col, row] = name;
        //    }


        //}

        //JObject jo = JObject.FromObject(exportedLevel);
        //string result = jo.ToString(Formatting.None);
        //result = result.Replace("\"0\"", "0");
        //Debug.Log(result);
    }
}