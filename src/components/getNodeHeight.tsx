export const getNodeHeight=(text: string, fixedWidth: number = 100, fontSize: number = 14, lineHeight: number = 1.5): number => {
    // Create a temporary canvas element to measure text width
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (context) {
      context.font = `${fontSize}px Arial`; // Set the font style to match your UI

      // Calculate the width of the text
      const words = text.split(' ');
      let currentLine = '';
      let lineCount = 0;

      for (let word of words) {
        const testLine = currentLine + word + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > fixedWidth && lineCount > 0) {
          lineCount++; // Increment line count and reset currentLine
          currentLine = word + ' '; // Start new line with the current word
        } else {
          currentLine = testLine; // Add word to the current line
        }
      }

      // Count the last line if it contains text
      if (currentLine) {
        lineCount++;
      }

      // Calculate the total height based on line count and line height
      const totalHeight = lineCount * (fontSize * lineHeight);

      return totalHeight; // Return the total height required for the node
    }

    return 0; // Return 0 if the context is not available
  }