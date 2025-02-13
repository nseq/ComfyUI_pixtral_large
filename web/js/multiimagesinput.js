import { app } from "/scripts/app.js";

app.registerExtension({
    name: "ComfyUI/Pixtral Vision.MultiImagesInput",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name === "MultiImagesInput") {
            nodeType.prototype.onNodeCreated = function () {
                this.addWidget("button", "Update inputs", null, () => {
                    this.updateInputs();
                });
                
                // Add input type selector widget
                this.addWidget("combo", "Input Type", "image", () => {
                    this.updateInputs();
                }, { values: ["image", "text", "both"] });
            };

            nodeType.prototype.updateInputs = function () {
                const targetNumberOfInputs = this.widgets.find(
                    (w) => w.name === "inputcount"
                ).value;
                
                const inputType = this.widgets.find(
                    (w) => w.name === "Input Type"
                ).value;

                // Remove all existing inputs
                while (this.inputs.length > 0) {
                    this.removeInput(this.inputs.length - 1);
                }

                // Add new inputs based on selected type
                for (let i = 1; i <= targetNumberOfInputs; i++) {
                    if (inputType === "image" || inputType === "both") {
                        this.addInput(`image_${i}`, "IMAGE");
                    }
                    if (inputType === "text" || inputType === "both") {
                        this.addInput(`text_${i}`, "STRING");
                    }
                }

                // Trigger a node size recalculation
                this.size = this.computeSize();
                this.setDirtyCanvas(true, true);
            };

            // Override the onConnectionsChange method
            const onConnectionsChange = nodeType.prototype.onConnectionsChange;
            nodeType.prototype.onConnectionsChange = function (type, index, connected, link_info) {
                if (onConnectionsChange) {
                    onConnectionsChange.apply(this, arguments);
                }
                this.updateInputs();
            };
        }
    }
});
