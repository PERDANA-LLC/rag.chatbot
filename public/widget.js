
(function () {
    const script = document.currentScript;
    const chatbotId = script.getAttribute("data-chatbot-id");
    const host = new URL(script.src).origin;

    if (!chatbotId) {
        console.error("Chatbot Widget: Missing data-chatbot-id attribute");
        return;
    }

    // Create Container
    const container = document.createElement("div");
    container.id = "rag-chatbot-widget";
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "flex-end";
    container.style.gap = "10px";
    document.body.appendChild(container);

    // Create IFrame (Hidden initially)
    const iframe = document.createElement("iframe");
    iframe.src = `${host}/embed/${chatbotId}`;
    iframe.style.width = "400px";
    iframe.style.height = "600px";
    iframe.style.maxHeight = "80vh";
    iframe.style.maxWidth = "calc(100vw - 40px)";
    iframe.style.border = "none";
    iframe.style.borderRadius = "12px";
    iframe.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    iframe.style.display = "none";
    container.appendChild(iframe);

    // Create Launcher Button
    const button = document.createElement("button");
    button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
  `;
    button.style.width = "56px";
    button.style.height = "56px";
    button.style.borderRadius = "50%";
    button.style.backgroundColor = "#000";
    button.style.color = "#fff";
    button.style.border = "none";
    button.style.cursor = "pointer";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    button.style.transition = "transform 0.2s";

    let isOpen = false;

    button.onclick = () => {
        isOpen = !isOpen;
        iframe.style.display = isOpen ? "block" : "none";
        button.innerHTML = isOpen
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
    };

    container.appendChild(button);
})();
