export interface InteliHardwareItem {
  id: string;
  category: 'Estações de Trabalho & Servidores' | 'Dispositivos Embarcados & IoT' | 'Robótica & Sistemas Autônomos';
  name: string;
  quantity: string;
  specs: {
    cpuGpu?: string;
    ram?: string;
    storage?: string;
    connectivity?: string;
    specialFeatures?: string;
  };
  recommendedModules: string[];
  primaryUse: string;
  sourceRef: string;
}

export const INTELI_HARDWARE_INVENTORY: InteliHardwareItem[] = [
  {
    id: 'mac-mini-m4',
    category: 'Estações de Trabalho & Servidores',
    name: 'Apple Mac mini M4 (2024)',
    quantity: '11 Unidades no Laboratório',
    specs: {
      cpuGpu: 'Chip Apple M4 (CPU 10 núcleos, GPU 10 núcleos com Ray Tracing)',
      ram: '16 GB Memória Unificada (153 GB/s de banda)',
      storage: '512 GB SSD NVMe',
      connectivity: '3x Thunderbolt 4 / USB 4, HDMI 2.1, Wi-Fi 6E, Gigabit Ethernet',
      specialFeatures: 'Neural Engine 16-core (38 TOPS de processamento para IA local)',
    },
    recommendedModules: [
      'Módulo 6 de ES (Plataforma SOA / Mobile First)',
      'Módulo 10 de EC (Aplicações Hiperescaláveis)',
      'Módulo 2 do 1º Ano (Aplicação para Ambiente Web)',
    ],
    primaryUse: 'Compilação nativa de aplicativos móveis iOS via Xcode/Swift, desenvolvimento de aplicações híbridas (Flutter/React Native) e servidores locais de build de alta eficiência.',
    sourceRef: 'Mac mini - Especificações - Apple (BR)',
  },
  {
    id: 'dell-precision-3660',
    category: 'Estações de Trabalho & Servidores',
    name: 'Workstation Dell Precision 3660 Tower',
    quantity: '10 Unidades no Laboratório',
    specs: {
      cpuGpu: 'Intel Core i7 Workstation + NVIDIA RTX A4000 (16 GB VRAM GDDR6 dedicados)',
      ram: '32 GB DDR5 de alta velocidade',
      storage: '2 TB SSD NVMe M.2',
      connectivity: '4x DisplayPort 1.4, USB 3.2 Gen 2, Gigabit Ethernet',
      specialFeatures: 'Arquitetura NVIDIA Ampere com Tensor Cores e RT Cores para aceleração CUDA',
    },
    recommendedModules: [
      'Módulo 3 do 1º Ano (Lógica para Predição com IA)',
      'Módulo 9 de CC (Deep Learning Aplicado à Visão Computacional)',
      'Módulo 8 de SI (Big Data / Apache Spark)',
      'Módulo 7 de ES (Processamento de Linguagens Naturais - Texto/Áudio)',
    ],
    primaryUse: 'Treinamento acelerado por GPU via CUDA/PyTorch de redes neurais convolucionais (CNNs), processamento de grandes volumes de dados e modelos preditivos de médio porte.',
    sourceRef: 'Precision 3660 Tower Workstation - Dell',
  },
  {
    id: 'dell-precision-5860',
    category: 'Estações de Trabalho & Servidores',
    name: 'Workstation Dell Precision 5860 Tower (Servidor IA)',
    quantity: '1 Unidade Dedicada',
    specs: {
      cpuGpu: 'Intel Xeon W-series + NVIDIA RTX A6000 (48 GB VRAM GDDR6 dedicados)',
      ram: '64 GB RAM ECC DDR5 (correção de erros profissional)',
      storage: '2 TB SSD NVMe M.2 corporativo',
      connectivity: 'Ethernet nativa 1GbE + 10GbE de ultra-baixa latência',
      specialFeatures: '84 RT Cores e 336 Tensor Cores (48GB VRAM sem risco de estouro de memória)',
    },
    recommendedModules: [
      'Módulo 10 de CC (Aprendizado por Reforço / Reinforcement Learning)',
      'Módulo 11 de CC (Sistema de PLN com IA Generativa / LLMs)',
      'Módulo 11 de SI (Modelo Preditivo em Negócios usando Deep Learning)',
    ],
    primaryUse: 'Servidor centralizado de laboratório para treinamento de modelos massivos de Deep Learning, execução local e fine-tuning de Large Language Models (LLMs) abertos, RAG denso e visão computacional de ultra-alta resolução.',
    sourceRef: 'Precision 5860 Tower Specifications - Dell',
  },
  {
    id: 'raspberry-pi-5',
    category: 'Dispositivos Embarcados & IoT',
    name: 'Raspberry Pi 5 (4GB RAM) & ESP32 Dev Kits',
    quantity: '11 Unidades Raspberry Pi 5 + Kits ESP32',
    specs: {
      cpuGpu: 'Broadcom BCM2712 Quad-Core ARM Cortex-A76 @ 2.4GHz + VideoCore VII',
      ram: '4 GB LPDDR4X-4267 SDRAM',
      storage: 'MicroSD UHS-I e suporte a SSD NVMe via barramento PCIe',
      connectivity: 'Wi-Fi Dual-Band, Bluetooth 5.0, Gigabit Ethernet, 2x micro-HDMI 4Kp60',
      specialFeatures: 'Interface PCIe 2.0 x1 nativa para aceleradores de IA de borda (TPU/NPU) e 2x MIPI transceivers para câmeras/displays',
    },
    recommendedModules: [
      'Módulo 4 do 1º Ano (Solução para IoT)',
      'Módulo 11 de EC (Sistema em Edge Computing)',
      'Módulo 8 de CC (IDE para Dispositivos Sensoriais)',
    ],
    primaryUse: 'Prototipagem de nós de percepção de bancada, gateway de comunicação para redes de sensores e execução de IA leve na borda (Edge AI).',
    sourceRef: 'Inventário e Especificações de Hardware de Laboratório - EP',
  },
  {
    id: 'dobot-magician-lite',
    category: 'Robótica & Sistemas Autônomos',
    name: 'Braço Robótico Dobot Magician Lite',
    quantity: 'Kits com Esteiras Rolantes e Sensores',
    specs: {
      cpuGpu: 'Controlador embarcado multiprotocolo com barramento de atuadores',
      specialFeatures: '4 eixos articulados, payload de 250g, repetibilidade milimétrica de 0,2 mm',
      connectivity: 'Garra mecânica pneumática, ventosa a vácuo, caneta gráfica e kit de esteira rolante adaptável',
    },
    recommendedModules: [
      'Módulo 5 de EC (Automação de Processos e Sistemas)',
      'Módulo 8 de EC (Robô de Serviço Autônomo com IA Generativa)',
    ],
    primaryUse: 'Simulação de células de manufatura industrial, manipulação de itens em esteiras rolantes, automação de pick-and-place com controle computacional.',
    sourceRef: 'Brochure（Magician Lite）EN.pdf',
  },
  {
    id: 'unitree-go2',
    category: 'Robótica & Sistemas Autônomos',
    name: 'Robô Quadrúpede Autônomo Unitree Go2',
    quantity: 'Robô de Inspeção Autônoma',
    specs: {
      specialFeatures: 'LiDAR 4D Ultra-Wide (campo de visão hemisférico 360° x 90° com ponto cego ultra-reduzido)',
      cpuGpu: 'Articulações de alto torque com capacidade de corrida, salto e transposição de obstáculos e terrenos irregulares',
      connectivity: 'Wi-Fi 6, Bluetooth 5.2, módulo 4G e sistema de acompanhamento autônomo de pessoas ISS 2.0',
    },
    recommendedModules: [
      'Módulo 6 de EC (Robótica Móvel e Visão Computacional)',
      'Módulo 8 de EC (Robô de Serviço Autônomo com IA Generativa)',
      'Módulo 11 de EC (Sistema em Edge Computing)',
    ],
    primaryUse: 'Patrulhamento e inspeção de ambientes industriais/urbanos de difícil acesso, mapeamento de terrenos, navegação autônoma e integração de assistentes de voz/IA no robô.',
    sourceRef: 'Unitree Go2 – UnitreeRobotics',
  },
  {
    id: 'turtlebot3',
    category: 'Robótica & Sistemas Autônomos',
    name: 'Robô Móvel TurtleBot3 (Burger / Waffle Pi)',
    quantity: 'Plataformas Educacionais ROS Padrão',
    specs: {
      cpuGpu: 'Placa controladora OpenCR de 32 bits acoplada a uma Raspberry Pi',
      specialFeatures: 'Motores DYNAMIXEL de alta precisão com encoders integrados e odometria de rodas',
      connectivity: 'Sensor LiDAR 360° 2D, IMU de 9 eixos, compatibilidade integral com ROS 1 e ROS 2 (Nav2 e Cartographer)',
    },
    recommendedModules: [
      'Módulo 6 de EC (Robótica Móvel e Visão Computacional)',
      'Módulo 8 de EC (Robô de Serviço Autônomo / Mapeamento e Navegação SLAM)',
    ],
    primaryUse: 'Mapeamento autônomo indoor (Gmapping/Cartographer), planejamento de trajetórias de navegação e desvio de obstáculos em tempo real.',
    sourceRef: 'TurtleBot3 Official Documentation',
  },
  {
    id: 'dji-drones',
    category: 'Robótica & Sistemas Autônomos',
    name: 'Drones DJI para Inspeção Aérea e Fotogrametria',
    quantity: 'Drones de Inspeção de Voo Autônomo',
    specs: {
      specialFeatures: 'Câmeras CMOS de alta resolução (gravação 4K/8K), gimbal mecânico de 3 eixos estabilizado',
      connectivity: 'Sistema de detecção de obstáculos omnidirecional, posicionamento por satélite (GPS/RTK) e transmissão OcuSync de longo alcance',
    },
    recommendedModules: [
      'Módulo 9 de CC (Deep Learning Aplicado à Visão Computacional - Inspeção Aérea)',
      'Módulo 11 de EC (Sistema em Edge Computing)',
      'Módulo 9 de EC (Hiperconectividade para Cidades Inteligentes)',
    ],
    primaryUse: 'Inspeção aérea de infraestruturas (linhas de transmissão, dutos, rodovias), fotogrametria, mapeamento agrícola e monitoramento urbano.',
    sourceRef: 'Buy DJI Camera Drone for Professional Aerial Photography Now - DJI',
  },
];
