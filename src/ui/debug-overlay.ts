import { IS_DEVELOPMENT } from "../configs/DEBUG_CONFIG";

export class DebugOverlay {
    private static instance: DebugOverlay;
    private container: HTMLDivElement;
    private logContainer: HTMLDivElement;
    private resizeHandle: HTMLDivElement;
    private showPayload = false;
    private isResizing = false;
    private startY = 0;
    private startHeight = 0;

    private constructor() {
        // Main container
        this.container = document.createElement("div");
        this.container.style.position = "absolute";
        this.container.style.top = "0";
        this.container.style.right = "0";
        this.container.style.width = "350px";
        this.container.style.height = "400px";
        this.container.style.background = "rgba(0, 0, 0, 0.8)";
        this.container.style.color = "lime";
        this.container.style.fontSize = "12px";
        this.container.style.fontFamily = "monospace";
        this.container.style.zIndex = "9999";
        this.container.style.padding = "4px 8px";
        this.container.style.boxShadow = "-2px 0 10px rgba(0,0,0,0.5)";
        this.container.style.userSelect = "none";
        this.container.style.display = "flex";
        this.container.style.flexDirection = "column";

        // Toggle & opacity controls
        const controlBar = document.createElement("div");
        controlBar.style.display = "flex";
        controlBar.style.alignItems = "center";
        controlBar.style.justifyContent = "space-between";
        controlBar.style.marginBottom = "6px";
        controlBar.style.flexShrink = "0";

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = this.showPayload;
        checkbox.id = "show-payload-checkbox";
        checkbox.addEventListener("change", () => {
            this.showPayload = checkbox.checked;
        });

        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.innerText = " Show Payloads";
        label.style.marginLeft = "4px";
        label.style.marginRight = "16px";

        const checkboxContainer = document.createElement("div");
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);

        // Opacity slider
        const opacityContainer = document.createElement("div");
        const opacityLabel = document.createElement("label");
        opacityLabel.innerText = "Opacity:";
        opacityLabel.style.marginRight = "4px";

        const opacitySlider = document.createElement("input");
        opacitySlider.type = "range";
        opacitySlider.min = "0.2";
        opacitySlider.max = "1";
        opacitySlider.step = "0.05";
        opacitySlider.value = "0.8";
        opacitySlider.addEventListener("input", () => {
            const val = parseFloat(opacitySlider.value);
            this.container.style.background = `rgba(0, 0, 0, ${val})`;
        });

        opacityContainer.appendChild(opacityLabel);
        opacityContainer.appendChild(opacitySlider);

        controlBar.appendChild(checkboxContainer);
        controlBar.appendChild(opacityContainer);

        // Log area
        this.logContainer = document.createElement("div");
        this.logContainer.style.flex = "1";
        this.logContainer.style.overflowY = "auto";
        this.logContainer.style.borderTop = "1px solid rgba(0,255,0,0.3)";
        this.logContainer.style.paddingTop = "4px";

        // Resize handle
        this.resizeHandle = document.createElement("div");
        this.resizeHandle.style.height = "6px";
        this.resizeHandle.style.cursor = "ns-resize";
        this.resizeHandle.style.background = "rgba(255,255,255,0.1)";
        this.resizeHandle.style.flexShrink = "0";
        this.resizeHandle.style.marginTop = "-6px";

        this.resizeHandle.addEventListener("mousedown", (e) =>
            this.onResizeStart(e)
        );
        document.addEventListener("mousemove", (e) => this.onResizeMove(e));
        document.addEventListener("mouseup", () => this.onResizeEnd());

        // Assemble
        this.container.appendChild(this.resizeHandle);
        this.container.appendChild(controlBar);
        this.container.appendChild(this.logContainer);
        if (IS_DEVELOPMENT) {
            document.body.appendChild(this.container);
        }

        // Add initial message
        this.addInitialMessage();
    }

    public static getInstance(): DebugOverlay {
        if (!DebugOverlay.instance) {
            DebugOverlay.instance = new DebugOverlay();
        }
        return DebugOverlay.instance;
    }

    private addInitialMessage() {
        const entry = document.createElement("div");
        entry.textContent = "Listening emitting events...";
        entry.style.color = "#00ff00";
        entry.style.fontWeight = "bold";
        entry.style.marginBottom = "4px";
        this.logContainer.appendChild(entry);
    }

    public log(message: string, data?: any) {
        const entry = document.createElement("div");
        entry.textContent =
            this.showPayload && data
                ? `${message}: ${JSON.stringify(data)}`
                : message;

        this.logContainer.appendChild(entry);
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }

    public clear() {
        this.logContainer.innerHTML = "";
        // Re-add initial message after clearing
        this.addInitialMessage();
    }

    private onResizeStart(e: MouseEvent) {
        this.isResizing = true;
        this.startY = e.clientY;
        this.startHeight = this.container.offsetHeight;
        e.preventDefault();
    }

    private onResizeMove(e: MouseEvent) {
        if (!this.isResizing) return;
        const dy = this.startY - e.clientY;
        const newHeight = Math.max(100, this.startHeight + dy);
        this.container.style.height = `${newHeight}px`;
    }

    private onResizeEnd() {
        this.isResizing = false;
    }
}

