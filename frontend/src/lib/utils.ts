import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { auth } from './auth';
import { toPng } from 'html-to-image';

const isServer = typeof window === "undefined"

const API_URL = isServer ? process.env.INTERNAL_API_URL : process.env.NEXT_PUBLIC_API_URL

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type DrawRoundedRectType = {
  ctx: any, 
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  radius?: number
}

export const downloadChart = ({ chartRef, title, description }: { chartRef: any, title?: string, description?: string }) => {
  if (chartRef?.current === null) return;

  // const svgElement = chartRef?.current.querySelector("svg");

  // if (!svgElement) return;
  // const texts = svgElement.querySelectorAll("text");
  // texts.forEach((text: any) => {
  //   text.setAttribute("font-family", "Arial");
  //   text.setAttribute("font-size", "12px");
  // });
  // const serializer = new XMLSerializer();
  // const svgString = serializer.serializeToString(svgElement);
  // const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  // const url = URL.createObjectURL(svgBlob);

  // const img = new Image();
  // img.onload = () => {
  //   const canvas = document.createElement("canvas");
  //   const headerHeight = 80;
  //   canvas.width = svgElement.clientWidth + 20;
  //   canvas.height = svgElement.clientHeight + 80;
  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return

  //   ctx.font = "bold 12px Arial"
  //   ctx.fillStyle = "#FFFFFF";
  //   // ctx.fillRect(0, 0, canvas.width, canvas.height);
  //   drawRoundedRect({ctx, x: 0, y: 0, width: canvas.width, height: canvas.height, radius: 10});

  //   if (title) {
  //     // Desenhar título
  //     ctx.fillStyle = "#000000";
  //     ctx.font = "bold 16px Arial";
  //     ctx.fillText(title, 20, 30);
  //   }

  //   if (description) {
  //     // Desenhar descrição
  //     ctx.font = "12px Arial";
  //     ctx.fillText(description, 20, 50);
  //   }

  //   ctx.drawImage(img, 0, headerHeight);

  //   // Criar link para download
  //   const link = document.createElement("a");
  //   link.href = canvas.toDataURL("image/png");
  //   link.download = "grafico.png";
  //   link.click();

  //   URL.revokeObjectURL(url);
  // };

  // img.src = url;

    toPng(chartRef.current, {
        backgroundColor: '#ffffff', // 🎨 define fundo branco
      })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'grafico.png';
        link.click();
      })
      .catch((error) => {
        console.log('Erro ao capturar o gráfico', error)
      })
}

export const getAcionamento = (acionamento: string) => {
  switch(acionamento) {
    case "botao_alerta": return "BOTÃO DE ALERTA";
    case "numero_190": return "190";
    case "monitoramento": return "MONITORAMENTO";
  }
}

export const drawRoundedRect = ({ ctx, x, y, width, height, radius = 10 }: DrawRoundedRectType) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
};

export const fetchAPI = async (route: string, options?: any) => {
  try {
    const session = await auth();
    const url = route.startsWith('/') ? route : '/' + route;
    if (session) {
        const response = await fetch(`${API_URL}${url}`, {
          ...options
          ,
          method: options?.method || "GET",
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              "Authorization": `Bearer ${session?.accessToken!}`
          },
          body: JSON.stringify(options?.data)
      })
      .then(response => response.json())

      return response
    }
  } catch(error) {
    console.log("Error fetching Data:", error)
    return []
  }
  
}

export function convertToCSV(data: any[]) {
  if (!data.length) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(';'), // header row
    ...data.map(row =>
      headers.map(fieldName => JSON.stringify(row[fieldName] ?? '')).join(';')
    )
  ];

  const csv = csvRows.join('\n');

  return '\uFEFF' + csv;
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const formatData = ({ data }: { data: any }) => {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(data));
}

export const formatHora = ({ hora }: { hora: any }) => {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(hora));
}

// Função para quebrar os rótulos do eixo Y em duas linhas
export const formatLabel = (label: string) => {
  const words = label.split(" ");
  if (words.length > 2) {
    return [words.slice(0, 2).join(" "), words.slice(2).join(" ")]; // Divide após 2 palavras
  }
  return [label];
};

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}
