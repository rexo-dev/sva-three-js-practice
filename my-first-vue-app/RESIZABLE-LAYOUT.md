# Resizable Layout Feature

## What's New

The three.js tutorial app now has a **resizable split-panel layout** with optimized spacing!

## Features

### 1. Resizable Canvas/Guide Split
- **Drag the divider** between the canvas and guide to resize
- The divider appears as a gray bar (6px wide)
- **Hover**: Divider turns green (#42b883)
- **Active dragging**: Stays green while resizing
- **Constraints**: Canvas can be between 20% and 80% of the width
- **Default split**: 35% canvas, 65% guide (better for reading)

### 2. Compact Navigation
- **Reduced width**: 250px → 180px (saves 70px)
- **Smaller padding and fonts** for better fit
- More space for the main content area
- Still fully functional with all chapters visible

### 3. Optimized Default Layout
- **Navigation**: 180px (left sidebar)
- **Canvas**: 35% of remaining space (~400px on 1920px screen)
- **Guide**: 65% of remaining space (~750px on 1920px screen)
- Guide now has much more room for comfortable reading!

## How to Use

### Resizing the Split
1. Hover over the **gray divider** between canvas and guide
2. When it turns **green**, click and hold
3. **Drag left or right** to adjust sizes
4. Release to set the new sizes
5. Sizes are maintained as you navigate between chapters

### Mobile Responsive
- On screens < 768px, the layout automatically switches to **vertical stacking**
- Canvas on top (50% height)
- Guide on bottom (50% height)
- Resizer is hidden on mobile

## Technical Details

### ChapterLayout Component
- Uses Vue 3 Composition API with reactive refs
- `canvasWidth` and `guideWidth` stored as percentages
- Mouse events for drag functionality
- Automatic cleanup of event listeners on unmount

### Resizer Element
- 6px wide draggable divider
- Visual feedback on hover and drag
- Extended hit area (±3px) for easier grabbing
- CSS transitions for smooth color changes

### Navigation Component
- Reduced from 250px to 180px
- Optimized font sizes (1rem title, 0.8rem items)
- Smaller padding (0.75rem → 0.5rem)
- Tighter spacing between items

## Benefits

✅ **Better Reading Experience**: Guide gets 65% width by default
✅ **Flexible Layout**: Adjust to your preference anytime
✅ **More Screen Real Estate**: Compact navigation saves space
✅ **Visual Feedback**: Green highlight shows when resizing
✅ **Persistent**: Sizes stay the same across chapter navigation
✅ **Mobile Friendly**: Automatically adapts for small screens

## Future Enhancements

Possible improvements:
- Save resize preference to localStorage
- Add collapse/expand buttons for navigation
- Add full-screen mode for canvas
- Keyboard shortcuts for quick resize presets
- Double-click divider to reset to default
