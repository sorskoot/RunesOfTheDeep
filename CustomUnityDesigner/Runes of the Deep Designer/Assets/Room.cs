using Newtonsoft.Json;
using UnityEditor.Experimental.GraphView;

public class Room
{
    [JsonProperty("width")]
    public int Width { get; set; }
    [JsonProperty("height")]
    public int Height { get; set; }
    [JsonProperty("depth")]
    public int Depth { get; set; }

    [JsonProperty("data")]
    public Tile[,,] Pattern{ get; set; }

    [JsonProperty("start")]
    public RoomStart Start { get; set; }
}