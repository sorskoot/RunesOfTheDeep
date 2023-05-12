using UnityEngine;
using UnityEditor;

public class ReplaceSprite : ScriptableWizard
{
    public Sprite SpriteToReplace;

    [MenuItem(@"Tools/Replace Sprite")]
    public static void SpriteSwapper()
    {
        DisplayWizard<ReplaceSprite>("Replace Sprite", "Replace and close");
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
                renderer.sprite = SpriteToReplace;
            }
        }
        
    }

    void OnWizardUpdate()
    {
        helpString = Selection.objects.Length + " objects selected";
    }
}
