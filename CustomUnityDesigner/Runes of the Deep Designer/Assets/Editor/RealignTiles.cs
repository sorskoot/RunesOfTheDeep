using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEditor;
using UnityEngine;

public class RealignTiles : ScriptableWizard
{
    [MenuItem(@"Tools/Realign Selection")]
    public static void Renamer()
    {
        DisplayWizard<RealignTiles>("Realign Selection", "Realign Selection");
    }
    
    private void OnWizardCreate()
    {
        List<GameObject> selection = Selection.GetFiltered(typeof(GameObject), SelectionMode.TopLevel | SelectionMode.ExcludePrefab)
                                              .Cast<GameObject>()
                                              .OrderBy(s => s.transform.GetSiblingIndex())
                                              .ToList();

        for (int i = 0; i < selection.Count(); i++)
        {
            Undo.RecordObject(selection[i].gameObject.transform, "Realign object");
            selection[i].gameObject.transform.position =
                new Vector3(
                    (float)Math.Floor(selection[i].gameObject.transform.position.x),
                    (float)Math.Floor(selection[i].gameObject.transform.position.y),
                    (float)Math.Floor(selection[i].gameObject.transform.position.z));
        }
    }
}
