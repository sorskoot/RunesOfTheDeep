using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using UnityEngine.SceneManagement;
using Newtonsoft.Json;
using System.IO;

public static class Export
{
    [MenuItem(@"Sorskoot/Export")]
    public static void DoExport()
    {
        var rooms = SceneManager.GetActiveScene()
            .GetRootGameObjects();
        
        var exportedLevels = new List<Room>();

        foreach (var room in rooms)
        {

            var descriptor = room.GetComponent<RoomDescriptor>();
            if (descriptor == null)
            {
                Debug.LogError("Room " + room.name + " has no RoomDescriptor");
                continue;
            }


            var cam = room.GetComponentInChildren<Camera>();

            // analyze current room to get the width, height and depth and min and max x,y,z

            // Get all gameobjects with TileDescriptor component
            var tiles = room.GetComponentsInChildren<TileDescriptor>();

            Vector3Int min = new Vector3Int(int.MaxValue, int.MaxValue, int.MaxValue);
            Vector3Int max = new Vector3Int(int.MinValue, int.MinValue, int.MinValue);

            foreach (var tile in tiles)
            {
                min = Vector3Int.Min(min, Vector3Int.FloorToInt(tile.transform.position));
                max = Vector3Int.Max(max, Vector3Int.FloorToInt(tile.transform.position));
            }

            var roomData = new RoomData
            {
                // calculate the width, height and depth
                width = max.x - min.x + 1,
                height = max.y - min.y + 1,
                depth = max.z - min.z + 1
            };

            var exportedLevel = new Room();
            exportedLevel.Width = roomData.width;
            exportedLevel.Depth = roomData.depth;
            exportedLevel.Height = roomData.height;

            if (cam != null)
            {
                exportedLevel.Start = new RoomStart();
                exportedLevel.Start.X = cam.transform.position.x - min.x;
                exportedLevel.Start.Y = cam.transform.position.y - min.y;
                exportedLevel.Start.Z = cam.transform.position.z - min.z;
                exportedLevel.Start.Rx = cam.transform.rotation.eulerAngles.x;
                exportedLevel.Start.Ry = cam.transform.rotation.eulerAngles.y;
                exportedLevel.Start.Rz = cam.transform.rotation.eulerAngles.z;
            }

            exportedLevel.Pattern = new Tile[roomData.width, roomData.height, roomData.depth];

            // Loop through all tiles
            foreach (var tile in tiles)
            {
                var tilepos = tile.transform.position;
                // make the tilepos relative to the min
                var tileOffset = tilepos - min;

                // add tile to the pattern
                exportedLevel.Pattern[(int)(tileOffset.x), (int)(tileOffset.y), (int)(tileOffset.z)] = new Tile()
                {
                    Data = tile.WonderlandName,
                    DoorDirection = tile.IsDoor ? tile.DoorDirection : null
                };

                exportedLevels.Add(exportedLevel);
            }
        }

        JsonSerializerSettings settings = new JsonSerializerSettings
        {
            NullValueHandling = NullValueHandling.Ignore,
            DefaultValueHandling = DefaultValueHandling.Ignore,
            Formatting = Formatting.None
        };

        string jsonResult = JsonConvert.SerializeObject(exportedLevels, settings);
        
        WriteTextToFile(jsonResult);
        //Debug.Log(result);
    }

    
    static void WriteTextToFile(string textToWrite)
    {   string filePath = Path.Combine(Application.dataPath, "level.txt");
        File.WriteAllText(filePath, textToWrite);
        Debug.Log("File written at: " + filePath);
    }
}