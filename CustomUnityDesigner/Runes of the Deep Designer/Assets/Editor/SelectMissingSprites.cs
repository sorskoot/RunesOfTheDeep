using UnityEngine;
using UnityEditor;
using System.Linq;
using System.Collections.Generic;

public class SelectMissingSprites
{
    [MenuItem(@"Tools/Select Missing Sprites")]
    public static void DoSelectMissingSprites()
    {
        IEnumerable<GameObject> gameobjects = GameObject.FindObjectsOfType<GameObject>();
        if (gameobjects.Count() == 0) return;
        IEnumerable<GameObject> gameObjectsWithMissingSprite = 
            gameobjects.Where(x => x.GetComponent<SpriteRenderer>() != null 
                              && x.GetComponent<SpriteRenderer>().sprite == null);
        if (gameObjectsWithMissingSprite.Count() > 0)
        {
            Selection.objects = gameObjectsWithMissingSprite.ToArray();
            Debug.Log(string.Format("{0} objects with missing sprite selected...", gameObjectsWithMissingSprite.Count()));
        }
        else{
            Debug.Log("No objects with missing sprites found...");
        }
    }
}
