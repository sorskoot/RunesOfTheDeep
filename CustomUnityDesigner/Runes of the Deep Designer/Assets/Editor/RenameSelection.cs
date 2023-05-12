using UnityEngine;
using System.Collections;
using UnityEditor;
using System.Linq;
using System.Collections.Generic;

public class RenameSelection : ScriptableWizard
{
    public string NewName;

    [MenuItem(@"Tools/Rename Selection")]
    public static void Renamer()
    {
        DisplayWizard<RenameSelection>("Rename Selection", "Rename Selection");
    }


    private void OnWizardCreate()
    {
        List<GameObject> selection = Selection.GetFiltered(typeof(GameObject), SelectionMode.TopLevel | SelectionMode.ExcludePrefab)
                                              .Cast<GameObject>()
                                              .OrderBy(s => s.transform.GetSiblingIndex())
                                              .ToList();

        for (int i = 0; i < selection.Count(); i++)
        {
            Undo.RecordObject(selection[i], "Rename object");
            selection[i].name = string.Format("{0} ({1})", NewName, i + 1);
        }
    }
}
