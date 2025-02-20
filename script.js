document.addEventListener("DOMContentLoaded", function () {
  // Criar conexões de rede dinamicamente
  createNetworkConnections();

  // Adicionar interatividade aos elementos
  setupInteractivity();
});

function createNetworkConnections() {
  const svg = document.querySelector("svg");
  const networkConnections = document.querySelector(".network-connections");
  const switchPosition = { x: 390, y: 470 };

  // Garantir que as conexões sejam criadas antes dos PCs
  networkConnections.style.zIndex = "1";

  const pcRows = [
    { y: 155, startX: 110 }, // Primeira fileira
    { y: 255, startX: 115 }, // Segunda fileira
    { y: 355, startX: 120 }, // Terceira fileira
  ];

  // Criar grupo para as conexões
  const cablesGroup = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  cablesGroup.setAttribute("class", "cables-group");

  pcRows.forEach((row, rowIndex) => {
    for (let i = 0; i < 8; i++) {
      const pcX = row.startX + i * 80;
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );

      const corridorX = pcX;
      const switchY = switchPosition.y - rowIndex * 3 - i * 0;

      const pathD = `M ${pcX} ${row.y + 15}
                     L ${pcX} ${switchPosition.y - 50}
                     L ${switchPosition.x} ${switchY}`;

      path.setAttribute("d", pathD);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "black");
      path.setAttribute("stroke-dasharray", "5,5");
      path.setAttribute("class", "cable");
      path.setAttribute("pointer-events", "none"); // Impedir que os cabos interfiram nos cliques

      // Criar conector no PC
      const connectorPC = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      connectorPC.setAttribute("cx", pcX);
      connectorPC.setAttribute("cy", row.y + 15);
      connectorPC.setAttribute("r", "3");
      connectorPC.setAttribute("fill", "black");
      connectorPC.setAttribute("class", "connector");
      connectorPC.setAttribute("pointer-events", "none"); // Impedir que os conectores interfiram nos cliques

      cablesGroup.appendChild(path);
      cablesGroup.appendChild(connectorPC);
    }
  });

  // Adicionar o grupo de cabos ao networkConnections
  networkConnections.appendChild(cablesGroup);
}

function setupInteractivity() {
  // Ajuste na interatividade dos PCs
  const pcs = document.querySelectorAll(".pc-icon");
  pcs.forEach((pc, index) => {
    pc.style.cursor = "pointer"; // Garantir que o cursor mude ao passar sobre os PCs
    pc.setAttribute("pointer-events", "all"); // Garantir que os PCs recebam eventos de clique
    pc.addEventListener("click", function (event) {
      event.stopPropagation(); // Impedir propagação do evento
      const pcNumber = index + 1;
      showDeviceInfo(event, "PC", pcNumber);
    });
  });
  // Interatividade para dispositivos de rede
  const networkDevices = document.querySelectorAll(".network-device");
  networkDevices.forEach((device) => {
    device.addEventListener("click", function (event) {
      const deviceType = device.classList.contains("switch")
        ? "Switch"
        : "Router";
      showDeviceInfo(event, deviceType);
    });
  });

  // Interatividade para cabos
  const cables = document.querySelectorAll(".cable");
  cables.forEach((cable) => {
    cable.addEventListener("mouseover", function () {
      this.style.strokeWidth = "2";
      this.style.stroke = "#4a90e2";
    });
    cable.addEventListener("mouseout", function () {
      this.style.strokeWidth = "1";
      this.style.stroke = "black";
    });
  });
}

function showDeviceInfo(event, type, number = null) {
  // Remover qualquer info-box existente
  const existingInfoBox = document.querySelector(".info-box");
  if (existingInfoBox) {
    existingInfoBox.remove();
  }

  const infoBox = document.createElement("div");
  infoBox.className = "info-box";
  let message = "";

  if (type === "PC") {
    message = `PC ${number}\n`;
    message += `Status: Conectado\n`;
    message += `IP: 192.168.1.${number}\n`;
    message += `MAC: 00:1A:2B:3C:${number.toString(16).padStart(2, "0")}:FF`;
  } else if (type === "Switch") {
    message = `Switch Gerenciável\n`;
    message += `Status: Ativo\n`;
    message += `Portas: 24\n`;
    message += `IP: 192.168.1.254`;
  } else if (type === "Router") {
    message = `Roteador com Firewall\n`;
    message += `Status: Ativo\n`;
    message += `WAN IP: 200.100.50.1\n`;
    message += `LAN IP: 192.168.1.1`;
  }

  infoBox.textContent = message;
  document.body.appendChild(infoBox);

  // Posicionar a caixa próxima ao cursor do mouse
  const x = event.clientX;
  const y = event.clientY;

  // Estilos para a caixa de informações
  Object.assign(infoBox.style, {
    position: "fixed",
    left: `${x + 10}px`,
    top: `${y + 10}px`,
    padding: "15px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    zIndex: "1000",
    whiteSpace: "pre-line",
    fontSize: "14px",
    fontFamily: "Arial, sans-serif",
  });

  // Remover a caixa de informações ao clicar fora dela
  document.addEventListener("click", function removeInfoBox(e) {
    if (!infoBox.contains(e.target) && e.target !== event.target) {
      infoBox.remove();
      document.removeEventListener("click", removeInfoBox);
    }
  });

  // Remover a caixa de informações após alguns segundos
  setTimeout(() => {
    infoBox.remove();
  }, 5000);
}
