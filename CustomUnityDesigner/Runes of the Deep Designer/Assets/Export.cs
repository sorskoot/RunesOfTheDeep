using System;
using UnityEngine;
using UnityEditor;
using UnityEngine.SceneManagement;
using System.Linq;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class Level
{
    [JsonProperty("width")]
    public int Width { get; set; }
    [JsonProperty("height")]
    public int Height { get; set; }
    [JsonProperty("cam")]
    public int Cam { get; set; }
    [JsonProperty("layer")]
    public Layer[] Layer { get; set; }
}

public class Layer
{
    [JsonProperty("data")]
    public string[,] Data { get; set; }
}

public static class Export
{
    [MenuItem(@"Sorskoot/Export")]
    public static void DoExport()
    {
        var level = SceneManager.GetActiveScene().GetRootGameObjects()
            .FirstOrDefault(d => d.name.Equals("Level"));
        var levelData = level.GetComponent<LevelData>();

        var exportedLevel = new Level()
        {
            Width = levelData.width,
            Height = levelData.height,
            Cam = levelData.cam,
            Layer = new Layer[level.transform.childCount]
        };

        for (int i = 0; i < level.transform.childCount; i++)
        {
            string[,] exportLevel = new string[levelData.width, levelData.height];

            for (int q = 0; q < levelData.width; q++)
            {
                for (int w = 0; w < levelData.height; w++)
                {
                    exportLevel[q, w] = "0";
                }
            }

            var layer = level.transform.GetChild(i);
            for (int j = 0; j < layer.transform.childCount; j++)
            {
                string name;
                var sprite = layer.GetChild(j);
                if (sprite.CompareTag("MainCamera"))
                {
                    name = "S";
                }
                else
                {
                    var renderer = sprite.GetComponent<SpriteRenderer>();

                    name = renderer.sprite.name;
                }

                var row = (int)Math.Round(sprite.transform.position.x);
                var col = -(int)Math.Round(sprite.transform.position.y);
                exportLevel[col, row] = name;
            }

            exportedLevel.Layer[i] = new Layer() { Data = exportLevel };
        }

        JObject jo = JObject.FromObject(exportedLevel);
        string result = jo.ToString(Formatting.None);
        result = result.Replace("\"0\"", "0");
        Debug.Log(result);
    }
}