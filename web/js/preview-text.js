import { app } from "../../../scripts/app.js";
import { ComfyWidgets } from "../../../scripts/widgets.js";

app.registerExtension({
  name: "Comfy.PixtralVision.PreviewText",
  async beforeRegisterNodeDef(nodeType, nodeData, app) {
    if (nodeData.name === "preview_text") {
      // Add custom widget
      const onNodeCreated = nodeType.prototype.onNodeCreated;
      nodeType.prototype.onNodeCreated = function () {
        const r = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined;

        // Add a text widget for preview
        const widget = ComfyWidgets.STRING(this, "display_text", ["STRING", { 
          multiline: true,
          default: "Preview will appear here..."
        }], app);
        
        // Style the text input
        widget.widget.inputEl.readOnly = true;
        widget.widget.inputEl.style.cssText = `
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          padding: 8px;
          line-height: 1.4;
          font-family: monospace;
          min-height: 100px;
          max-height: 400px;
          overflow-y: auto;
          white-space: pre-wrap;
          word-wrap: break-word;
          background-color: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        `;

        return r;
      };

      // Handle node execution
      const onExecuted = nodeType.prototype.onExecuted;
      nodeType.prototype.onExecuted = function (message) {
        onExecuted?.apply(this, arguments);
        const text = message.text;
        
        // Find the display widget
        const widget = this.widgets.find((w) => w.name === "display_text");
        if (widget) {
          if (Array.isArray(text)) {
            widget.value = text.join("\n\n");
          } else if (text !== undefined && text !== null) {
            widget.value = text.toString();
          } else {
            widget.value = "No text received";
          }
        }

        // Resize node with debounce
        if (this.resizeTimeout) {
          clearTimeout(this.resizeTimeout);
        }
        
        this.resizeTimeout = setTimeout(() => {
          const sz = this.computeSize();
          if (sz[0] < this.size[0]) sz[0] = this.size[0];
          if (sz[1] < this.size[1]) sz[1] = this.size[1];
          this.onResize?.(sz);
          app.graph.setDirtyCanvas(true, false);
        }, 100);
      };

      // Add method to compute size
      nodeType.prototype.computeSize = function() {
        const widget = this.widgets.find((w) => w.name === "display_text");
        const minWidth = 300;
        const minHeight = 150;
        const width = Math.max(minWidth, widget?.value?.length * 8 || minWidth);
        const height = Math.max(minHeight, (widget?.value?.split('\n').length || 1) * 20 + 40);
        return [Math.min(width, 600), Math.min(height, 500)];
      };

      // Clean up on removal
      const onRemoved = nodeType.prototype.onRemoved;
      nodeType.prototype.onRemoved = function() {
        if (this.resizeTimeout) {
          clearTimeout(this.resizeTimeout);
        }
        onRemoved?.apply(this, arguments);
      };
    }
  },
});
