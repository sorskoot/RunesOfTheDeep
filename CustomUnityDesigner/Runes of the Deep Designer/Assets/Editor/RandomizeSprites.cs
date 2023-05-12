using UnityEngine;
using System.Collections;
using UnityEditor;

public class RandomizeSprites : ScriptableWizard
{
    public Sprite[] SpritesToReplace;

    [MenuItem(@"Tools/Randomize Sprites")]
    public static void DoRandomizeSprites()
    {
        DisplayWizard<RandomizeSprites>("Replace Sprite", "Replace and close");
    }

    public void OnWizardCreate()
    {
        object[] z = Selection.GetFiltered(typeof(GameObject), SelectionMode.TopLevel | SelectionMode.ExcludePrefab);
        foreach (GameObject item in z)
        {
            var renderer = item.GetComponent<SpriteRenderer>();
            if (renderer != null)
            {
                Undo.RecordObject(renderer, "Replace Sprite");
                int i = (int)(Random.value * SpritesToReplace.Length);
                renderer.sprite = SpritesToReplace[i];
            }
        }

    }

    void OnWizardUpdate()
    {
        helpString = Selection.objects.Length + " objects randomized";
    }
}
