const { isMainThread, workerData } = require('worker_threads');
const { PrismaClient } = require('@prisma/client');

// Função que será executada em cada thread
async function createManyInThread(data: any) {
  const prisma = new PrismaClient();
  
  try {
    await prisma.model.createMany({
      data: data
    });
  } catch (error: any) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

// Função para iniciar as threads
export function startThreads(data: any, numThreads: number) {
  const chunkSize = Math.ceil(data.length / numThreads);
  
  for (let i = 0; i < numThreads; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    const chunkData = data.slice(start, end)
    
    const worker = new Worker(__filename, {
        workerData: chunkData
    } as any) as any;
    
    worker.on('error', (error: any) => {
      console.error(error);
    });
    
    worker.on('exit', (code: any) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
    });
  }
}

// Código executado na thread principal
async function main() {
  if (isMainThread) {
    // Dados a serem criados
    const data = [
      { name: 'John Doe' },
      { name: 'Jane Smith' },
      // ... mais dados
    ];
    
    // Número de threads
    const numThreads = 4;
    
    // Iniciar as threads
    startThreads(data, numThreads);
  } else {
    // Código executado em cada thread
    const data = workerData;
    await createManyInThread(data);
  }
}