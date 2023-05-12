using UnityEngine;
using UnityEditor;
using System.Collections.Generic;
using System.Linq;

public class SelectBySprite : ScriptableWizard
{
    public Sprite SpriteToSelect;

    [MenuItem(@"Tools/Select By Sprite")]
    public static void SpriteSwapper()
    {
        DisplayWizard<SelectBySprite>("Select by sprite", "Select by sprite");
    }

    public void OnWizardCreate()
    {
        IEnumerable<GameObject> gameobjects = GameObject.FindObjectsOfType<GameObject>();
        if (gameobjects.Count() == 0) return;

        IEnumerable<GameObject> gameObjectsWithSprite =
            gameobjects.Where(x => x.GetComponent<SpriteRenderer>() != null
                              && x.GetComponent<SpriteRenderer>().sprite.name == SpriteToSelect.name);

        if (gameObjectsWithSprite.Count() > 0)
        {
            Selection.objects = gameObjectsWithSprite.ToArray();
            Debug.Log(string.Format("{0} objects with sprite selected...", gameObjectsWithSprite.Count()));
        }
        else
        {
            Debug.Log("No objects with " + SpriteToSelect.name + " sprites found...");
        }
    }

    void OnWizardUpdate()
    {
        helpString = Selection.objects.Length + " objects selected";
    }
}