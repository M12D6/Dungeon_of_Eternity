using UnityEngine;
using UnityEngine.EventSystems;

namespace DungeonOfEternity.UI
{
    /// <summary>
    /// Drop this on a Button (or any UI element) to give it a subtle scale-up
    /// on hover and a quick push-in on press. No animations needed.
    /// </summary>
    [RequireComponent(typeof(RectTransform))]
    public class HoverScale : MonoBehaviour,
        IPointerEnterHandler, IPointerExitHandler,
        IPointerDownHandler,  IPointerUpHandler
    {
        public float HoverScaleFactor  = 1.04f;
        public float PressedScaleFactor = 0.97f;
        public float Speed = 14f;

        Vector3 _baseScale;
        Vector3 _targetScale;

        void Awake()
        {
            _baseScale = transform.localScale;
            if (_baseScale == Vector3.zero) _baseScale = Vector3.one;
            _targetScale = _baseScale;
        }

        void OnDisable()
        {
            transform.localScale = _baseScale;
            _targetScale = _baseScale;
        }

        void Update()
        {
            transform.localScale = Vector3.Lerp(
                transform.localScale, _targetScale, Time.unscaledDeltaTime * Speed);
        }

        public void OnPointerEnter(PointerEventData e) => _targetScale = _baseScale * HoverScaleFactor;
        public void OnPointerExit (PointerEventData e) => _targetScale = _baseScale;
        public void OnPointerDown (PointerEventData e) => _targetScale = _baseScale * PressedScaleFactor;
        public void OnPointerUp   (PointerEventData e) => _targetScale = _baseScale * HoverScaleFactor;
    }
}
