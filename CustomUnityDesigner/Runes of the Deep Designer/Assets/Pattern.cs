using Newtonsoft.Json;

public class Tile
{
    [JsonProperty("data")]
    public string Data { get; set; }
    
    [JsonProperty("door")]
    public DoorDirection? DoorDirection { get; set; }
}