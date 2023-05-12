using UnityEngine;
using UnityEditor;
using System.Linq;
using System.Collections.Generic;

public class GroupInto
{
    [MenuItem(@"Tools/Group Into")]
    public static void Group()
    {
        IEnumerable<GameObject> selection = Selection.GetFiltered(typeof(GameObject), SelectionMode.TopLevel | SelectionMode.ExcludePrefab).Cast<GameObject>();

        if (!selection.Any()){
            return;
        }
        GameObject parent = null;

        if (selection.First().transform.parent != null) {
            parent = selection.First().transform.parent.gameObject;
        }

        var obj = new GameObject();
        if (parent != null)
        {
            obj.transform.parent = parent.transform;
        }
       
        foreach (GameObject item in selection)
        {
            item.transform.parent = obj.transform;
        }

        Debug.Log("Group "+ selection.Count() + " objects into one");
    }
}
