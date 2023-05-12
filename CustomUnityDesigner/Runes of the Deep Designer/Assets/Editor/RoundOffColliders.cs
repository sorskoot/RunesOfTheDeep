using UnityEngine;
using UnityEditor;
using System.Linq;
using System.Collections.Generic;

public class RoundColliders
{
    [MenuItem(@"Tools/Round colliders")]
    public static void Round()
    {
        List<GameObject> selection =
            Selection.GetFiltered(typeof(GameObject), SelectionMode.TopLevel | SelectionMode.ExcludePrefab)
                     .Cast<GameObject>()
                     .ToList();
        
        foreach (GameObject item in selection)
        {
            List<PolygonCollider2D> Colliders = item.GetComponents<PolygonCollider2D>().ToList();

            if (Colliders == null && Colliders.Count() < 0)
            {
                continue;
            }
            Undo.RecordObject(item, "Round colliders");
            foreach (PolygonCollider2D collider in Colliders)
            {
                var pointlist = new List<Vector2>();

                for (int i = 0; i < collider.points.Count(); i++)
                {
                    pointlist.Add(new Vector2(
                        collider.points[i].x.RoundToHalf(), 
                        collider.points[i].y.RoundToHalf()));
                }
                collider.points = pointlist.ToArray();
            }
        }
    }
   
}
