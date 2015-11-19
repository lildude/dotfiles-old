// Thanks @porada, https://github.com/porada/resizeend

(function (window) {
  var currentOrientation, debounce, dispatchResizeEndEvent, document, events, getCurrentOrientation, initialOrientation, resizeDebounceTimeout;
  document = window.document;
  if (!(window.addEventListener && document.createEvent)) {
    return;
  }
  events = ["resize:end", "resizeend"].map(function (name) {
    var event;
    event = document.createEvent("Event");
    event.initEvent(name, false, false);
    return event;
  });
  dispatchResizeEndEvent = function () {
    return events.forEach(window.dispatchEvent.bind(window));
  };
  getCurrentOrientation = function () {
    return Math.abs(+window.orientation || 0) % 180;
  };
  initialOrientation = getCurrentOrientation();
  currentOrientation = null;
  resizeDebounceTimeout = null;
  debounce = function () {
    currentOrientation = getCurrentOrientation();
    if (currentOrientation !== initialOrientation) {
      dispatchResizeEndEvent();
      return initialOrientation = currentOrientation;
    } else {
      clearTimeout(resizeDebounceTimeout);
      return resizeDebounceTimeout = setTimeout(dispatchResizeEndEvent, 100);
    }
  };
  return window.addEventListener("resize", debounce, false);
})(window);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9saWxkdWRlLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvdmVuZG9yL3Jlc2l6ZWVuZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLENBQUMsVUFBUyxNQUFNLEVBQUU7QUFDaEIsTUFBSSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsc0JBQXNCLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxxQkFBcUIsRUFBRSxrQkFBa0IsRUFBRSxxQkFBcUIsQ0FBQztBQUM3SSxVQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUMzQixNQUFJLEVBQUUsTUFBTSxDQUFDLGdCQUFnQixJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUEsQUFBQyxFQUFFO0FBQ3RELFdBQU87R0FDUjtBQUNELFFBQU0sR0FBRyxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBUyxJQUFJLEVBQUU7QUFDdEQsUUFBSSxLQUFLLENBQUM7QUFDVixTQUFLLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN0QyxTQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEMsV0FBTyxLQUFLLENBQUM7R0FDZCxDQUFDLENBQUM7QUFDSCx3QkFBc0IsR0FBRyxZQUFXO0FBQ2xDLFdBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0dBQzFELENBQUM7QUFDRix1QkFBcUIsR0FBRyxZQUFXO0FBQ2pDLFdBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0dBQ2pELENBQUM7QUFDRixvQkFBa0IsR0FBRyxxQkFBcUIsRUFBRSxDQUFDO0FBQzdDLG9CQUFrQixHQUFHLElBQUksQ0FBQztBQUMxQix1QkFBcUIsR0FBRyxJQUFJLENBQUM7QUFDN0IsVUFBUSxHQUFHLFlBQVc7QUFDcEIsc0JBQWtCLEdBQUcscUJBQXFCLEVBQUUsQ0FBQztBQUM3QyxRQUFJLGtCQUFrQixLQUFLLGtCQUFrQixFQUFFO0FBQzdDLDRCQUFzQixFQUFFLENBQUM7QUFDekIsYUFBTyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztLQUNoRCxNQUFNO0FBQ0wsa0JBQVksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ3BDLGFBQU8scUJBQXFCLEdBQUcsVUFBVSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ3hFO0dBQ0YsQ0FBQztBQUNGLFNBQU8sTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7Q0FDM0QsQ0FBQSxDQUFFLE1BQU0sQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9saWxkdWRlLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvdmVuZG9yL3Jlc2l6ZWVuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRoYW5rcyBAcG9yYWRhLCBodHRwczovL2dpdGh1Yi5jb20vcG9yYWRhL3Jlc2l6ZWVuZFxuXG4oZnVuY3Rpb24od2luZG93KSB7XG4gIHZhciBjdXJyZW50T3JpZW50YXRpb24sIGRlYm91bmNlLCBkaXNwYXRjaFJlc2l6ZUVuZEV2ZW50LCBkb2N1bWVudCwgZXZlbnRzLCBnZXRDdXJyZW50T3JpZW50YXRpb24sIGluaXRpYWxPcmllbnRhdGlvbiwgcmVzaXplRGVib3VuY2VUaW1lb3V0O1xuICBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcbiAgaWYgKCEod2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJiYgZG9jdW1lbnQuY3JlYXRlRXZlbnQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGV2ZW50cyA9IFsncmVzaXplOmVuZCcsICdyZXNpemVlbmQnXS5tYXAoZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBldmVudDtcbiAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgIGV2ZW50LmluaXRFdmVudChuYW1lLCBmYWxzZSwgZmFsc2UpO1xuICAgIHJldHVybiBldmVudDtcbiAgfSk7XG4gIGRpc3BhdGNoUmVzaXplRW5kRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZXZlbnRzLmZvckVhY2god2luZG93LmRpc3BhdGNoRXZlbnQuYmluZCh3aW5kb3cpKTtcbiAgfTtcbiAgZ2V0Q3VycmVudE9yaWVudGF0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE1hdGguYWJzKCt3aW5kb3cub3JpZW50YXRpb24gfHwgMCkgJSAxODA7XG4gIH07XG4gIGluaXRpYWxPcmllbnRhdGlvbiA9IGdldEN1cnJlbnRPcmllbnRhdGlvbigpO1xuICBjdXJyZW50T3JpZW50YXRpb24gPSBudWxsO1xuICByZXNpemVEZWJvdW5jZVRpbWVvdXQgPSBudWxsO1xuICBkZWJvdW5jZSA9IGZ1bmN0aW9uKCkge1xuICAgIGN1cnJlbnRPcmllbnRhdGlvbiA9IGdldEN1cnJlbnRPcmllbnRhdGlvbigpO1xuICAgIGlmIChjdXJyZW50T3JpZW50YXRpb24gIT09IGluaXRpYWxPcmllbnRhdGlvbikge1xuICAgICAgZGlzcGF0Y2hSZXNpemVFbmRFdmVudCgpO1xuICAgICAgcmV0dXJuIGluaXRpYWxPcmllbnRhdGlvbiA9IGN1cnJlbnRPcmllbnRhdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgY2xlYXJUaW1lb3V0KHJlc2l6ZURlYm91bmNlVGltZW91dCk7XG4gICAgICByZXR1cm4gcmVzaXplRGVib3VuY2VUaW1lb3V0ID0gc2V0VGltZW91dChkaXNwYXRjaFJlc2l6ZUVuZEV2ZW50LCAxMDApO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBkZWJvdW5jZSwgZmFsc2UpO1xufSkod2luZG93KTtcbiJdfQ==